package usecase

import (
	"fmt"
	"strings"

	pipelineparamdomain "gos/internal/domain/executorparam"
	pipelinedomain "gos/internal/domain/pipeline"
)

func ensureActivePipelineRecord(pipeline pipelinedomain.Pipeline, scene string) error {
	if pipeline.Status == pipelinedomain.StatusInactive {
		if strings.TrimSpace(scene) == "" {
			scene = "当前管线"
		}
		return fmt.Errorf("%w: %s已失效，可能已在 Jenkins 中被删除或更名，请重新同步后更新绑定", ErrInvalidInput, scene)
	}
	return nil
}

func ensureActiveExecutorParamDef(param pipelineparamdomain.ExecutorParamDef, scene string) error {
	if param.Status == pipelineparamdomain.StatusInactive {
		if strings.TrimSpace(scene) == "" {
			scene = "当前管线参数"
		}
		return fmt.Errorf("%w: %s已失效，可能已在 Jenkins 中被删除或更名，请重新同步后更新发布模板", ErrInvalidInput, scene)
	}
	return nil
}
