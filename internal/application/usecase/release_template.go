package usecase

import (
	"context"
	"fmt"
	"strings"
	"time"

	pipelinedomain "gos/internal/domain/pipeline"
	pipelineparamdomain "gos/internal/domain/pipelineparam"
	platformparamdomain "gos/internal/domain/platformparam"
	releasedomain "gos/internal/domain/release"
)

type ReleaseTemplateManager struct {
	repo         releasedomain.Repository
	pipelineRepo pipelinedomain.Repository
	paramRepo    pipelineparamdomain.Repository
	platformRepo platformparamdomain.Repository
	now          func() time.Time
}

type CreateReleaseTemplateInput struct {
	Name          string
	ApplicationID string
	BindingID     string
	Status        releasedomain.TemplateStatus
	Remark        string
	ParamDefIDs   []string
}

type UpdateReleaseTemplateInput struct {
	Name        string
	Status      releasedomain.TemplateStatus
	Remark      string
	ParamDefIDs []string
}

type ListReleaseTemplateInput struct {
	ApplicationID string
	BindingID     string
	Status        releasedomain.TemplateStatus
	Page          int
	PageSize      int
}

func NewReleaseTemplateManager(
	repo releasedomain.Repository,
	pipelineRepo pipelinedomain.Repository,
	paramRepo pipelineparamdomain.Repository,
	platformRepo platformparamdomain.Repository,
) *ReleaseTemplateManager {
	return &ReleaseTemplateManager{
		repo:         repo,
		pipelineRepo: pipelineRepo,
		paramRepo:    paramRepo,
		platformRepo: platformRepo,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *ReleaseTemplateManager) Create(
	ctx context.Context,
	input CreateReleaseTemplateInput,
) (releasedomain.ReleaseTemplate, []releasedomain.ReleaseTemplateParam, error) {
	name := strings.TrimSpace(input.Name)
	applicationID := strings.TrimSpace(input.ApplicationID)
	bindingID := strings.TrimSpace(input.BindingID)
	if name == "" || applicationID == "" || bindingID == "" {
		return releasedomain.ReleaseTemplate{}, nil, fmt.Errorf("%w: name, application_id and binding_id are required", ErrInvalidInput)
	}

	binding, params, err := uc.buildTemplatePayload(
		ctx,
		applicationID,
		bindingID,
		input.ParamDefIDs,
	)
	if err != nil {
		return releasedomain.ReleaseTemplate{}, nil, err
	}

	status := input.Status
	if status == "" {
		status = releasedomain.TemplateStatusActive
	}
	if !status.Valid() {
		return releasedomain.ReleaseTemplate{}, nil, ErrInvalidStatus
	}
	if status == releasedomain.TemplateStatusActive {
		if err := uc.ensureSingleActiveTemplate(ctx, applicationID, bindingID, ""); err != nil {
			return releasedomain.ReleaseTemplate{}, nil, err
		}
	}

	now := uc.now()
	template := releasedomain.ReleaseTemplate{
		ID:              generateID("rt"),
		Name:            name,
		ApplicationID:   binding.ApplicationID,
		ApplicationName: binding.ApplicationName,
		BindingID:       binding.ID,
		BindingName:     strings.TrimSpace(binding.Name),
		BindingType:     string(binding.BindingType),
		Status:          status,
		Remark:          strings.TrimSpace(input.Remark),
		ParamCount:      len(params),
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	for idx := range params {
		params[idx].TemplateID = template.ID
		params[idx].CreatedAt = now
		params[idx].UpdatedAt = now
	}

	if err := uc.repo.CreateTemplate(ctx, template, params); err != nil {
		return releasedomain.ReleaseTemplate{}, nil, err
	}
	return uc.repo.GetTemplateByID(ctx, template.ID)
}

func (uc *ReleaseTemplateManager) GetByID(
	ctx context.Context,
	id string,
) (releasedomain.ReleaseTemplate, []releasedomain.ReleaseTemplateParam, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return releasedomain.ReleaseTemplate{}, nil, ErrInvalidID
	}
	return uc.repo.GetTemplateByID(ctx, id)
}

func (uc *ReleaseTemplateManager) List(
	ctx context.Context,
	input ListReleaseTemplateInput,
) ([]releasedomain.ReleaseTemplate, int64, error) {
	const (
		defaultPage     = 1
		defaultPageSize = 20
		maxPageSize     = 100
	)

	filter := releasedomain.TemplateListFilter{
		ApplicationID: strings.TrimSpace(input.ApplicationID),
		BindingID:     strings.TrimSpace(input.BindingID),
		Status:        input.Status,
		Page:          input.Page,
		PageSize:      input.PageSize,
	}
	if filter.Status != "" && !filter.Status.Valid() {
		return nil, 0, ErrInvalidStatus
	}
	if filter.Page <= 0 {
		filter.Page = defaultPage
	}
	if filter.PageSize <= 0 {
		filter.PageSize = defaultPageSize
	}
	if filter.PageSize > maxPageSize {
		filter.PageSize = maxPageSize
	}
	return uc.repo.ListTemplates(ctx, filter)
}

func (uc *ReleaseTemplateManager) Update(
	ctx context.Context,
	id string,
	input UpdateReleaseTemplateInput,
) (releasedomain.ReleaseTemplate, []releasedomain.ReleaseTemplateParam, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return releasedomain.ReleaseTemplate{}, nil, ErrInvalidID
	}
	current, _, err := uc.repo.GetTemplateByID(ctx, id)
	if err != nil {
		return releasedomain.ReleaseTemplate{}, nil, err
	}

	name := strings.TrimSpace(input.Name)
	if name == "" {
		name = current.Name
	}

	status := input.Status
	if status == "" {
		status = current.Status
	}
	if !status.Valid() {
		return releasedomain.ReleaseTemplate{}, nil, ErrInvalidStatus
	}
	if status == releasedomain.TemplateStatusActive {
		if err := uc.ensureSingleActiveTemplate(ctx, current.ApplicationID, current.BindingID, current.ID); err != nil {
			return releasedomain.ReleaseTemplate{}, nil, err
		}
	}

	binding, params, err := uc.buildTemplatePayload(
		ctx,
		current.ApplicationID,
		current.BindingID,
		input.ParamDefIDs,
	)
	if err != nil {
		return releasedomain.ReleaseTemplate{}, nil, err
	}

	now := uc.now()
	template := releasedomain.ReleaseTemplate{
		ID:              current.ID,
		Name:            name,
		ApplicationID:   current.ApplicationID,
		ApplicationName: current.ApplicationName,
		BindingID:       current.BindingID,
		BindingName:     strings.TrimSpace(binding.Name),
		BindingType:     string(binding.BindingType),
		Status:          status,
		Remark:          strings.TrimSpace(input.Remark),
		ParamCount:      len(params),
		CreatedAt:       current.CreatedAt,
		UpdatedAt:       now,
	}

	for idx := range params {
		params[idx].TemplateID = template.ID
		params[idx].CreatedAt = now
		params[idx].UpdatedAt = now
	}

	if err := uc.repo.UpdateTemplate(ctx, template, params); err != nil {
		return releasedomain.ReleaseTemplate{}, nil, err
	}
	return uc.repo.GetTemplateByID(ctx, template.ID)
}

