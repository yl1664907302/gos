package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"gos/internal/application/usecase"
	"gos/internal/bootstrap"
	argocddomain "gos/internal/domain/argocdapp"
	gitopsdomain "gos/internal/domain/gitops"
	argocdinfra "gos/internal/infrastructure/argocd"
	configstore "gos/internal/infrastructure/configstore"
	gitopsinfra "gos/internal/infrastructure/gitops"
	"gos/internal/infrastructure/jenkins"
	"gos/internal/infrastructure/persistence/sqlrepo"
	httpapi "gos/internal/interfaces/http"
)

//go:generate swag init -g cmd/server/main.go -o docs --parseInternal

// @title           GOS API
// @version         1.0
// @description     Internal deployment platform API.
// @BasePath        /
// @schemes         http https
func main() {
	cfg, err := bootstrap.LoadConfig()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}
	if err := bootstrap.CheckJenkinsConnection(cfg); err != nil {
		log.Fatalf("check jenkins: %v", err)
	}
	if err := bootstrap.CheckArgoCDConnection(cfg); err != nil {
		log.Fatalf("check argocd: %v", err)
	}

	db, err := bootstrap.OpenDatabase(cfg)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer func() { _ = db.Close() }()

	repo := sqlrepo.NewApplicationRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(repo); err != nil {
		log.Fatalf("init schema: %v", err)
	}

	pipelineRepo := sqlrepo.NewPipelineRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(pipelineRepo); err != nil {
		log.Fatalf("init pipeline schema: %v", err)
	}

	platformParamRepo := sqlrepo.NewPlatformParamRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(platformParamRepo); err != nil {
		log.Fatalf("init platform param schema: %v", err)
	}

	executorParamRepo := sqlrepo.NewExecutorParamRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(executorParamRepo); err != nil {
		log.Fatalf("init executor param schema: %v", err)
	}
	agentRepo := sqlrepo.NewAgentRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(agentRepo); err != nil {
		log.Fatalf("init agent schema: %v", err)
	}
	releaseRepo := sqlrepo.NewReleaseRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(releaseRepo); err != nil {
		log.Fatalf("init release schema: %v", err)
	}
	argocdAppRepo := sqlrepo.NewArgoCDApplicationRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(argocdAppRepo); err != nil {
		log.Fatalf("init argocd schema: %v", err)
	}
	gitopsRepo := sqlrepo.NewGitOpsRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(gitopsRepo); err != nil {
		log.Fatalf("init gitops schema: %v", err)
	}
	if err := ensureDefaultGitOpsInstance(context.Background(), gitopsRepo, cfg); err != nil {
		log.Fatalf("ensure default gitops instance: %v", err)
	}
	if err := ensureDefaultArgoCDInstance(context.Background(), argocdAppRepo, cfg); err != nil {
		log.Fatalf("ensure default argocd instance: %v", err)
	}
	if err := argocdAppRepo.CleanupLegacyApplications(context.Background()); err != nil {
		log.Fatalf("cleanup legacy argocd applications: %v", err)
	}
	userRepo := sqlrepo.NewUserRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(userRepo); err != nil {
		log.Fatalf("init user schema: %v", err)
	}

	jenkinsClient := jenkins.NewClient(jenkins.Config{
		BaseURL:    cfg.Jenkins.BaseURL,
		Username:   cfg.Jenkins.Username,
		APIToken:   cfg.Jenkins.APIToken,
		TimeoutSec: cfg.Jenkins.TimeoutSec,
	})
	gitopsService := gitopsinfra.NewService(gitopsinfra.Config{
		Enabled:               cfg.GitOps.Enabled,
		LocalRoot:             cfg.GitOps.LocalRoot,
		DefaultBranch:         cfg.GitOps.DefaultBranch,
		Username:              cfg.GitOps.Username,
		Password:              cfg.GitOps.Password,
		Token:                 cfg.GitOps.Token,
		AuthorName:            cfg.GitOps.AuthorName,
		AuthorEmail:           cfg.GitOps.AuthorEmail,
		CommitMessageTemplate: cfg.GitOps.CommitMessageTemplate,
		CommandTimeoutSec:     cfg.GitOps.CommandTimeoutSec,
	})
	gitopsServiceFactory := gitOpsServiceFactory{}
	argocdClientFactory := argoCDClientFactory{}
	syncPipelines := usecase.NewSyncPipelines(pipelineRepo, jenkinsClient)
	syncExecutorParamDefs := usecase.NewSyncExecutorParamDefs(executorParamRepo, jenkinsClient)
	syncArgoCDApplications := usecase.NewSyncArgoCDApplications(argocdAppRepo, argocdClientFactory)
	gitopsInstanceManager := usecase.NewGitOpsInstanceManager(gitopsRepo, gitopsServiceFactory, platformParamRepo)
	argocdInstanceManager := usecase.NewArgoCDInstanceManager(argocdAppRepo, gitopsRepo, argocdClientFactory)
	userManagement := usecase.NewUserManagement(userRepo)
	authSessionManager := usecase.NewAuthSessionManager(
		userRepo,
		time.Duration(cfg.Auth.SessionTTLHours)*time.Hour,
	)
	if err := userManagement.EnsureSeedData(
		context.Background(),
		cfg.Auth.AdminUsername,
		cfg.Auth.AdminDisplayName,
		cfg.Auth.AdminPassword,
	); err != nil {
		log.Fatalf("ensure auth seed data: %v", err)
	}

	authHandler := httpapi.NewAuthHandler(authSessionManager, userManagement)
	agentHandler := httpapi.NewAgentHandler(
		usecase.NewAgentManager(agentRepo),
		usecase.NewAgentTaskManager(agentRepo),
		usecase.NewAgentScriptManager(agentRepo),
		authSessionManager,
	)
	userHandler := httpapi.NewUserHandler(userManagement, authSessionManager)
	handler := httpapi.NewApplicationHandler(
		usecase.NewCreateApplication(repo),
		usecase.NewQueryApplication(repo),
		usecase.NewUpdateApplication(repo),
		usecase.NewDeleteApplication(repo),
		userManagement,
		authSessionManager,
	)
	releaseStore := configstore.NewReleaseStore(bootstrap.ResolveConfigPath())
	releaseSettingsQuery := usecase.NewQueryReleaseSettings(releaseStore)
	systemSettingsHandler := httpapi.NewSystemSettingsHandler(
		releaseSettingsQuery,
		usecase.NewUpdateReleaseSettings(
			releaseStore,
			releaseSettingsQuery,
		),
		authSessionManager,
	)
	pipelineHandler := httpapi.NewPipelineHandler(
		syncPipelines,
		usecase.NewQueryPipeline(pipelineRepo, jenkinsClient),
		usecase.NewPipelineBindingManager(pipelineRepo, repo),
		usecase.NewJenkinsPipelineManager(pipelineRepo, jenkinsClient, syncPipelines, syncExecutorParamDefs),
		authSessionManager,
	)
	argocdHandler := httpapi.NewArgoCDHandler(
		syncArgoCDApplications,
		usecase.NewQueryArgoCDApplications(argocdAppRepo),
		argocdInstanceManager,
		authSessionManager,
	)
	gitopsStatusQuery := usecase.NewQueryGitOpsStatus(gitopsService)
	gitopsHandler := httpapi.NewGitOpsHandler(
		gitopsStatusQuery,
		usecase.NewQueryGitOpsBindingTargets(gitopsService),
		usecase.NewQueryGitOpsTemplateFields(platformParamRepo),
		usecase.NewQueryGitOpsFieldCandidates(repo, gitopsInstanceManager),
		usecase.NewQueryGitOpsValuesCandidates(repo, gitopsInstanceManager),
		usecase.NewUpdateGitOpsCommitTemplate(
			configstore.NewGitOpsStore(bootstrap.ResolveConfigPath()),
			gitopsService,
			gitopsStatusQuery,
			platformParamRepo,
		),
		gitopsInstanceManager,
		authSessionManager,
	)
	platformParamHandler := httpapi.NewPlatformParamHandler(
		usecase.NewPlatformParamDictManager(platformParamRepo, executorParamRepo),
		authSessionManager,
	)
	executorParamHandler := httpapi.NewExecutorParamHandler(
		usecase.NewExecutorParamDefManager(executorParamRepo, repo, pipelineRepo, platformParamRepo),
		syncExecutorParamDefs,
		authSessionManager,
		authSessionManager,
	)
	releaseOrderManager := usecase.NewReleaseOrderManager(
		releaseRepo,
		repo,
		pipelineRepo,
		executorParamRepo,
		platformParamRepo,
		releaseStore,
		jenkinsClient,
		argocdAppRepo,
		argocdClientFactory,
		gitopsRepo,
		gitopsServiceFactory,
		gitopsService,
	)
	releaseTemplateManager := usecase.NewReleaseTemplateManager(releaseRepo, repo, pipelineRepo, executorParamRepo, platformParamRepo, argocdAppRepo, gitopsInstanceManager)
	releaseOrderLogStreamer := usecase.NewReleaseOrderLogStreamer(releaseRepo, pipelineRepo, jenkinsClient)
	releaseOrderHandler := httpapi.NewReleaseOrderHandler(
		releaseOrderManager,
		releaseOrderLogStreamer,
		authSessionManager,
		authSessionManager,
	)
	releaseTemplateHandler := httpapi.NewReleaseTemplateHandler(
		releaseTemplateManager,
		authSessionManager,
	)
	releaseTracker := usecase.NewTrackReleaseExecution(
		releaseOrderManager,
		jenkinsClient,
	)

	syncTask := bootstrap.StartJenkinsAutoSyncTask(cfg.Jenkins, func(ctx context.Context) error {
		pipelineResult, err := syncPipelines.Execute(ctx)
		if err != nil {
			return err
		}
		log.Printf(
			"jenkins auto sync completed: total=%d created=%d updated=%d inactivated=%d skipped=%d",
			pipelineResult.Total,
			pipelineResult.Created,
			pipelineResult.Updated,
			pipelineResult.Inactivated,
			pipelineResult.Skipped,
		)

		paramResult, err := syncExecutorParamDefs.Execute(ctx)
		if err != nil {
			return err
		}
		log.Printf(
			"jenkins param auto sync completed: total=%d created=%d updated=%d inactivated=%d skipped=%d",
			paramResult.Total,
			paramResult.Created,
			paramResult.Updated,
			paramResult.Inactivated,
			paramResult.Skipped,
		)
		return nil
	})
	defer syncTask.Stop()

	argocdSyncTask := bootstrap.StartArgoCDAutoSyncTask(cfg.ArgoCD, func(ctx context.Context) error {
		result, err := syncArgoCDApplications.Execute(ctx)
		if err != nil {
			return err
		}
		log.Printf(
			"argocd auto sync completed: total=%d created=%d updated=%d inactivated=%d",
			result.Total,
			result.Created,
			result.Updated,
			result.Inactivated,
		)
		return nil
	})
	defer argocdSyncTask.Stop()

	releaseTrackTask := bootstrap.StartReleaseTrackTask(cfg.Jenkins, cfg.ArgoCD, func(ctx context.Context) error {
		releaseResult, err := releaseTracker.Execute(ctx)
		if err != nil {
			return err
		}
		log.Printf(
			"release execution track completed: running=%d updated=%d skipped=%d failed=%d",
			releaseResult.RunningOrders,
			releaseResult.UpdatedOrders,
			releaseResult.SkippedOrders,
			releaseResult.FailedOrders,
		)
		return nil
	})
	defer releaseTrackTask.Stop()

	router := httpapi.NewRouter(
		authHandler,
		agentHandler,
		userHandler,
		authSessionManager,
		handler,
		systemSettingsHandler,
		pipelineHandler,
		argocdHandler,
		gitopsHandler,
		platformParamHandler,
		executorParamHandler,
		releaseOrderHandler,
		releaseTemplateHandler,
	)

	server := &http.Server{
		Addr:              cfg.Server.Addr,
		Handler:           router,
		ReadHeaderTimeout: time.Duration(cfg.Server.ReadHeaderTimeoutSec) * time.Second,
		ReadTimeout:       time.Duration(cfg.Server.ReadTimeoutSec) * time.Second,
		WriteTimeout:      time.Duration(cfg.Server.WriteTimeoutSec) * time.Second,
		IdleTimeout:       time.Duration(cfg.Server.IdleTimeoutSec) * time.Second,
	}

	serverErr := make(chan error, 1)
	go func() {
		serverErr <- server.ListenAndServe()
	}()
	log.Printf(
		"server listening on %s (env=%s db=%s jenkins_enabled=%t argocd_enabled=%t)",
		cfg.Server.Addr,
		cfg.Environment,
		cfg.Database.Driver,
		cfg.Jenkins.Enabled,
		cfg.ArgoCD.Enabled,
	)

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-stop:
		log.Printf("received signal %s, shutting down", sig)
	case err := <-serverErr:
		if errors.Is(err, http.ErrServerClosed) {
			return
		}
		log.Fatalf("server stopped with error: %v", err)
	}

	shutdownCtx, cancel := contextWithTimeout(time.Duration(cfg.Server.ShutdownTimeoutSec) * time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
	}

	err = <-serverErr
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Printf("server close error: %v", err)
	}
}

