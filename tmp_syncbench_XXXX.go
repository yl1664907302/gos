package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"gos/internal/application/usecase"
	"gos/internal/bootstrap"
	"gos/internal/infrastructure/jenkins"
	"gos/internal/infrastructure/persistence/sqlrepo"
)

func main() {
	cfg, err := bootstrap.LoadConfig()
	if err != nil {
		panic(err)
	}
	db, err := sql.Open("mysql", cfg.Database.MySQLDSN)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	if err := db.Ping(); err != nil {
		panic(err)
	}

	repo := sqlrepo.NewPipelineParamRepository(db)
	client, err := jenkins.NewClient(jenkins.Config{
		BaseURL:  cfg.Jenkins.BaseURL,
		Username: cfg.Jenkins.Username,
		APIToken: cfg.Jenkins.APIToken,
		Timeout:  time.Duration(cfg.Jenkins.TimeoutSec) * time.Second,
	})
	if err != nil {
		panic(err)
	}
	uc := usecase.NewSyncPipelineParamDefs(repo, client)

	start := time.Now()
	res, err := uc.Execute(context.Background())
	dur := time.Since(start)
	if err != nil {
		fmt.Printf("ERR dur=%s err=%v\n", dur, err)
		return
	}
	fmt.Printf("OK total=%d created=%d updated=%d inactivated=%d skipped=%d dur=%s\n", res.Total, res.Created, res.Updated, res.Inactivated, res.Skipped, dur)
}
