package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"gos/internal/application/usecase"
	"gos/internal/bootstrap"
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

	pipelineParamRepo := sqlrepo.NewPipelineParamRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(pipelineParamRepo); err != nil {
		log.Fatalf("init pipeline param schema: %v", err)
	}
	releaseRepo := sqlrepo.NewReleaseRepository(db, cfg.Database.Driver)
	if err := bootstrap.InitSchema(releaseRepo); err != nil {
		log.Fatalf("init release schema: %v", err)
	}

	jenkinsClient := jenkins.NewClient(jenkins.Config{
		BaseURL:    cfg.Jenkins.BaseURL,
		Username:   cfg.Jenkins.Username,
		APIToken:   cfg.Jenkins.APIToken,
		TimeoutSec: cfg.Jenkins.TimeoutSec,
	})
	syncPipelines := usecase.NewSyncPipelines(pipelineRepo, jenkinsClient)
	syncPipelineParamDefs := usecase.NewSyncPipelineParamDefs(pipelineParamRepo, jenkinsClient)

	handler := httpapi.NewApplicationHandler(
		usecase.NewCreateApplication(repo),
		usecase.NewQueryApplication(repo),
		usecase.NewUpdateApplication(repo),
		usecase.NewDeleteApplication(repo),
	)
	pipelineHandler := httpapi.NewPipelineHandler(
		syncPipelines,
		usecase.NewQueryPipeline(pipelineRepo, jenkinsClient),
		usecase.NewPipelineBindingManager(pipelineRepo, repo),
	)
	platformParamHandler := httpapi.NewPlatformParamHandler(
		usecase.NewPlatformParamDictManager(platformParamRepo, pipelineParamRepo),
	)
	pipelineParamHandler := httpapi.NewPipelineParamHandler(
		usecase.NewPipelineParamDefManager(pipelineParamRepo, repo, pipelineRepo, platformParamRepo),
		syncPipelineParamDefs,
	)
	releaseOrderManager := usecase.NewReleaseOrderManager(releaseRepo, repo, pipelineRepo, jenkinsClient)
	releaseOrderLogStreamer := usecase.NewReleaseOrderLogStreamer(releaseRepo, pipelineRepo, jenkinsClient)
	releaseOrderHandler := httpapi.NewReleaseOrderHandler(releaseOrderManager, releaseOrderLogStreamer)
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
			"jenkins auto sync completed: total=%d created=%d updated=%d skipped=%d",
			pipelineResult.Total,
			pipelineResult.Created,
			pipelineResult.Updated,
			pipelineResult.Skipped,
		)

		paramResult, err := syncPipelineParamDefs.Execute(ctx)
		if err != nil {
			return err
		}
		log.Printf(
			"jenkins param auto sync completed: total=%d created=%d updated=%d skipped=%d",
			paramResult.Total,
			paramResult.Created,
			paramResult.Updated,
			paramResult.Skipped,
		)
		return nil
	})
	defer syncTask.Stop()

	releaseTrackTask := bootstrap.StartJenkinsReleaseTrackTask(cfg.Jenkins, func(ctx context.Context) error {
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

	router := httpapi.NewRouter(handler, pipelineHandler, platformParamHandler, pipelineParamHandler, releaseOrderHandler)

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
		"server listening on %s (env=%s db=%s jenkins_enabled=%t)",
		cfg.Server.Addr,
		cfg.Environment,
		cfg.Database.Driver,
		cfg.Jenkins.Enabled,
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
