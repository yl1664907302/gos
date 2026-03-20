package usecase

import (
	"context"
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"time"

	domain "gos/internal/domain/argocdapp"
	gitopsdomain "gos/internal/domain/gitops"
)

var argocdInstanceCodePattern = regexp.MustCompile(`^[a-z][a-z0-9_-]*$`)

type ArgoCDInstanceManager struct {
	repo       domain.Repository
	gitopsRepo gitopsdomain.Repository
	factory    ArgoCDClientFactory
	now        func() time.Time
}

type CreateArgoCDInstanceInput struct {
	InstanceCode       string
	Name               string
	BaseURL            string
	InsecureSkipVerify bool
	AuthMode           string
	Token              string
	Username           string
	Password           string
	GitOpsInstanceID   string
	ClusterName        string
	DefaultNamespace   string
	Status             domain.Status
	Remark             string
}

type UpdateArgoCDInstanceInput struct {
	InstanceCode       string
	Name               string
	BaseURL            string
	InsecureSkipVerify bool
	AuthMode           string
	Token              string
	Username           string
	Password           string
	GitOpsInstanceID   string
	ClusterName        string
	DefaultNamespace   string
	Status             domain.Status
	Remark             string
}

type UpdateArgoCDEnvBindingItem struct {
	EnvCode          string
	ArgoCDInstanceID string
	Status           domain.Status
}

func NewArgoCDInstanceManager(
	repo domain.Repository,
	gitopsRepo gitopsdomain.Repository,
	factory ArgoCDClientFactory,
) *ArgoCDInstanceManager {
	return &ArgoCDInstanceManager{repo: repo, gitopsRepo: gitopsRepo, factory: factory, now: func() time.Time { return time.Now().UTC() }}
}

func (uc *ArgoCDInstanceManager) List(ctx context.Context, filter domain.InstanceListFilter) ([]domain.Instance, int64, error) {
	if uc == nil || uc.repo == nil {
		return nil, 0, fmt.Errorf("%w: argocd instance manager is not configured", ErrInvalidInput)
	}
	if filter.Status != "" && !filter.Status.Valid() {
		return nil, 0, ErrInvalidStatus
	}
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.PageSize <= 0 {
		filter.PageSize = 20
	}
	if filter.PageSize > 100 {
		filter.PageSize = 100
	}
	return uc.repo.ListInstances(ctx, filter)
}

func (uc *ArgoCDInstanceManager) Create(ctx context.Context, input CreateArgoCDInstanceInput) (domain.Instance, error) {
	if uc == nil || uc.repo == nil {
		return domain.Instance{}, fmt.Errorf("%w: argocd instance manager is not configured", ErrInvalidInput)
	}
	instance, err := uc.normalizeCreateInput(ctx, input)
	if err != nil {
		return domain.Instance{}, err
	}
	return uc.repo.CreateInstance(ctx, instance)
}

func (uc *ArgoCDInstanceManager) Update(ctx context.Context, id string, input UpdateArgoCDInstanceInput) (domain.Instance, error) {
	if uc == nil || uc.repo == nil {
		return domain.Instance{}, fmt.Errorf("%w: argocd instance manager is not configured", ErrInvalidInput)
	}
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.Instance{}, ErrInvalidID
	}
	current, err := uc.repo.GetInstanceByID(ctx, id)
	if err != nil {
		return domain.Instance{}, err
	}
	instance, err := uc.normalizeUpdateInput(ctx, current, input)
	if err != nil {
		return domain.Instance{}, err
	}
	return uc.repo.UpdateInstance(ctx, instance)
}

func (uc *ArgoCDInstanceManager) Check(ctx context.Context, id string) (domain.Instance, error) {
	if uc == nil || uc.repo == nil || uc.factory == nil {
		return domain.Instance{}, fmt.Errorf("%w: argocd instance manager is not configured", ErrInvalidInput)
	}
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.Instance{}, ErrInvalidID
	}
	instance, err := uc.repo.GetInstanceByID(ctx, id)
	if err != nil {
		return domain.Instance{}, err
	}
	client := uc.factory.Build(instance)
	if client == nil {
		return domain.Instance{}, fmt.Errorf("%w: argocd client factory is not configured", ErrInvalidInput)
	}
	checkedAt := uc.now()
	healthStatus := "healthy"
	if err := client.Ping(ctx); err != nil {
		healthStatus = "unreachable"
		_ = uc.repo.UpdateInstanceHealth(ctx, instance.ID, healthStatus, checkedAt)
		return domain.Instance{}, err
	}
	if err := uc.repo.UpdateInstanceHealth(ctx, instance.ID, healthStatus, checkedAt); err != nil {
		return domain.Instance{}, err
	}
	return uc.repo.GetInstanceByID(ctx, instance.ID)
}

