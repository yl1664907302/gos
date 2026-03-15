package jenkins

import (
	"bytes"
	"context"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"html"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	domain "gos/internal/domain/pipeline"
	pipelineparamdomain "gos/internal/domain/pipelineparam"
	releasedomain "gos/internal/domain/release"
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
	flattenJenkinsJobs(c.baseURL, "", resp.Jobs, &result)
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
		URL:      c.BuildJobURL(fullName),
	}, nil
}

func (c *Client) BuildJobURL(fullName string) string {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return ""
	}
	return c.baseURL + buildJenkinsJobPath(fullName) + "/"
}

func (c *Client) GetPipelineScript(ctx context.Context, fullName string) (domain.JenkinsPipelineScript, error) {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return domain.JenkinsPipelineScript{}, fmt.Errorf("job full name is required")
	}

	body, err := c.GetPipelineConfigXML(ctx, fullName)
	if err != nil {
		return domain.JenkinsPipelineScript{}, err
	}

	var config struct {
		Description string `xml:"description"`
		Definition  struct {
			Class      string `xml:"class,attr"`
			Script     string `xml:"script"`
			Sandbox    bool   `xml:"sandbox"`
			ScriptPath string `xml:"scriptPath"`
		} `xml:"definition"`
	}
	if err := xml.Unmarshal([]byte(body), &config); err != nil {
		return domain.JenkinsPipelineScript{}, err
	}

	definitionClass := strings.TrimSpace(config.Definition.Class)
	script := strings.ReplaceAll(config.Definition.Script, "\r\n", "\n")
	script = strings.ReplaceAll(script, "\r", "\n")
	script = strings.TrimSpace(script)
	scriptPath := strings.TrimSpace(config.Definition.ScriptPath)
	fromSCM := strings.EqualFold(definitionClass, "org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition")

	return domain.JenkinsPipelineScript{
		DefinitionClass: definitionClass,
		Description:     strings.TrimSpace(config.Description),
		Script:          script,
		ScriptPath:      scriptPath,
		Sandbox:         config.Definition.Sandbox,
		FromSCM:         fromSCM,
	}, nil
}

func (c *Client) GetPipelineConfigXML(ctx context.Context, fullName string) (string, error) {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return "", fmt.Errorf("job full name is required")
	}

	endpoint := c.baseURL + buildJenkinsJobConfigPath(fullName)
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return "", err
	}
	body = normalizeXMLVersion(body)
	return string(body), nil
}

func (c *Client) CreateRawPipeline(ctx context.Context, fullName string, cfg domain.JenkinsRawPipelineConfig) error {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return fmt.Errorf("job full name is required")
	}
	jobName, parentPath := splitJenkinsJobFullName(fullName)
	if jobName == "" {
		return fmt.Errorf("job name is required")
	}
	endpoint := c.baseURL + buildJenkinsCreateItemPath(parentPath) + "?name=" + url.QueryEscape(jobName)
	return c.postXML(ctx, endpoint, buildRawPipelineConfigXML(cfg))
}

func (c *Client) UpdateRawPipeline(ctx context.Context, fullName string, cfg domain.JenkinsRawPipelineConfig) error {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return fmt.Errorf("job full name is required")
	}
	endpoint := c.baseURL + buildJenkinsJobConfigPath(fullName)
	return c.postXML(ctx, endpoint, buildRawPipelineConfigXML(cfg))
}

func (c *Client) DeletePipeline(ctx context.Context, fullName string) error {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return fmt.Errorf("job full name is required")
	}
	endpoint := buildJenkinsActionEndpoint(c.baseURL, buildJenkinsJobPath(fullName), "doDelete")
	if strings.TrimSpace(endpoint) == "" {
		return fmt.Errorf("job full name is required")
	}
	return c.postAction(ctx, endpoint)
}

func (c *Client) RenderRawPipelineConfigXML(cfg domain.JenkinsRawPipelineConfig) (string, error) {
	if strings.TrimSpace(cfg.Script) == "" {
		return "", fmt.Errorf("raw pipeline script is required")
	}
	return buildRawPipelineConfigXML(cfg), nil
}

func (c *Client) TriggerBuild(ctx context.Context, fullName string, params map[string]string) (string, error) {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return "", fmt.Errorf("job full name is required")
	}

	path := buildJenkinsJobPath(fullName)
	buildEndpoint := c.baseURL + path + "/build"
	buildWithParamsEndpoint := c.baseURL + path + "/buildWithParameters"
	form := url.Values{}
	for k, v := range params {
		key := strings.TrimSpace(k)
		if key == "" {
			continue
		}
		form.Set(key, v)
	}
	body := form.Encode()

	endpoints := make([]string, 0, 2)
	if len(form) > 0 {
		endpoints = append(endpoints, buildWithParamsEndpoint)
	} else {
		// Jenkins 参数化任务在 /build 空提交时会返回 400，兜底尝试 /buildWithParameters。
		endpoints = append(endpoints, buildEndpoint, buildWithParamsEndpoint)
	}

	var lastErr error
	for _, endpoint := range endpoints {
		queueURL, statusCode, err := c.post(ctx, endpoint, body, crumbHeader{})
		if err == nil {
			return queueURL, nil
		}

		if statusCode == http.StatusForbidden {
			crumbField, crumbValue, crumbErr := c.getCrumb(ctx)
			if crumbErr == nil {
				queueURL, _, crumbPostErr := c.post(ctx, endpoint, body, crumbHeader{field: crumbField, value: crumbValue})
				if crumbPostErr == nil {
					return queueURL, nil
				}
				lastErr = crumbPostErr
				continue
			}
		}

		lastErr = err
	}
	if lastErr == nil {
		lastErr = fmt.Errorf("trigger jenkins build failed")
	}
	return "", lastErr
}

