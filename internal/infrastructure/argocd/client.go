package argocd

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"path"
	"strings"
	"time"
)

type Config struct {
	BaseURL            string
	InsecureSkipVerify bool
	AuthMode           string
	Token              string
	Username           string
	Password           string
	TimeoutSec         int
}

type Client struct {
	baseURL    string
	authMode   string
	token      string
	username   string
	password   string
	httpClient *http.Client
}

type Application struct {
	Name           string
	Project        string
	RepoURL        string
	SourcePath     string
	TargetRevision string
	DestServer     string
	DestNamespace  string
	SyncStatus     string
	HealthStatus   string
	OperationPhase string
	RawMeta        string
}

func (a Application) GetName() string           { return a.Name }
func (a Application) GetProject() string        { return a.Project }
func (a Application) GetRepoURL() string        { return a.RepoURL }
func (a Application) GetSourcePath() string     { return a.SourcePath }
func (a Application) GetTargetRevision() string { return a.TargetRevision }
func (a Application) GetDestServer() string     { return a.DestServer }
func (a Application) GetDestNamespace() string  { return a.DestNamespace }
func (a Application) GetSyncStatus() string     { return a.SyncStatus }
func (a Application) GetHealthStatus() string   { return a.HealthStatus }
func (a Application) GetOperationPhase() string { return a.OperationPhase }
func (a Application) GetRawMeta() string        { return a.RawMeta }

type sessionRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type sessionResponse struct {
	Token string `json:"token"`
}

type applicationListResponse struct {
	Items []applicationPayload `json:"items"`
}

type applicationResponse struct {
	Metadata struct {
		Name string `json:"name"`
	} `json:"metadata"`
	Spec struct {
		Project     string                     `json:"project"`
		Source      *applicationSourcePayload  `json:"source"`
		Sources     []applicationSourcePayload `json:"sources"`
		Destination struct {
			Server    string `json:"server"`
			Namespace string `json:"namespace"`
		} `json:"destination"`
	} `json:"spec"`
	Status struct {
		Sync struct {
			Status string `json:"status"`
		} `json:"sync"`
		Health struct {
			Status string `json:"status"`
		} `json:"health"`
		OperationState *struct {
			Phase string `json:"phase"`
		} `json:"operationState"`
	} `json:"status"`
}

type applicationPayload applicationResponse

type applicationSourcePayload struct {
	RepoURL        string `json:"repoURL"`
	Path           string `json:"path"`
	TargetRevision string `json:"targetRevision"`
}

func NewClient(cfg Config) *Client {
	baseURL := strings.TrimRight(strings.TrimSpace(cfg.BaseURL), "/")
	timeout := cfg.TimeoutSec
	if timeout <= 0 {
		timeout = 30
	}
	transport := &http.Transport{}
	if cfg.InsecureSkipVerify {
		transport.TLSClientConfig = &tls.Config{InsecureSkipVerify: true} //nolint:gosec // 由显式配置控制
	}
	return &Client{
		baseURL:  baseURL,
		authMode: strings.ToLower(strings.TrimSpace(cfg.AuthMode)),
		token:    strings.TrimSpace(cfg.Token),
		username: strings.TrimSpace(cfg.Username),
		password: strings.TrimSpace(cfg.Password),
		httpClient: &http.Client{
			Timeout:   time.Duration(timeout) * time.Second,
			Transport: transport,
		},
	}
}

func (c *Client) Enabled() bool {
	return c != nil && c.baseURL != ""
}

func (c *Client) Ping(ctx context.Context) error {
	_, err := c.ListApplications(ctx)
	return err
}

func (c *Client) ListApplications(ctx context.Context) ([]Application, error) {
	if !c.Enabled() {
		return nil, fmt.Errorf("argocd client is not configured")
	}
	var resp applicationListResponse
	if err := c.doJSON(ctx, http.MethodGet, "/api/v1/applications", nil, &resp); err != nil {
		return nil, err
	}
	items := make([]Application, 0, len(resp.Items))
	for _, item := range resp.Items {
		mapped, err := mapApplication(applicationResponse(item))
		if err != nil {
			return nil, err
		}
		items = append(items, mapped)
	}
	return items, nil
}

func (c *Client) GetApplication(ctx context.Context, name string) (Application, error) {
	if !c.Enabled() {
		return Application{}, fmt.Errorf("argocd client is not configured")
	}
	name = strings.TrimSpace(name)
	if name == "" {
		return Application{}, fmt.Errorf("argocd application name is required")
	}
	var payload applicationResponse
	if err := c.doJSON(ctx, http.MethodGet, "/api/v1/applications/"+url.PathEscape(name), nil, &payload); err != nil {
		return Application{}, err
	}
	return mapApplication(payload)
}