func (uc *ArgoCDInstanceManager) ListEnvBindings(ctx context.Context) ([]domain.EnvBinding, error) {
	if uc == nil || uc.repo == nil {
		return nil, fmt.Errorf("%w: argocd instance manager is not configured", ErrInvalidInput)
	}
	return uc.repo.ListEnvBindings(ctx)
}

func (uc *ArgoCDInstanceManager) UpdateEnvBindings(ctx context.Context, items []UpdateArgoCDEnvBindingItem) ([]domain.EnvBinding, error) {
	if uc == nil || uc.repo == nil {
		return nil, fmt.Errorf("%w: argocd instance manager is not configured", ErrInvalidInput)
	}
	now := uc.now()
	payload := make([]domain.EnvBinding, 0, len(items))
	seenEnv := make(map[string]struct{}, len(items))
	for _, item := range items {
		envCode := strings.TrimSpace(item.EnvCode)
		instanceID := strings.TrimSpace(item.ArgoCDInstanceID)
		if envCode == "" || instanceID == "" {
			continue
		}
		if _, exists := seenEnv[envCode]; exists {
			return nil, fmt.Errorf("%w: 环境绑定存在重复 env_code: %s", ErrInvalidInput, envCode)
		}
		seenEnv[envCode] = struct{}{}
		if _, err := uc.repo.GetInstanceByID(ctx, instanceID); err != nil {
			return nil, err
		}
		status := item.Status
		if status == "" {
			status = domain.StatusActive
		}
		if !status.Valid() {
			return nil, ErrInvalidStatus
		}
		payload = append(payload, domain.EnvBinding{
			ID:               generateID("aeb"),
			EnvCode:          envCode,
			ArgoCDInstanceID: instanceID,
			Priority:         1,
			Status:           status,
			CreatedAt:        now,
			UpdatedAt:        now,
		})
	}
	if err := uc.repo.ReplaceEnvBindings(ctx, payload); err != nil {
		return nil, err
	}
	return uc.repo.ListEnvBindings(ctx)
}

func (uc *ArgoCDInstanceManager) normalizeCreateInput(ctx context.Context, input CreateArgoCDInstanceInput) (domain.Instance, error) {
	code, err := normalizeArgoCDInstanceCode(input.InstanceCode)
	if err != nil {
		return domain.Instance{}, err
	}
	baseURL, err := normalizeArgoCDBaseURL(input.BaseURL)
	if err != nil {
		return domain.Instance{}, err
	}
	name := strings.TrimSpace(input.Name)
	if name == "" {
		return domain.Instance{}, fmt.Errorf("%w: name is required", ErrInvalidInput)
	}
	authMode := normalizeArgoCDAuthMode(input.AuthMode)
	if authMode == "" {
		return domain.Instance{}, fmt.Errorf("%w: auth_mode is required", ErrInvalidInput)
	}
	status := input.Status
	if status == "" {
		status = domain.StatusActive
	}
	if !status.Valid() {
		return domain.Instance{}, ErrInvalidStatus
	}
	if err := validateArgoCDCredentials(authMode, input.Token, input.Username, input.Password); err != nil {
		return domain.Instance{}, err
	}
	gitopsInstanceID := strings.TrimSpace(input.GitOpsInstanceID)
	if gitopsInstanceID != "" {
		if uc.gitopsRepo == nil {
			return domain.Instance{}, fmt.Errorf("%w: gitops repository is not configured", ErrInvalidInput)
		}
		if _, err := uc.gitopsRepo.GetInstanceByID(ctx, gitopsInstanceID); err != nil {
			return domain.Instance{}, err
		}
	}
	now := uc.now()
	return domain.Instance{
		ID:                 generateID("argocd"),
		InstanceCode:       code,
		Name:               name,
		BaseURL:            baseURL,
		InsecureSkipVerify: input.InsecureSkipVerify,
		AuthMode:           authMode,
		Token:              strings.TrimSpace(input.Token),
		Username:           strings.TrimSpace(input.Username),
		Password:           strings.TrimSpace(input.Password),
		GitOpsInstanceID:   gitopsInstanceID,
		ClusterName:        strings.TrimSpace(input.ClusterName),
		DefaultNamespace:   strings.TrimSpace(input.DefaultNamespace),
		Status:             status,
		HealthStatus:       "unknown",
		CreatedAt:          now,
		UpdatedAt:          now,
		Remark:             strings.TrimSpace(input.Remark),
	}, nil
}