func (c *Client) GetQueueItem(
	ctx context.Context,
	queueURL string,
) (executableURL string, cancelled bool, why string, err error) {
	endpoint := buildJenkinsAPIEndpoint(c.baseURL, queueURL, "cancelled,why,executable[url]")
	if endpoint == "" {
		return "", false, "", fmt.Errorf("queue url is required")
	}

	body, err := c.get(ctx, endpoint)
	if err != nil {
		return "", false, "", err
	}

	var payload struct {
		Cancelled  bool   `json:"cancelled"`
		Why        string `json:"why"`
		Executable struct {
			URL string `json:"url"`
		} `json:"executable"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return "", false, "", err
	}
	buildURL := strings.TrimSpace(payload.Executable.URL)
	if buildURL != "" {
		if normalized := resolveJenkinsResourcePrefix(c.baseURL, buildURL); normalized != "" {
			buildURL = strings.TrimRight(normalized, "/") + "/"
		}
	}
	return buildURL, payload.Cancelled, strings.TrimSpace(payload.Why), nil
}

func (c *Client) GetBuildStatus(ctx context.Context, buildURL string) (building bool, result string, err error) {
	endpoint := buildJenkinsAPIEndpoint(c.baseURL, buildURL, "building,result")
	if endpoint == "" {
		return false, "", fmt.Errorf("build url is required")
	}

	body, err := c.get(ctx, endpoint)
	if err != nil {
		return false, "", err
	}

	var payload struct {
		Building bool   `json:"building"`
		Result   string `json:"result"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return false, "", err
	}
	return payload.Building, strings.TrimSpace(payload.Result), nil
}