func contextWithTimeout(timeout time.Duration) (context.Context, context.CancelFunc) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	return ctx, cancel
}

type argoCDClientFactory struct{}

type gitOpsServiceFactory struct{}

func (argoCDClientFactory) Build(instance argocddomain.Instance) usecase.ArgoCDApplicationClient {
	client := argocdinfra.NewClient(argocdinfra.Config{
		BaseURL:            strings.TrimSpace(instance.BaseURL),
		InsecureSkipVerify: instance.InsecureSkipVerify,
		AuthMode:           strings.TrimSpace(instance.AuthMode),
		Token:              strings.TrimSpace(instance.Token),
		Username:           strings.TrimSpace(instance.Username),
		Password:           strings.TrimSpace(instance.Password),
		TimeoutSec:         30,
	})
	return argoCDUsecaseClient{client: client}
}

func (gitOpsServiceFactory) Build(instance gitopsdomain.Instance) *gitopsinfra.Service {
	return gitopsinfra.NewService(gitopsinfra.Config{
		Enabled:               instance.Status == gitopsdomain.StatusActive && strings.TrimSpace(instance.LocalRoot) != "",
		LocalRoot:             strings.TrimSpace(instance.LocalRoot),
		DefaultBranch:         strings.TrimSpace(instance.DefaultBranch),
		Username:              strings.TrimSpace(instance.Username),
		Password:              strings.TrimSpace(instance.Password),
		Token:                 strings.TrimSpace(instance.Token),
		AuthorName:            strings.TrimSpace(instance.AuthorName),
		AuthorEmail:           strings.TrimSpace(instance.AuthorEmail),
		CommitMessageTemplate: strings.TrimSpace(instance.CommitMessageTemplate),
		CommandTimeoutSec:     instance.CommandTimeoutSec,
	})
}

