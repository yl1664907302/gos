package jenkins

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	domain "gos/internal/domain/pipeline"
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