func (c *Client) GetBuildStages(
	ctx context.Context,
	buildURL string,
) ([]releasedomain.ReleaseOrderPipelineStage, error) {
	endpoint := buildJenkinsWFAPIEndpoint(c.baseURL, buildURL, "describe")
	if endpoint == "" {
		return nil, fmt.Errorf("build url is required")
	}

	body, err := c.get(ctx, endpoint)
	if err != nil {
		return nil, err
	}

	var payload struct {
		Stages []struct {
			ID              string `json:"id"`
			Name            string `json:"name"`
			Status          string `json:"status"`
			StartTimeMillis int64  `json:"startTimeMillis"`
			DurationMillis  int64  `json:"durationMillis"`
		} `json:"stages"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return nil, err
	}

	result := make([]releasedomain.ReleaseOrderPipelineStage, 0, len(payload.Stages))
	for index, item := range payload.Stages {
		stageKey := strings.TrimSpace(item.ID)
		if stageKey == "" {
			stageKey = strings.TrimSpace(item.Name)
		}
		if stageKey == "" {
			continue
		}

		startedAt := jenkinsMillisToTime(item.StartTimeMillis)
		finishedAt := deriveStageFinishedAt(startedAt, item.DurationMillis, item.Status)
		result = append(result, releasedomain.ReleaseOrderPipelineStage{
			StageKey:       stageKey,
			StageName:      strings.TrimSpace(item.Name),
			Status:         mapJenkinsStageStatus(item.Status),
			RawStatus:      strings.TrimSpace(item.Status),
			SortNo:         index + 1,
			DurationMillis: maxInt64(item.DurationMillis, 0),
			StartedAt:      startedAt,
			FinishedAt:     finishedAt,
		})
	}
	return result, nil
}

func (c *Client) GetBuildStageLog(
	ctx context.Context,
	buildURL string,
	stageKey string,
) (log releasedomain.ReleaseOrderPipelineStageLog, err error) {
	stageKey = strings.TrimSpace(stageKey)
	if stageKey == "" {
		return releasedomain.ReleaseOrderPipelineStageLog{}, fmt.Errorf("stage key is required")
	}

	detail, err := c.getBuildStageDetail(ctx, buildURL, stageKey)
	if err != nil {
		return releasedomain.ReleaseOrderPipelineStageLog{}, err
	}

	log = releasedomain.ReleaseOrderPipelineStageLog{
		StageName: strings.TrimSpace(detail.Name),
		RawStatus: strings.TrimSpace(detail.Status),
		HasMore:   false,
		FetchedAt: time.Now().UTC(),
	}

	nodes := detail.StageFlowNodes
	if len(nodes) == 0 {
		text, hasMore, logErr := c.getBuildNodeLog(ctx, buildURL, stageKey)
		if logErr != nil {
			return releasedomain.ReleaseOrderPipelineStageLog{}, logErr
		}
		log.Content = text
		log.HasMore = hasMore
		return log, nil
	}

	var builder strings.Builder
	for _, node := range nodes {
		text, hasMore, logErr := c.getBuildNodeLog(ctx, buildURL, node.ID)
		if logErr != nil {
			return releasedomain.ReleaseOrderPipelineStageLog{}, logErr
		}
		if hasMore {
			log.HasMore = true
		}
		text = strings.TrimSpace(text)
		if text == "" {
			continue
		}
		if builder.Len() > 0 {
			builder.WriteString("\n")
		}
		if len(nodes) > 1 {
			title := strings.TrimSpace(node.Name)
			if title == "" {
				title = "阶段节点"
			}
			builder.WriteString(">>> ")
			builder.WriteString(title)
			builder.WriteString("\n")
		}
		builder.WriteString(text)
		if !strings.HasSuffix(text, "\n") {
			builder.WriteString("\n")
		}
	}
	log.Content = strings.TrimSpace(builder.String())
	return log, nil
}

func (c *Client) GetBuildConsoleText(
	ctx context.Context,
	buildURL string,
	start int64,
) (content string, nextStart int64, moreData bool, err error) {
	if start < 0 {
		start = 0
	}
	endpoint := buildJenkinsProgressiveTextEndpoint(c.baseURL, buildURL, start)
	if endpoint == "" {
		return "", start, false, fmt.Errorf("build url is required")
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return "", start, false, err
	}
	if c.username != "" && c.apiToken != "" {
		req.SetBasicAuth(c.username, c.apiToken)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return "", start, false, err
	}
	defer func() { _ = resp.Body.Close() }()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return "", start, false, err
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return "", start, false, buildJenkinsHTTPError(resp.StatusCode, body)
	}

	nextStart = start
	if textSize := strings.TrimSpace(resp.Header.Get("X-Text-Size")); textSize != "" {
		if parsed, parseErr := strconv.ParseInt(textSize, 10, 64); parseErr == nil && parsed >= 0 {
			nextStart = parsed
		}
	}
	moreData = parseJenkinsMoreData(resp.Header.Get("X-More-Data"))

	return string(body), nextStart, moreData, nil
}

func (c *Client) AbortQueueItem(ctx context.Context, queueURL string) error {
	endpoint := buildJenkinsActionEndpoint(c.baseURL, queueURL, "cancelQueue")
	if endpoint == "" {
		return fmt.Errorf("queue url is required")
	}
	return c.postAction(ctx, endpoint)
}

func (c *Client) AbortBuild(ctx context.Context, buildURL string) error {
	endpoint := buildJenkinsActionEndpoint(c.baseURL, buildURL, "stop")
	if endpoint == "" {
		return fmt.Errorf("build url is required")
	}
	return c.postAction(ctx, endpoint)
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
		"actions[parameterDefinitions[name,description,_class,choices,value,type,multiSelectDelimiter,defaultValue,defaultParameterValue[value]]]," +
		"property[parameterDefinitions[name,description,_class,choices,value,type,multiSelectDelimiter,defaultValue,defaultParameterValue[value]]]"
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

	if fallback, err := c.loadExtendedChoiceFallback(ctx, fullName); err == nil {
		for idx, item := range params {
			choices, ok := fallback[item.Name]
			if !ok || len(choices.values) == 0 {
				continue
			}
			params[idx].RawMeta = mergeChoiceValuesIntoRawMeta(item.RawMeta, choices)
			if strings.TrimSpace(params[idx].DefaultValue) == "" && strings.TrimSpace(choices.defaultValue) != "" {
				params[idx].DefaultValue = strings.TrimSpace(choices.defaultValue)
			}
			params[idx].SingleSelect = inferPipelineSingleSelectFromRawMeta(params[idx].RawMeta, params[idx].SingleSelect)
		}
	}
	if err := c.loadGitParameterChoicesIntoParams(ctx, fullName, params); err == nil {
		// no-op: params are updated in place
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
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(raw, &fields); err != nil {
		return pipelineparamdomain.JenkinsParamSnapshot{}, false, err
	}

	name := strings.TrimSpace(readJSONString(fields["name"]))
	if name == "" {
		return pipelineparamdomain.JenkinsParamSnapshot{}, false, nil
	}

	className := strings.TrimSpace(readJSONString(fields["_class"]))
	typeName := strings.TrimSpace(readJSONString(fields["type"]))
	description := strings.TrimSpace(readJSONString(fields["description"]))
	choices := parseChoiceValues(fields["choices"])
	if len(choices) == 0 {
		choices = parseChoiceValues(fields["value"])
	}

	defaultValueAny, defaultValue, err := parseDefaultValue(fields["defaultValue"])
	if err != nil {
		return pipelineparamdomain.JenkinsParamSnapshot{}, false, err
	}
	if len(fields["defaultParameterValue"]) > 0 {
		var defaultParam struct {
			Value any `json:"value"`
		}
		if err := json.Unmarshal(fields["defaultParameterValue"], &defaultParam); err == nil {
			defaultValue = stringifyDefaultValue(defaultParam.Value)
			defaultValueAny = defaultParam.Value
		}
	}

	rawMeta := "{}"
	if trimmed := strings.TrimSpace(string(raw)); trimmed != "" {
		rawMeta = trimmed
	}

	return pipelineparamdomain.JenkinsParamSnapshot{
		Name:         name,
		ParamType:    inferPipelineParamType(className, choices, defaultValueAny, defaultValue),
		SingleSelect: inferPipelineSingleSelect(name, className, typeName, fields, len(choices)),
		Required:     false,
		DefaultValue: defaultValue,
		Description:  description,
		RawMeta:      rawMeta,
		SortNo:       sortNo,
	}, true, nil
}

func readJSONString(raw json.RawMessage) string {
	if len(raw) == 0 {
		return ""
	}
	var value string
	if err := json.Unmarshal(raw, &value); err == nil {
		return value
	}
	return ""
}

func parseDefaultValue(raw json.RawMessage) (any, string, error) {
	if len(raw) == 0 {
		return nil, "", nil
	}
	var value any
	if err := json.Unmarshal(raw, &value); err != nil {
		return nil, "", err
	}
	return value, stringifyDefaultValue(value), nil
}

func parseChoiceValues(raw json.RawMessage) []string {
	if len(raw) == 0 {
		return nil
	}

	var direct []string
	if err := json.Unmarshal(raw, &direct); err == nil {
		return normalizeChoiceValues(direct)
	}

	var anyArray []any
	if err := json.Unmarshal(raw, &anyArray); err == nil {
		values := make([]string, 0, len(anyArray))
		for _, item := range anyArray {
			values = append(values, stringifyDefaultValue(item))
		}
		return normalizeChoiceValues(values)
	}

	var text string
	if err := json.Unmarshal(raw, &text); err == nil {
		return normalizeChoiceValues(splitChoiceText(text))
	}

	var object map[string]json.RawMessage
	if err := json.Unmarshal(raw, &object); err == nil {
		for _, key := range []string{"values", "choices", "items", "list"} {
			if values := parseChoiceValues(object[key]); len(values) > 0 {
				return values
			}
		}
		if valueText := readJSONString(object["value"]); strings.TrimSpace(valueText) != "" {
			return normalizeChoiceValues(splitChoiceText(valueText))
		}
	}

	return nil
}

func splitChoiceText(value string) []string {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil
	}
	if strings.Contains(value, "\n") || strings.Contains(value, "\r") {
		normalized := strings.ReplaceAll(value, "\r\n", "\n")
		normalized = strings.ReplaceAll(normalized, "\r", "\n")
		return strings.Split(normalized, "\n")
	}
	if strings.Contains(value, ",") {
		return strings.Split(value, ",")
	}
	return []string{value}
}

func normalizeChoiceValues(values []string) []string {
	result := make([]string, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, item := range values {
		value := strings.TrimSpace(item)
		if value == "" {
			continue
		}
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	if len(result) == 0 {
		return nil
	}
	return result
}

type extendedChoiceFallback struct {
	values       []string
	delimiter    string
	typeName     string
	defaultValue string
}

func (c *Client) loadGitParameterChoicesIntoParams(
	ctx context.Context,
	fullName string,
	params []pipelineparamdomain.JenkinsParamSnapshot,
) error {
	for idx := range params {
		paramName := strings.TrimSpace(params[idx].Name)
		if paramName == "" {
			continue
		}
		if !isGitParameterRawMeta(params[idx].RawMeta) {
			continue
		}

		choices, err := c.loadGitParameterChoices(ctx, fullName, paramName)
		if err != nil || len(choices) == 0 {
			continue
		}

		params[idx].RawMeta = mergeChoiceValuesIntoRawMeta(
			params[idx].RawMeta,
			extendedChoiceFallback{
				values:    choices,
				delimiter: ",",
				typeName:  "GitParameterDefinition",
			},
		)
		params[idx].SingleSelect = true
	}
	return nil
}

func isGitParameterRawMeta(rawMeta string) bool {
	trimmed := strings.TrimSpace(rawMeta)
	if trimmed == "" {
		return false
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal([]byte(trimmed), &fields); err != nil {
		return false
	}
	className := strings.ToLower(strings.TrimSpace(readJSONString(fields["_class"])))
	typeName := strings.ToLower(strings.TrimSpace(readJSONString(fields["type"])))
	return strings.Contains(className, "gitparameterdefinition") || strings.Contains(typeName, "gitparameterdefinition")
}

func (c *Client) loadGitParameterChoices(ctx context.Context, fullName string, paramName string) ([]string, error) {
	escapedParam := url.QueryEscape(strings.TrimSpace(paramName))
	endpoint := c.baseURL + buildJenkinsJobPath(fullName) +
		"/descriptorByName/net.uaznia.lukanus.hudson.plugins.gitparameter.GitParameterDefinition/fillValueItems?param=" +
		escapedParam

	body, err := c.get(ctx, endpoint)
	if err != nil {
		return nil, err
	}

	var response struct {
		Values json.RawMessage `json:"values"`
	}
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}
	return parseGitParameterChoiceValues(response.Values), nil
}

func parseGitParameterChoiceValues(raw json.RawMessage) []string {
	if len(raw) == 0 {
		return nil
	}

	var direct []string
	if err := json.Unmarshal(raw, &direct); err == nil {
		return normalizeChoiceValues(direct)
	}

	var objects []map[string]any
	if err := json.Unmarshal(raw, &objects); err == nil {
		values := make([]string, 0, len(objects))
		for _, item := range objects {
			value := strings.TrimSpace(stringifyDefaultValue(item["value"]))
			if value == "" {
				value = strings.TrimSpace(stringifyDefaultValue(item["name"]))
			}
			if value == "" {
				continue
			}
			values = append(values, value)
		}
		return normalizeChoiceValues(values)
	}

	var anyArray []any
	if err := json.Unmarshal(raw, &anyArray); err == nil {
		values := make([]string, 0, len(anyArray))
		for _, item := range anyArray {
			switch typed := item.(type) {
			case map[string]any:
				value := strings.TrimSpace(stringifyDefaultValue(typed["value"]))
				if value == "" {
					value = strings.TrimSpace(stringifyDefaultValue(typed["name"]))
				}
				if value == "" {
					continue
				}
				values = append(values, value)
			default:
				value := strings.TrimSpace(stringifyDefaultValue(typed))
				if value != "" {
					values = append(values, value)
				}
			}
		}
		return normalizeChoiceValues(values)
	}
	return nil
}

func (c *Client) loadExtendedChoiceFallback(ctx context.Context, fullName string) (map[string]extendedChoiceFallback, error) {
	endpoint := c.baseURL + buildJenkinsJobConfigPath(fullName)
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return nil, err
	}
	body = normalizeXMLVersion(body)

	var config struct {
		Items []struct {
			Name                 string `xml:"name"`
			Type                 string `xml:"type"`
			Value                string `xml:"value"`
			MultiSelectDelimiter string `xml:"multiSelectDelimiter"`
			DefaultValue         string `xml:"defaultValue"`
		} `xml:"properties>hudson.model.ParametersDefinitionProperty>parameterDefinitions>com.cwctravel.hudson.plugins.extended__choice__parameter.ExtendedChoiceParameterDefinition"`
	}
	if err := xml.Unmarshal(body, &config); err != nil {
		return nil, err
	}

	result := make(map[string]extendedChoiceFallback)
	for _, item := range config.Items {
		name := strings.TrimSpace(item.Name)
		if name == "" {
			continue
		}
		delimiter := strings.TrimSpace(item.MultiSelectDelimiter)
		if delimiter == "" {
			delimiter = ","
		}
		result[name] = extendedChoiceFallback{
			values:       splitChoiceValueByDelimiter(item.Value, delimiter),
			delimiter:    delimiter,
			typeName:     strings.TrimSpace(item.Type),
			defaultValue: strings.TrimSpace(item.DefaultValue),
		}
	}
	return result, nil
}

func normalizeXMLVersion(body []byte) []byte {
	trimmed := bytes.TrimSpace(body)
	if !bytes.HasPrefix(trimmed, []byte("<?xml")) {
		return body
	}
	normalized := bytes.Replace(body, []byte("version='1.1'"), []byte("version='1.0'"), 1)
	normalized = bytes.Replace(normalized, []byte("version=\"1.1\""), []byte("version=\"1.0\""), 1)
	return normalized
}

func splitChoiceValueByDelimiter(value string, delimiter string) []string {
	text := strings.TrimSpace(value)
	if text == "" {
		return nil
	}
	if strings.Contains(text, "\n") || strings.Contains(text, "\r") {
		normalized := strings.ReplaceAll(text, "\r\n", "\n")
		normalized = strings.ReplaceAll(normalized, "\r", "\n")
		return normalizeChoiceValues(strings.Split(normalized, "\n"))
	}
	if delimiter != "" && strings.Contains(text, delimiter) {
		return normalizeChoiceValues(strings.Split(text, delimiter))
	}
	return normalizeChoiceValues(splitChoiceText(text))
}

func mergeChoiceValuesIntoRawMeta(rawMeta string, fallback extendedChoiceFallback) string {
	meta := make(map[string]any)
	trimmed := strings.TrimSpace(rawMeta)
	if trimmed != "" && trimmed != "{}" {
		if err := json.Unmarshal([]byte(trimmed), &meta); err != nil {
			meta = make(map[string]any)
		}
	}

	meta["choices"] = fallback.values
	if fallback.delimiter != "" {
		meta["multiSelectDelimiter"] = fallback.delimiter
	}
	if fallback.typeName != "" {
		meta["type"] = fallback.typeName
	}
	if fallback.defaultValue != "" {
		if _, ok := meta["defaultValue"]; !ok {
			meta["defaultValue"] = fallback.defaultValue
		}
	}

	bytes, err := json.Marshal(meta)
	if err != nil {
		if trimmed == "" {
			return "{}"
		}
		return trimmed
	}
	return string(bytes)
}

func inferPipelineSingleSelect(
	paramName string,
	className string,
	typeName string,
	fields map[string]json.RawMessage,
	choiceCount int,
) bool {
	lowerClass := strings.ToLower(strings.TrimSpace(className))
	lowerType := strings.ToLower(strings.TrimSpace(typeName))
	lowerName := strings.ToLower(strings.TrimSpace(paramName))

	if lowerName == "branch" {
		return true
	}

	if readJSONBool(fields["multiSelect"]) || readJSONBool(fields["multi_select"]) || readJSONBool(fields["isMulti"]) {
		return false
	}
	if strings.Contains(lowerType, "multi") ||
		strings.Contains(lowerType, "checkbox") ||
		strings.Contains(lowerClass, "multiselect") ||
		strings.Contains(lowerClass, "checkbox") {
		return false
	}
	if strings.Contains(lowerClass, "gitparameter") ||
		strings.Contains(lowerType, "single") ||
		strings.Contains(lowerType, "radio") ||
		strings.Contains(lowerClass, "choiceparameterdefinition") {
		return true
	}
	if choiceCount > 1 {
		return false
	}
	return false
}

func inferPipelineSingleSelectFromRawMeta(rawMeta string, fallback bool) bool {
	trimmed := strings.TrimSpace(rawMeta)
	if trimmed == "" {
		return fallback
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal([]byte(trimmed), &fields); err != nil {
		return fallback
	}

	className := strings.TrimSpace(readJSONString(fields["_class"]))
	typeName := strings.TrimSpace(readJSONString(fields["type"]))
	lowerClass := strings.ToLower(className)
	lowerType := strings.ToLower(typeName)
	choices := parseChoiceValues(fields["choices"])
	if len(choices) == 0 {
		choices = parseChoiceValues(fields["value"])
	}

	if readJSONBool(fields["multiSelect"]) || readJSONBool(fields["multi_select"]) || readJSONBool(fields["isMulti"]) {
		return false
	}
	if strings.Contains(lowerType, "multi") ||
		strings.Contains(lowerType, "checkbox") ||
		strings.Contains(lowerClass, "multiselect") ||
		strings.Contains(lowerClass, "checkbox") {
		return false
	}
	if strings.Contains(lowerClass, "gitparameter") ||
		strings.Contains(lowerType, "single") ||
		strings.Contains(lowerType, "radio") ||
		strings.Contains(lowerClass, "choiceparameterdefinition") {
		return true
	}
	if len(choices) > 1 {
		return false
	}
	return fallback
}

func readJSONBool(raw json.RawMessage) bool {
	if len(raw) == 0 {
		return false
	}
	var value bool
	if err := json.Unmarshal(raw, &value); err == nil {
		return value
	}
	var text string
	if err := json.Unmarshal(raw, &text); err == nil {
		parsed, parseErr := strconv.ParseBool(strings.TrimSpace(text))
		if parseErr == nil {
			return parsed
		}
	}
	return false
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

func flattenJenkinsJobs(baseURL string, prefix string, jobs []jenkinsJobNode, result *[]domain.JenkinsJob) {
	for _, job := range jobs {
		fullName := job.Name
		if prefix != "" {
			fullName = prefix + "/" + job.Name
		}
		if len(job.Jobs) > 0 {
			flattenJenkinsJobs(baseURL, fullName, job.Jobs, result)
			continue
		}
		*result = append(*result, domain.JenkinsJob{
			Name:     job.Name,
			FullName: fullName,
			URL:      strings.TrimSpace(buildJenkinsOriginalURL(baseURL, fullName, job.URL)),
		})
	}
}

func buildJenkinsOriginalURL(baseURL string, fullName string, fallback string) string {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName != "" {
		return strings.TrimRight(strings.TrimSpace(baseURL), "/") + buildJenkinsJobPath(fullName) + "/"
	}
	return strings.TrimSpace(resolveJenkinsResourcePrefix(baseURL, fallback))
}

func buildJenkinsJobAPIPath(fullName string) string {
	return buildJenkinsJobPath(fullName) + "/api/json"
}

func buildJenkinsAPIEndpoint(baseURL string, resourceURL string, tree string) string {
	prefix := resolveJenkinsResourcePrefix(baseURL, resourceURL)
	if prefix == "" {
		return ""
	}
	if strings.TrimSpace(tree) == "" {
		return prefix + "/api/json"
	}
	return prefix + "/api/json?tree=" + tree
}

func buildJenkinsWFAPIEndpoint(baseURL string, resourceURL string, suffix string) string {
	prefix := resolveJenkinsResourcePrefix(baseURL, resourceURL)
	if prefix == "" {
		return ""
	}
	suffix = strings.Trim(strings.TrimSpace(suffix), "/")
	if suffix == "" {
		return prefix + "/wfapi"
	}
	return prefix + "/wfapi/" + suffix
}

func buildJenkinsProgressiveTextEndpoint(baseURL string, buildURL string, start int64) string {
	prefix := resolveJenkinsResourcePrefix(baseURL, buildURL)
	if prefix == "" {
		return ""
	}
	if start < 0 {
		start = 0
	}
	return fmt.Sprintf("%s/logText/progressiveText?start=%d", prefix, start)
}

func (c *Client) getBuildStageDetail(
	ctx context.Context,
	buildURL string,
	stageKey string,
) (struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Status         string `json:"status"`
	StageFlowNodes []struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	} `json:"stageFlowNodes"`
}, error) {
	var payload struct {
		ID             string `json:"id"`
		Name           string `json:"name"`
		Status         string `json:"status"`
		StageFlowNodes []struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"stageFlowNodes"`
	}

	resourceURL := resolveJenkinsResourcePrefix(c.baseURL, buildURL)
	if resourceURL == "" {
		return payload, fmt.Errorf("build url is required")
	}
	endpoint := strings.TrimRight(resourceURL, "/") + "/execution/node/" + url.PathEscape(strings.TrimSpace(stageKey)) + "/wfapi/describe"
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return payload, err
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return payload, err
	}
	return payload, nil
}

