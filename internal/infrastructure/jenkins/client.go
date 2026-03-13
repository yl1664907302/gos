package jenkins

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	domain "gos/internal/domain/pipeline"
	pipelineparamdomain "gos/internal/domain/pipelineparam"
)

type Config struct {
	BaseURL    string
	Username   string
	APIToken   string
	TimeoutSec int
}

type Client struct {
	baseURL  string
	username string
	apiToken string
	client   *http.Client
}

func NewClient(cfg Config) *Client {
	timeout := cfg.TimeoutSec
	if timeout <= 0 {
		timeout = 5
	}
	return &Client{
		baseURL:  strings.TrimRight(strings.TrimSpace(cfg.BaseURL), "/"),
		username: strings.TrimSpace(cfg.Username),
		apiToken: strings.TrimSpace(cfg.APIToken),
		client: &http.Client{
			Timeout: time.Duration(timeout) * time.Second,
		},
	}
}

func (c *Client) ListJobs(ctx context.Context) ([]domain.JenkinsJob, error) {
	endpoint := c.baseURL + "/api/json?tree=jobs[name,url,jobs[name,url,jobs[name,url,jobs[name,url,jobs[name,url]]]]]"
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return nil, err
	}

	var resp struct {
		Jobs []jenkinsJobNode `json:"jobs"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}

	result := make([]domain.JenkinsJob, 0)
	flattenJenkinsJobs("", resp.Jobs, &result)
	return result, nil
}

func (c *Client) GetJob(ctx context.Context, fullName string) (domain.JenkinsJob, error) {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return domain.JenkinsJob{}, fmt.Errorf("job full name is required")
	}
	endpoint := c.baseURL + buildJenkinsJobAPIPath(fullName)
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return domain.JenkinsJob{}, err
	}

	var resp struct {
		Name string `json:"name"`
		URL  string `json:"url"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return domain.JenkinsJob{}, err
	}
	return domain.JenkinsJob{
		Name:     resp.Name,
		FullName: fullName,
		URL:      resp.URL,
	}, nil
}

func (c *Client) ListJobParamSets(ctx context.Context) ([]pipelineparamdomain.JenkinsJobParamSet, error) {
	jobs, err := c.ListJobs(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]pipelineparamdomain.JenkinsJobParamSet, 0, len(jobs))
	for _, job := range jobs {
		item, itemErr := c.getJobParamSet(ctx, job.FullName)
		if itemErr != nil {
			return nil, itemErr
		}
		result = append(result, item)
	}
	return result, nil
}

func (c *Client) getJobParamSet(ctx context.Context, fullName string) (pipelineparamdomain.JenkinsJobParamSet, error) {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return pipelineparamdomain.JenkinsJobParamSet{}, fmt.Errorf("job full name is required")
	}

	endpoint := c.baseURL + buildJenkinsJobAPIPath(fullName) +
		"?tree=name,fullName," +
		"actions[parameterDefinitions[name,description,_class,choices,defaultValue,defaultParameterValue[value]]]," +
		"property[parameterDefinitions[name,description,_class,choices,defaultValue,defaultParameterValue[value]]]"
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return pipelineparamdomain.JenkinsJobParamSet{}, err
	}

	var resp struct {
		Name     string `json:"name"`
		FullName string `json:"fullName"`
		Actions  []struct {
			ParameterDefinitions []json.RawMessage `json:"parameterDefinitions"`
		} `json:"actions"`
		Properties []struct {
			ParameterDefinitions []json.RawMessage `json:"parameterDefinitions"`
		} `json:"property"`
	}
	if err := json.Unmarshal(body, &resp); err != nil {
		return pipelineparamdomain.JenkinsJobParamSet{}, err
	}

	params := make([]pipelineparamdomain.JenkinsParamSnapshot, 0)
	seen := make(map[string]struct{})
	for _, action := range resp.Actions {
		if err := appendParsedJenkinsParams(action.ParameterDefinitions, &params, seen); err != nil {
			return pipelineparamdomain.JenkinsJobParamSet{}, err
		}
	}
	for _, property := range resp.Properties {
		if err := appendParsedJenkinsParams(property.ParameterDefinitions, &params, seen); err != nil {
			return pipelineparamdomain.JenkinsJobParamSet{}, err
		}
	}

	return pipelineparamdomain.JenkinsJobParamSet{
		JobName:     strings.TrimSpace(resp.Name),
		JobFullName: fullName,
		Params:      params,
	}, nil
}

func appendParsedJenkinsParams(
	rawItems []json.RawMessage,
	target *[]pipelineparamdomain.JenkinsParamSnapshot,
	seen map[string]struct{},
) error {
	for index, raw := range rawItems {
		param, ok, parseErr := parseJenkinsParamDefinition(raw, index+1)
		if parseErr != nil {
			return parseErr
		}
		if !ok {
			continue
		}
		if _, exists := seen[param.Name]; exists {
			continue
		}
		seen[param.Name] = struct{}{}
		*target = append(*target, param)
	}
	return nil
}