func ensureDefaultGitOpsInstance(ctx context.Context, repo gitopsdomain.Repository, cfg bootstrap.Config) error {
	if repo == nil || !cfg.GitOps.Enabled || strings.TrimSpace(cfg.GitOps.LocalRoot) == "" {
		return nil
	}
	now := time.Now().UTC()
	_, err := repo.UpsertInstance(ctx, gitopsdomain.Instance{
		ID:                    "gitops-instance-default",
		InstanceCode:          "default",
		Name:                  "默认 GitOps",
		LocalRoot:             strings.TrimSpace(cfg.GitOps.LocalRoot),
		DefaultBranch:         strings.TrimSpace(cfg.GitOps.DefaultBranch),
		Username:              strings.TrimSpace(cfg.GitOps.Username),
		Password:              strings.TrimSpace(cfg.GitOps.Password),
		Token:                 strings.TrimSpace(cfg.GitOps.Token),
		AuthorName:            strings.TrimSpace(cfg.GitOps.AuthorName),
		AuthorEmail:           strings.TrimSpace(cfg.GitOps.AuthorEmail),
		CommitMessageTemplate: strings.TrimSpace(cfg.GitOps.CommitMessageTemplate),
		CommandTimeoutSec:     cfg.GitOps.CommandTimeoutSec,
		Status:                gitopsdomain.StatusActive,
		Remark:                "由配置文件自动同步的默认 GitOps 实例",
		CreatedAt:             now,
		UpdatedAt:             now,
	})
	return err
}