func (c *Client) getBuildNodeLog(
	ctx context.Context,
	buildURL string,
	nodeID string,
) (content string, hasMore bool, err error) {
	resourceURL := resolveJenkinsResourcePrefix(c.baseURL, buildURL)
	if resourceURL == "" {
		return "", false, fmt.Errorf("build url is required")
	}
	nodeID = strings.TrimSpace(nodeID)
	if nodeID == "" {
		return "", false, fmt.Errorf("node id is required")
	}
	endpoint := strings.TrimRight(resourceURL, "/") + "/execution/node/" + url.PathEscape(nodeID) + "/wfapi/log"
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return "", false, err
	}

	var payload struct {
		Text    string `json:"text"`
		HasMore bool   `json:"hasMore"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return "", false, err
	}
	return normalizeJenkinsLogContent(payload.Text), payload.HasMore, nil
}

func buildJenkinsActionEndpoint(baseURL string, resourceURL string, action string) string {
	prefix := resolveJenkinsResourcePrefix(baseURL, resourceURL)
	if prefix == "" {
		return ""
	}

	action = strings.Trim(strings.TrimSpace(action), "/")
	if action == "" {
		return prefix
	}
	return prefix + "/" + action
}

func resolveJenkinsResourcePrefix(baseURL string, resourceURL string) string {
	trimmed := strings.TrimSpace(resourceURL)
	if trimmed == "" {
		return ""
	}
	base := strings.TrimRight(strings.TrimSpace(baseURL), "/")

	if strings.HasPrefix(trimmed, "http://") || strings.HasPrefix(trimmed, "https://") {
		parsedResource, resourceErr := url.Parse(trimmed)
		parsedBase, baseErr := url.Parse(base)
		if resourceErr == nil && baseErr == nil && parsedBase.Scheme != "" && parsedBase.Host != "" {
			parsedResource.Scheme = parsedBase.Scheme
			parsedResource.Host = parsedBase.Host
			parsedResource.User = parsedBase.User
			parsedResource.Fragment = ""
			return strings.TrimRight(parsedResource.String(), "/")
		}
		return strings.TrimRight(trimmed, "/")
	}
	if strings.HasPrefix(trimmed, "/") {
		return base + strings.TrimRight(trimmed, "/")
	}
	return base + "/" + strings.Trim(trimmed, "/")
}

func jenkinsMillisToTime(value int64) *time.Time {
	if value <= 0 {
		return nil
	}
	t := time.UnixMilli(value).UTC()
	return &t
}

func deriveStageFinishedAt(startedAt *time.Time, durationMillis int64, rawStatus string) *time.Time {
	if startedAt == nil || durationMillis <= 0 {
		return nil
	}
	status := strings.ToUpper(strings.TrimSpace(rawStatus))
	switch status {
	case "IN_PROGRESS", "PAUSED_PENDING_INPUT":
		return nil
	default:
		t := startedAt.Add(time.Duration(durationMillis) * time.Millisecond)
		return &t
	}
}

func maxInt64(value int64, minimum int64) int64 {
	if value < minimum {
		return minimum
	}
	return value
}

func mapJenkinsStageStatus(raw string) releasedomain.PipelineStageStatus {
	switch strings.ToUpper(strings.TrimSpace(raw)) {
	case "SUCCESS":
		return releasedomain.PipelineStageStatusSuccess
	case "FAILED", "FAILURE", "ERROR", "UNSTABLE":
		return releasedomain.PipelineStageStatusFailed
	case "ABORTED":
		return releasedomain.PipelineStageStatusCancelled
	case "NOT_EXECUTED":
		return releasedomain.PipelineStageStatusSkipped
	case "IN_PROGRESS", "PAUSED_PENDING_INPUT":
		return releasedomain.PipelineStageStatusRunning
	case "PENDING", "QUEUED":
		return releasedomain.PipelineStageStatusPending
	default:
		return releasedomain.PipelineStageStatusPending
	}
}

func buildJenkinsJobConfigPath(fullName string) string {
	return buildJenkinsJobPath(fullName) + "/config.xml"
}

func buildJenkinsCreateItemPath(parentFullName string) string {
	parentFullName = strings.Trim(strings.TrimSpace(parentFullName), "/")
	if parentFullName == "" {
		return "/createItem"
	}
	return buildJenkinsJobPath(parentFullName) + "/createItem"
}

func buildJenkinsJobPath(fullName string) string {
	parts := strings.Split(strings.Trim(fullName, "/"), "/")
	var builder strings.Builder
	for _, part := range parts {
		if strings.TrimSpace(part) == "" {
			continue
		}
		builder.WriteString("/job/")
		builder.WriteString(part)
	}
	return builder.String()
}

func splitJenkinsJobFullName(fullName string) (jobName string, parentPath string) {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return "", ""
	}
	parts := strings.Split(fullName, "/")
	jobName = strings.TrimSpace(parts[len(parts)-1])
	if len(parts) > 1 {
		parentPath = strings.Join(parts[:len(parts)-1], "/")
	}
	return jobName, strings.Trim(strings.TrimSpace(parentPath), "/")
}

type crumbHeader struct {
	field string
	value string
}

func (c *Client) getCrumb(ctx context.Context) (string, string, error) {
	endpoint := c.baseURL + "/crumbIssuer/api/json"
	body, err := c.get(ctx, endpoint)
	if err != nil {
		return "", "", err
	}

	var payload struct {
		CrumbRequestField string `json:"crumbRequestField"`
		Crumb             string `json:"crumb"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return "", "", err
	}
	field := strings.TrimSpace(payload.CrumbRequestField)
	value := strings.TrimSpace(payload.Crumb)
	if field == "" || value == "" {
		return "", "", fmt.Errorf("jenkins crumb is empty")
	}
	return field, value, nil
}