func (uc *ReleaseTemplateManager) Delete(ctx context.Context, id string) error {
	id = strings.TrimSpace(id)
	if id == "" {
		return ErrInvalidID
	}
	return uc.repo.DeleteTemplate(ctx, id)
}

func (uc *ReleaseTemplateManager) buildTemplatePayload(
	ctx context.Context,
	applicationID string,
	bindingID string,
	paramDefIDs []string,
) (pipelinedomain.PipelineBinding, []releasedomain.ReleaseTemplateParam, error) {
	binding, err := uc.pipelineRepo.GetBindingByID(ctx, bindingID)
	if err != nil {
		return pipelinedomain.PipelineBinding{}, nil, err
	}
	if strings.TrimSpace(binding.ApplicationID) != strings.TrimSpace(applicationID) {
		return pipelinedomain.PipelineBinding{}, nil, fmt.Errorf("%w: binding does not belong to application", ErrInvalidInput)
	}
	if binding.Provider != pipelinedomain.ProviderJenkins {
		return pipelinedomain.PipelineBinding{}, nil, fmt.Errorf("%w: only jenkins binding supports release template", ErrInvalidInput)
	}
	if strings.TrimSpace(binding.PipelineID) == "" {
		return pipelinedomain.PipelineBinding{}, nil, fmt.Errorf("%w: bound pipeline id is empty", ErrInvalidInput)
	}

	normalizedIDs := make([]string, 0, len(paramDefIDs))
	seen := make(map[string]struct{}, len(paramDefIDs))
	for _, id := range paramDefIDs {
		id = strings.TrimSpace(id)
		if id == "" {
			continue
		}
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		normalizedIDs = append(normalizedIDs, id)
	}
	if len(normalizedIDs) == 0 {
		return pipelinedomain.PipelineBinding{}, nil, fmt.Errorf("%w: template params are required", ErrInvalidInput)
	}

	params := make([]releasedomain.ReleaseTemplateParam, 0, len(normalizedIDs))
	for idx, id := range normalizedIDs {
		paramDef, err := uc.paramRepo.GetByID(ctx, id)
		if err != nil {
			return pipelinedomain.PipelineBinding{}, nil, err
		}
		if strings.TrimSpace(paramDef.PipelineID) != strings.TrimSpace(binding.PipelineID) {
			return pipelinedomain.PipelineBinding{}, nil, fmt.Errorf("%w: template param does not belong to selected binding", ErrInvalidInput)
		}
		paramKey := strings.ToLower(strings.TrimSpace(paramDef.ParamKey))
		if paramKey == "" {
			return pipelinedomain.PipelineBinding{}, nil, fmt.Errorf("%w: template param must be mapped to platform key", ErrInvalidInput)
		}
		dict, err := uc.platformRepo.GetByParamKey(ctx, paramKey)
		if err != nil {
			return pipelinedomain.PipelineBinding{}, nil, err
		}
		if dict.Status != platformparamdomain.StatusEnabled {
			return pipelinedomain.PipelineBinding{}, nil, fmt.Errorf("%w: platform param dict is disabled", ErrInvalidInput)
		}

		params = append(params, releasedomain.ReleaseTemplateParam{
			ID:                 generateID("rtp"),
			PipelineParamDefID: paramDef.ID,
			ParamKey:           paramKey,
			ParamName:          strings.TrimSpace(dict.Name),
			ExecutorParamName:  strings.TrimSpace(paramDef.ExecutorParamName),
			Required:           paramDef.Required,
			SortNo:             idx + 1,
		})
	}
	return binding, params, nil
}

func (uc *ReleaseTemplateManager) ensureSingleActiveTemplate(
	ctx context.Context,
	applicationID string,
	bindingID string,
	ignoreTemplateID string,
) error {
	items, total, err := uc.repo.ListTemplates(ctx, releasedomain.TemplateListFilter{
		ApplicationID: strings.TrimSpace(applicationID),
		BindingID:     strings.TrimSpace(bindingID),
		Status:        releasedomain.TemplateStatusActive,
		Page:          1,
		PageSize:      10,
	})
	if err != nil {
		return err
	}
	if total == 0 {
		return nil
	}
	ignoreTemplateID = strings.TrimSpace(ignoreTemplateID)
	for _, item := range items {
		if strings.TrimSpace(item.ID) == ignoreTemplateID {
			continue
		}
		return fmt.Errorf("%w: only one active release template is allowed for the selected binding", ErrInvalidInput)
	}
	return nil
}