func ensureDefaultArgoCDInstance(ctx context.Context, repo argocddomain.Repository, cfg bootstrap.Config) error {
	if repo == nil || !cfg.ArgoCD.Enabled || strings.TrimSpace(cfg.ArgoCD.BaseURL) == "" {
		return nil
	}
	now := time.Now().UTC()
	_, err := repo.UpsertInstance(ctx, argocddomain.Instance{
		ID:                 "argocd-instance-default",
		InstanceCode:       "default",
		Name:               "默认 ArgoCD",
		BaseURL:            strings.TrimSpace(cfg.ArgoCD.BaseURL),
		InsecureSkipVerify: cfg.ArgoCD.InsecureSkipVerify,
		AuthMode:           strings.TrimSpace(cfg.ArgoCD.AuthMode),
		Token:              strings.TrimSpace(cfg.ArgoCD.Token),
		Username:           strings.TrimSpace(cfg.ArgoCD.Username),
		Password:           strings.TrimSpace(cfg.ArgoCD.Password),
		GitOpsInstanceID:   defaultGitOpsInstanceID(cfg),
		ClusterName:        "default",
		DefaultNamespace:   "",
		Status:             argocddomain.StatusActive,
		HealthStatus:       "unknown",
		CreatedAt:          now,
		UpdatedAt:          now,
		Remark:             "由配置文件自动同步的默认 ArgoCD 实例",
	})
	return err
}