func (uc *ArgoCDInstanceManager) normalizeUpdateInput(ctx context.Context, current domain.Instance, input UpdateArgoCDInstanceInput) (domain.Instance, error) {
	code, err := normalizeArgoCDInstanceCode(input.InstanceCode)
	if err != nil {
		return domain.Instance{}, err
	}
	baseURL, err := normalizeArgoCDBaseURL(input.BaseURL)
	if err != nil {
		return domain.Instance{}, err
	}
	name := strings.TrimSpace(input.Name)
	if name == "" {
		return domain.Instance{}, fmt.Errorf("%w: name is required", ErrInvalidInput)
	}
	authMode := normalizeArgoCDAuthMode(input.AuthMode)
	if authMode == "" {
		return domain.Instance{}, fmt.Errorf("%w: auth_mode is required", ErrInvalidInput)
	}
	status := input.Status
	if status == "" {
		status = current.Status
	}
	if !status.Valid() {
		return domain.Instance{}, ErrInvalidStatus
	}
	token := strings.TrimSpace(input.Token)
	if token == "" {
		token = current.Token
	}
	password := strings.TrimSpace(input.Password)
	if password == "" {
		password = current.Password
	}
	username := strings.TrimSpace(input.Username)
	if username == "" {
		username = current.Username
	}
	if err := validateArgoCDCredentials(authMode, token, username, password); err != nil {
		return domain.Instance{}, err
	}
	gitopsInstanceID := strings.TrimSpace(input.GitOpsInstanceID)
	if gitopsInstanceID == "" {
		gitopsInstanceID = current.GitOpsInstanceID
	}
	if gitopsInstanceID != "" {
		if uc.gitopsRepo == nil {
			return domain.Instance{}, fmt.Errorf("%w: gitops repository is not configured", ErrInvalidInput)
		}
		if _, err := uc.gitopsRepo.GetInstanceByID(ctx, gitopsInstanceID); err != nil {
			return domain.Instance{}, err
		}
	}
	return domain.Instance{
		ID:                 current.ID,
		InstanceCode:       code,
		Name:               name,
		BaseURL:            baseURL,
		InsecureSkipVerify: input.InsecureSkipVerify,
		AuthMode:           authMode,
		Token:              token,
		Username:           username,
		Password:           password,
		GitOpsInstanceID:   gitopsInstanceID,
		ClusterName:        strings.TrimSpace(input.ClusterName),
		DefaultNamespace:   strings.TrimSpace(input.DefaultNamespace),
		Status:             status,
		HealthStatus:       strings.TrimSpace(current.HealthStatus),
		LastCheckAt:        current.LastCheckAt,
		CreatedAt:          current.CreatedAt,
		UpdatedAt:          uc.now(),
		Remark:             strings.TrimSpace(input.Remark),
	}, nil
}

func normalizeArgoCDInstanceCode(value string) (string, error) {
	value = strings.TrimSpace(strings.ToLower(value))
	if value == "" {
		return "", fmt.Errorf("%w: instance_code is required", ErrInvalidInput)
	}
	if !argocdInstanceCodePattern.MatchString(value) {
		return "", fmt.Errorf("%w: instance_code 格式无效", ErrInvalidInput)
	}
	return value, nil
}

func normalizeArgoCDBaseURL(value string) (string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return "", fmt.Errorf("%w: base_url is required", ErrInvalidInput)
	}
	parsed, err := url.Parse(value)
	if err != nil || parsed.Scheme == "" || parsed.Host == "" {
		return "", fmt.Errorf("%w: base_url 格式无效", ErrInvalidInput)
	}
	return strings.TrimRight(parsed.String(), "/"), nil
}

func normalizeArgoCDAuthMode(value string) string {
	value = strings.TrimSpace(strings.ToLower(value))
	switch value {
	case "token", "password", "basic", "session":
		return value
	default:
		return ""
	}
}

func validateArgoCDCredentials(authMode, token, username, password string) error {
	switch normalizeArgoCDAuthMode(authMode) {
	case "token":
		if strings.TrimSpace(token) == "" {
			return fmt.Errorf("%w: token is required when auth_mode=token", ErrInvalidInput)
		}
	case "password", "basic", "session":
		if strings.TrimSpace(username) == "" || strings.TrimSpace(password) == "" {
			return fmt.Errorf("%w: username and password are required when auth_mode=%s", ErrInvalidInput, authMode)
		}
	default:
		return fmt.Errorf("%w: unsupported argocd auth_mode", ErrInvalidInput)
	}
	return nil
}
