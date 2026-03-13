package usecase

import (
	"context"
	"fmt"
	"strings"
	"time"

	appdomain "gos/internal/domain/application"
	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/pipelineparam"
	platformparamdomain "gos/internal/domain/platformparam"
)

type PipelineParamDefManager struct {
	repo         domain.Repository
	appRepo      appdomain.Repository
	pipelineRepo pipelinedomain.Repository
	platformRepo platformparamdomain.Repository
	now          func() time.Time
}

func NewPipelineParamDefManager(
	repo domain.Repository,
	appRepo appdomain.Repository,
	pipelineRepo pipelinedomain.Repository,
	platformRepo platformparamdomain.Repository,
) *PipelineParamDefManager {
	return &PipelineParamDefManager{
		repo:         repo,
		appRepo:      appRepo,
		pipelineRepo: pipelineRepo,
		platformRepo: platformRepo,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *PipelineParamDefManager) ListByPipeline(ctx context.Context, filter domain.ListFilter) ([]domain.PipelineParamDef, int64, error) {
	const (
		defaultPage     = 1
		defaultPageSize = 20
		maxPageSize     = 100
	)

	filter.PipelineID = strings.TrimSpace(filter.PipelineID)
	if filter.PipelineID == "" {
		return nil, 0, ErrInvalidID
	}
	if _, err := uc.pipelineRepo.GetPipelineByID(ctx, filter.PipelineID); err != nil {
		return nil, 0, err
	}
	if filter.ExecutorType != "" && !filter.ExecutorType.Valid() {
		return nil, 0, ErrInvalidExecutorType
	}
	filter.ParamKey = strings.TrimSpace(filter.ParamKey)
	if filter.Page <= 0 {
		filter.Page = defaultPage
	}
	if filter.PageSize <= 0 {
		filter.PageSize = defaultPageSize
	}
	if filter.PageSize > maxPageSize {
		filter.PageSize = maxPageSize
	}
	return uc.repo.ListByPipeline(ctx, filter)
}

func (uc *PipelineParamDefManager) ListByApplication(
	ctx context.Context,
	applicationID string,
	bindingType pipelinedomain.BindingType,
	filter domain.ListFilter,
) ([]domain.PipelineParamDef, int64, error) {
	applicationID = strings.TrimSpace(applicationID)
	if applicationID == "" {
		return nil, 0, ErrInvalidID
	}
	if _, err := uc.appRepo.GetByID(ctx, applicationID); err != nil {
		return nil, 0, err
	}

	if bindingType == "" {
		bindingType = pipelinedomain.BindingTypeCI
	}
	if !bindingType.Valid() {
		return nil, 0, ErrInvalidBindingType
	}

	bindings, total, err := uc.pipelineRepo.ListBindingsByApplication(ctx, pipelinedomain.BindingListFilter{
		ApplicationID: applicationID,
		BindingType:   bindingType,
		Provider:      pipelinedomain.ProviderJenkins,
		Page:          1,
		PageSize:      1,
	})
	if err != nil {
		return nil, 0, err
	}
	if total == 0 || len(bindings) == 0 {
		return nil, 0, fmt.Errorf("%w: jenkins pipeline binding not found", pipelinedomain.ErrBindingNotFound)
	}

	binding := bindings[0]
	if binding.Provider != pipelinedomain.ProviderJenkins {
		return nil, 0, fmt.Errorf("%w: bound pipeline provider is not jenkins", ErrInvalidInput)
	}
	if strings.TrimSpace(binding.PipelineID) == "" {
		return nil, 0, fmt.Errorf("%w: bound pipeline id is empty", ErrInvalidInput)
	}

	filter.PipelineID = binding.PipelineID
	filter.ExecutorType = domain.ExecutorTypeJenkins
	return uc.ListByPipeline(ctx, filter)
}

func (uc *PipelineParamDefManager) GetByID(ctx context.Context, id string) (domain.PipelineParamDef, error) {
	if strings.TrimSpace(id) == "" {
		return domain.PipelineParamDef{}, ErrInvalidID
	}
	return uc.repo.GetByID(ctx, id)
}

func (uc *PipelineParamDefManager) UpdateParamKey(ctx context.Context, id string, paramKey string) (domain.PipelineParamDef, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.PipelineParamDef{}, ErrInvalidID
	}

	if _, err := uc.repo.GetByID(ctx, id); err != nil {
		return domain.PipelineParamDef{}, err
	}

	paramKey = strings.TrimSpace(paramKey)
	if paramKey == "" {
		return uc.repo.UpdateParamKey(ctx, id, "", uc.now())
	}

	normalized, err := normalizePlatformParamKey(paramKey)
	if err != nil {
		return domain.PipelineParamDef{}, err
	}

	platformParam, err := uc.platformRepo.GetByParamKey(ctx, normalized)
	if err != nil {
		return domain.PipelineParamDef{}, err
	}
	if platformParam.Status != platformparamdomain.StatusEnabled {
		return domain.PipelineParamDef{}, fmt.Errorf("%w: platform param dict is disabled", ErrInvalidInput)
	}

	return uc.repo.UpdateParamKey(ctx, id, normalized, uc.now())
}