func (c *Client) post(ctx context.Context, endpoint string, encodedForm string, crumb crumbHeader) (string, int, error) {
	var bodyReader io.Reader
	if encodedForm != "" {
		bodyReader = strings.NewReader(encodedForm)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bodyReader)
	if err != nil {
		return "", 0, err
	}
	if c.username != "" && c.apiToken != "" {
		req.SetBasicAuth(c.username, c.apiToken)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	if crumb.field != "" && crumb.value != "" {
		req.Header.Set(crumb.field, crumb.value)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return "", 0, err
	}
	defer func() { _ = resp.Body.Close() }()

	responseBody, readErr := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if readErr != nil {
		return "", resp.StatusCode, readErr
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return "", resp.StatusCode, buildJenkinsHTTPError(resp.StatusCode, responseBody)
	}
	queueURL := strings.TrimSpace(resp.Header.Get("Location"))
	return queueURL, resp.StatusCode, nil
}

func (c *Client) postXML(ctx context.Context, endpoint string, payload string) error {
	statusCode, err := c.postXMLOnce(ctx, endpoint, payload, crumbHeader{})
	if err == nil {
		return nil
	}
	if statusCode == http.StatusForbidden {
		crumbField, crumbValue, crumbErr := c.getCrumb(ctx)
		if crumbErr == nil {
			if _, retryErr := c.postXMLOnce(ctx, endpoint, payload, crumbHeader{field: crumbField, value: crumbValue}); retryErr == nil {
				return nil
			} else {
				err = retryErr
			}
		}
	}
	return err
}

func (c *Client) postXMLOnce(ctx context.Context, endpoint string, payload string, crumb crumbHeader) (int, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, strings.NewReader(payload))
	if err != nil {
		return 0, err
	}
	if c.username != "" && c.apiToken != "" {
		req.SetBasicAuth(c.username, c.apiToken)
	}
	req.Header.Set("Content-Type", "application/xml")
	if crumb.field != "" && crumb.value != "" {
		req.Header.Set(crumb.field, crumb.value)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return 0, err
	}
	defer func() { _ = resp.Body.Close() }()

	body, readErr := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if readErr != nil {
		return resp.StatusCode, readErr
	}
	if resp.StatusCode >= http.StatusOK && resp.StatusCode < http.StatusBadRequest {
		return resp.StatusCode, nil
	}
	return resp.StatusCode, buildJenkinsHTTPError(resp.StatusCode, body)
}