func (c *Client) SyncApplication(ctx context.Context, name string) error {
	return c.SyncApplicationWithRevision(ctx, name, "")
}

func (c *Client) SyncApplicationWithRevision(ctx context.Context, name string, revision string) error {
	if !c.Enabled() {
		return fmt.Errorf("argocd client is not configured")
	}
	name = strings.TrimSpace(name)
	if name == "" {
		return fmt.Errorf("argocd application name is required")
	}
	body := map[string]any{
		"prune": false,
	}
	if strings.TrimSpace(revision) != "" {
		body["revision"] = strings.TrimSpace(revision)
	}
	return c.doJSON(ctx, http.MethodPost, "/api/v1/applications/"+url.PathEscape(name)+"/sync", body, nil)
}

func (c *Client) BuildApplicationURL(name string) string {
	if !c.Enabled() {
		return ""
	}
	base, err := url.Parse(c.baseURL)
	if err != nil {
		return ""
	}
	base.Path = path.Join(base.Path, "applications", strings.TrimSpace(name))
	return base.String()
}

func (c *Client) doJSON(ctx context.Context, method, apiPath string, body any, out any) error {
	requestURL := c.baseURL + apiPath
	var payload io.Reader
	if body != nil {
		encoded, err := json.Marshal(body)
		if err != nil {
			return err
		}
		payload = bytes.NewReader(encoded)
	}
	req, err := http.NewRequestWithContext(ctx, method, requestURL, payload)
	if err != nil {
		return err
	}
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	token, err := c.resolveToken(ctx)
	if err != nil {
		return err
	}
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		message := readSmallBody(resp.Body)
		if message != "" {
			return fmt.Errorf("argocd request failed: status=%d message=%s", resp.StatusCode, message)
		}
		return fmt.Errorf("argocd request failed: status=%d", resp.StatusCode)
	}
	if out == nil {
		_, _ = io.Copy(io.Discard, resp.Body)
		return nil
	}
	return json.NewDecoder(resp.Body).Decode(out)
}

func (c *Client) resolveToken(ctx context.Context) (string, error) {
	if c == nil {
		return "", fmt.Errorf("argocd client is not configured")
	}
	if strings.TrimSpace(c.token) != "" {
		return c.token, nil
	}
	if c.authMode != "password" && c.authMode != "basic" && c.authMode != "session" {
		return "", nil
	}
	if c.username == "" || c.password == "" {
		return "", fmt.Errorf("argocd username/password is required when auth_mode=%s", c.authMode)
	}
	requestURL := c.baseURL + "/api/v1/session"
	encoded, err := json.Marshal(sessionRequest{Username: c.username, Password: c.password})
	if err != nil {
		return "", err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, requestURL, bytes.NewReader(encoded))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		message := readSmallBody(resp.Body)
		if message != "" {
			return "", fmt.Errorf("argocd session login failed: status=%d message=%s", resp.StatusCode, message)
		}
		return "", fmt.Errorf("argocd session login failed: status=%d", resp.StatusCode)
	}
	var result sessionResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	if strings.TrimSpace(result.Token) == "" {
		return "", fmt.Errorf("argocd session login returned empty token")
	}
	return strings.TrimSpace(result.Token), nil
}

func mapApplication(item applicationResponse) (Application, error) {
	raw, err := json.Marshal(item)
	if err != nil {
		return Application{}, err
	}
	source := item.Spec.Source
	if source == nil && len(item.Spec.Sources) > 0 {
		source = &item.Spec.Sources[0]
	}
	mapped := Application{
		Name:          strings.TrimSpace(item.Metadata.Name),
		Project:       strings.TrimSpace(item.Spec.Project),
		DestServer:    strings.TrimSpace(item.Spec.Destination.Server),
		DestNamespace: strings.TrimSpace(item.Spec.Destination.Namespace),
		SyncStatus:    strings.TrimSpace(item.Status.Sync.Status),
		HealthStatus:  strings.TrimSpace(item.Status.Health.Status),
		RawMeta:       string(raw),
	}
	if source != nil {
		mapped.RepoURL = strings.TrimSpace(source.RepoURL)
		mapped.SourcePath = strings.TrimSpace(source.Path)
		mapped.TargetRevision = strings.TrimSpace(source.TargetRevision)
	}
	if item.Status.OperationState != nil {
		mapped.OperationPhase = strings.TrimSpace(item.Status.OperationState.Phase)
	}
	return mapped, nil
}

func readSmallBody(reader io.Reader) string {
	data, _ := io.ReadAll(io.LimitReader(reader, 2048))
	return strings.TrimSpace(string(data))
}