func parseJenkinsParamDefinition(raw json.RawMessage, sortNo int) (pipelineparamdomain.JenkinsParamSnapshot, bool, error) {
	var definition struct {
		Class                 string          `json:"_class"`
		Name                  string          `json:"name"`
		Description           string          `json:"description"`
		Choices               []string        `json:"choices"`
		DefaultValue          any             `json:"defaultValue"`
		DefaultParameterValue json.RawMessage `json:"defaultParameterValue"`
	}
	if err := json.Unmarshal(raw, &definition); err != nil {
		return pipelineparamdomain.JenkinsParamSnapshot{}, false, err
	}

	name := strings.TrimSpace(definition.Name)
	if name == "" {
		return pipelineparamdomain.JenkinsParamSnapshot{}, false, nil
	}

	defaultValue := stringifyDefaultValue(definition.DefaultValue)
	if len(definition.DefaultParameterValue) > 0 {
		var payload struct {
			Value any `json:"value"`
		}
		if err := json.Unmarshal(definition.DefaultParameterValue, &payload); err == nil {
			defaultValue = stringifyDefaultValue(payload.Value)
		}
	}

	rawMeta := "{}"
	if trimmed := strings.TrimSpace(string(raw)); trimmed != "" {
		rawMeta = trimmed
	}

	return pipelineparamdomain.JenkinsParamSnapshot{
		Name:         name,
		ParamType:    inferPipelineParamType(definition.Class, definition.Choices, definition.DefaultValue, defaultValue),
		Required:     false,
		DefaultValue: defaultValue,
		Description:  strings.TrimSpace(definition.Description),
		RawMeta:      rawMeta,
		SortNo:       sortNo,
	}, true, nil
}

func inferPipelineParamType(class string, choices []string, defaultValue any, defaultValueStr string) pipelineparamdomain.ParamType {
	lowerClass := strings.ToLower(strings.TrimSpace(class))
	switch {
	case len(choices) > 0 ||
		strings.Contains(lowerClass, "choice") ||
		strings.Contains(lowerClass, "gitparameter"):
		return pipelineparamdomain.ParamTypeChoice
	case strings.Contains(lowerClass, "boolean"):
		return pipelineparamdomain.ParamTypeBool
	case strings.Contains(lowerClass, "number"),
		strings.Contains(lowerClass, "float"),
		strings.Contains(lowerClass, "int"):
		return pipelineparamdomain.ParamTypeNumber
	}

	switch defaultValue.(type) {
	case float64, float32, int, int64, int32, uint, uint64:
		return pipelineparamdomain.ParamTypeNumber
	case bool:
		return pipelineparamdomain.ParamTypeBool
	}
	if defaultValueStr != "" {
		if _, err := strconv.ParseFloat(defaultValueStr, 64); err == nil {
			return pipelineparamdomain.ParamTypeNumber
		}
		if _, err := strconv.ParseBool(defaultValueStr); err == nil {
			return pipelineparamdomain.ParamTypeBool
		}
	}
	return pipelineparamdomain.ParamTypeString
}

func stringifyDefaultValue(value any) string {
	switch typed := value.(type) {
	case nil:
		return ""
	case string:
		return typed
	case bool:
		if typed {
			return "true"
		}
		return "false"
	case float64:
		return strconv.FormatFloat(typed, 'f', -1, 64)
	case float32:
		return strconv.FormatFloat(float64(typed), 'f', -1, 32)
	case int:
		return strconv.Itoa(typed)
	case int64:
		return strconv.FormatInt(typed, 10)
	case int32:
		return strconv.FormatInt(int64(typed), 10)
	case uint:
		return strconv.FormatUint(uint64(typed), 10)
	case uint64:
		return strconv.FormatUint(typed, 10)
	default:
		bytes, err := json.Marshal(typed)
		if err != nil {
			return fmt.Sprintf("%v", typed)
		}
		return string(bytes)
	}
}

type jenkinsJobNode struct {
	Name string           `json:"name"`
	URL  string           `json:"url"`
	Jobs []jenkinsJobNode `json:"jobs"`
}

func flattenJenkinsJobs(prefix string, jobs []jenkinsJobNode, result *[]domain.JenkinsJob) {
	for _, job := range jobs {
		fullName := job.Name
		if prefix != "" {
			fullName = prefix + "/" + job.Name
		}
		if len(job.Jobs) > 0 {
			flattenJenkinsJobs(fullName, job.Jobs, result)
			continue
		}
		*result = append(*result, domain.JenkinsJob{
			Name:     job.Name,
			FullName: fullName,
			URL:      job.URL,
		})
	}
}

func buildJenkinsJobAPIPath(fullName string) string {
	parts := strings.Split(strings.Trim(fullName, "/"), "/")
	var builder strings.Builder
	for _, part := range parts {
		if strings.TrimSpace(part) == "" {
			continue
		}
		builder.WriteString("/job/")
		builder.WriteString(part)
	}
	builder.WriteString("/api/json")
	return builder.String()
}

func (c *Client) get(ctx context.Context, url string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	if c.username != "" && c.apiToken != "" {
		req.SetBasicAuth(c.username, c.apiToken)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return nil, err
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("jenkins request failed: status=%d body=%s", resp.StatusCode, strings.TrimSpace(string(body)))
	}
	return body, nil
}