func buildRawPipelineConfigXML(cfg domain.JenkinsRawPipelineConfig) string {
	sandbox := "false"
	if cfg.Sandbox {
		sandbox = "true"
	}

	var descriptionBuilder strings.Builder
	_ = xml.EscapeText(&descriptionBuilder, []byte(strings.TrimSpace(cfg.Description)))

	scriptText := strings.ReplaceAll(cfg.Script, "\r\n", "\n")
	scriptText = strings.ReplaceAll(scriptText, "\r", "\n")
	var scriptBuilder strings.Builder
	_ = xml.EscapeText(&scriptBuilder, []byte(scriptText))

	return fmt.Sprintf(`<?xml version='1.0' encoding='UTF-8'?>
<flow-definition plugin="workflow-job">
  <actions/>
  <description>%s</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps">
    <script>%s</script>
    <sandbox>%s</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>`, descriptionBuilder.String(), scriptBuilder.String(), sandbox)
}

func (c *Client) postAction(ctx context.Context, endpoint string) error {
	statusCode, err := c.postActionOnce(ctx, endpoint, crumbHeader{})
	if err == nil {
		return nil
	}
	if statusCode == http.StatusForbidden {
		crumbField, crumbValue, crumbErr := c.getCrumb(ctx)
		if crumbErr == nil {
			statusCode, err = c.postActionOnce(ctx, endpoint, crumbHeader{field: crumbField, value: crumbValue})
			if err == nil {
				return nil
			}
		}
	}
	if statusCode == http.StatusNotFound || statusCode == http.StatusGone {
		// Already gone/finished, treat as idempotent success.
		return nil
	}
	return err
}