func defaultGitOpsInstanceID(cfg bootstrap.Config) string {
	if cfg.GitOps.Enabled && strings.TrimSpace(cfg.GitOps.LocalRoot) != "" {
		return "gitops-instance-default"
	}
	return ""
}

type argoCDUsecaseClient struct {
	client *argocdinfra.Client
}

func (c argoCDUsecaseClient) Ping(ctx context.Context) error {
	if c.client == nil {
		return errors.New("argocd client is not configured")
	}
	return c.client.Ping(ctx)
}

func (c argoCDUsecaseClient) ListApplications(ctx context.Context) ([]usecase.ArgoCDApplicationSnapshot, error) {
	if c.client == nil {
		return nil, errors.New("argocd client is not configured")
	}
	items, err := c.client.ListApplications(ctx)
	if err != nil {
		return nil, err
	}
	result := make([]usecase.ArgoCDApplicationSnapshot, 0, len(items))
	for _, item := range items {
		result = append(result, item)
	}
	return result, nil
}

func (c argoCDUsecaseClient) GetApplication(ctx context.Context, name string) (usecase.ArgoCDApplicationSnapshot, error) {
	if c.client == nil {
		return nil, errors.New("argocd client is not configured")
	}
	return c.client.GetApplication(ctx, name)
}

func (c argoCDUsecaseClient) SyncApplication(ctx context.Context, name string) error {
	if c.client == nil {
		return errors.New("argocd client is not configured")
	}
	return c.client.SyncApplication(ctx, name)
}

func (c argoCDUsecaseClient) SyncApplicationWithRevision(ctx context.Context, name string, revision string) error {
	if c.client == nil {
		return errors.New("argocd client is not configured")
	}
	return c.client.SyncApplicationWithRevision(ctx, name, revision)
}

func (c argoCDUsecaseClient) BuildApplicationURL(name string) string {
	if c.client == nil {
		return ""
	}
	return c.client.BuildApplicationURL(name)
}
