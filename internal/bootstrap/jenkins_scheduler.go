package bootstrap

import (
	"context"
	"log"
	"time"
)

type JenkinsSyncTask struct {
	stop func()
	done <-chan struct{}
}

func (t JenkinsSyncTask) Stop() {
	if t.stop == nil {
		return
	}
	t.stop()
	if t.done == nil {
		return
	}
	<-t.done
}

func StartJenkinsAutoSyncTask(cfg JenkinsConfig, run func(context.Context) error) JenkinsSyncTask {
	done := make(chan struct{})
	if !cfg.Enabled || !cfg.AutoSyncEnabled || run == nil {
		close(done)
		return JenkinsSyncTask{
			stop: func() {},
			done: done,
		}
	}

	interval := time.Duration(cfg.AutoSyncIntervalSec) * time.Second
	if interval <= 0 {
		interval = 300 * time.Second
	}

	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		defer close(done)
		log.Printf("jenkins auto sync task started, interval=%s", interval)

		execute := func() {
			if err := run(ctx); err != nil {
				log.Printf("jenkins auto sync failed: %v", err)
			}
		}

		execute()

		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				log.Printf("jenkins auto sync task stopped")
				return
			case <-ticker.C:
				execute()
			}
		}
	}()

	return JenkinsSyncTask{
		stop: cancel,
		done: done,
	}
}