func (c *Client) postActionOnce(ctx context.Context, endpoint string, crumb crumbHeader) (int, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, nil)
	if err != nil {
		return 0, err
	}
	if c.username != "" && c.apiToken != "" {
		req.SetBasicAuth(c.username, c.apiToken)
	}
	if crumb.field != "" && crumb.value != "" {
		req.Header.Set(crumb.field, crumb.value)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return 0, err
	}
	defer func() { _ = resp.Body.Close() }()

	body, readErr := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if readErr != nil {
		return resp.StatusCode, readErr
	}

	if resp.StatusCode >= http.StatusOK && resp.StatusCode < http.StatusBadRequest {
		return resp.StatusCode, nil
	}
	return resp.StatusCode, buildJenkinsHTTPError(resp.StatusCode, body)
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
		return nil, buildJenkinsHTTPError(resp.StatusCode, body)
	}
	return body, nil
}

var (
	htmlParagraphPattern = regexp.MustCompile(`(?is)<p[^>]*>(.*?)</p>`)
	htmlH2Pattern        = regexp.MustCompile(`(?is)<h2[^>]*>(.*?)</h2>`)
	htmlBreakPattern     = regexp.MustCompile(`(?is)<br\\s*/?>`)
	htmlTagPattern       = regexp.MustCompile(`(?is)<[^>]+>`)
	multiSpacePattern    = regexp.MustCompile(`\s+`)
	paramInvalidPattern  = regexp.MustCompile(`(?i)parameter\s+[^\n]{1,300}?\s+is\s+invalid`)
	httpErrorPattern     = regexp.MustCompile(`(?i)http error\s+\d+\s+[^\n]{1,120}`)
)

