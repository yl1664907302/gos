package jenkins

import (
	"bytes"
	"context"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
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

func (c *Client) TriggerBuild(ctx context.Context, fullName string, params map[string]string) (string, error) {
	fullName = strings.Trim(strings.TrimSpace(fullName), "/")
	if fullName == "" {
		return "", fmt.Errorf("job full name is required")
	}

	path := buildJenkinsJobPath(fullName)
	endpoint := c.baseURL + path + "/build"
	form := url.Values{}
	for k, v := range params {
		key := strings.TrimSpace(k)
		if key == "" {
			continue
		}
		form.Set(key, v)
	}
	if len(form) > 0 {
		endpoint = c.baseURL + path + "/buildWithParameters"
	}

	body := form.Encode()
	queueURL, statusCode, err := c.post(ctx, endpoint, body, crumbHeader{})
	if err == nil {
		return queueURL, nil
	}
	if statusCode != http.StatusForbidden {
		return "", err
	}

	crumbField, crumbValue, crumbErr := c.getCrumb(ctx)
	if crumbErr != nil {
		return "", err
	}
	queueURL, _, err = c.post(ctx, endpoint, body, crumbHeader{field: crumbField, value: crumbValue})
	if err != nil {
		return "", err
	}
	return queueURL, nil
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
	return buildJenkinsJobPath(fullName) + "/api/json"
}

func buildJenkinsJobConfigPath(fullName string) string {
	return buildJenkinsJobPath(fullName) + "/config.xml"
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
		return "", resp.StatusCode, fmt.Errorf(
			"jenkins request failed: status=%d body=%s",
			resp.StatusCode,
			strings.TrimSpace(string(responseBody)),
		)
	}
	queueURL := strings.TrimSpace(resp.Header.Get("Location"))
	return queueURL, resp.StatusCode, nil
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