func buildJenkinsHTTPError(statusCode int, body []byte) error {
	message := extractJenkinsErrorMessage(string(body))
	if message == "" {
		return fmt.Errorf("jenkins request failed: status=%d", statusCode)
	}
	return fmt.Errorf("jenkins request failed: status=%d message=%s", statusCode, message)
}

func extractJenkinsErrorMessage(raw string) string {
	text := strings.TrimSpace(raw)
	if text == "" {
		return ""
	}

	for _, matcher := range []*regexp.Regexp{htmlParagraphPattern, htmlH2Pattern} {
		matches := matcher.FindAllStringSubmatch(text, 3)
		for _, match := range matches {
			if len(match) < 2 {
				continue
			}
			candidate := normalizeHTMLText(match[1])
			if reason := extractKnownJenkinsReason(candidate); reason != "" {
				return reason
			}
			if looksLikeMeaningfulMessage(candidate) {
				return candidate
			}
		}
	}

	candidate := normalizeHTMLText(text)
	if reason := extractKnownJenkinsReason(candidate); reason != "" {
		return reason
	}
	if candidate == "" {
		return ""
	}
	if len(candidate) > 220 {
		return candidate[:220] + "..."
	}
	return candidate
}

func normalizeHTMLText(raw string) string {
	decoded := html.UnescapeString(strings.TrimSpace(raw))
	if decoded == "" {
		return ""
	}
	decoded = htmlTagPattern.ReplaceAllString(decoded, " ")
	decoded = multiSpacePattern.ReplaceAllString(decoded, " ")
	return strings.TrimSpace(decoded)
}

func normalizeJenkinsLogContent(raw string) string {
	decoded := html.UnescapeString(strings.TrimSpace(raw))
	if decoded == "" {
		return ""
	}
	decoded = strings.ReplaceAll(decoded, "\r\n", "\n")
	decoded = strings.ReplaceAll(decoded, "\r", "\n")
	decoded = htmlBreakPattern.ReplaceAllString(decoded, "\n")
	decoded = htmlTagPattern.ReplaceAllString(decoded, "")
	return strings.TrimSpace(decoded)
}

func looksLikeMeaningfulMessage(message string) bool {
	if message == "" {
		return false
	}
	lower := strings.ToLower(message)
	if lower == "jenkins - jenkins" {
		return false
	}
	if strings.Contains(lower, "skip to content") {
		return false
	}
	if len(message) > 220 {
		return false
	}
	return true
}

func extractKnownJenkinsReason(text string) string {
	if text == "" {
		return ""
	}
	if match := paramInvalidPattern.FindString(text); match != "" {
		return strings.TrimSpace(match)
	}
	if match := httpErrorPattern.FindString(text); match != "" {
		return strings.TrimSpace(match)
	}
	return ""
}

func parseJenkinsMoreData(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "true", "1", "yes":
		return true
	default:
		return false
	}
}
