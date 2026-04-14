package usecase

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"

	agentdomain "gos/internal/domain/agent"
	notificationdomain "gos/internal/domain/notification"
	domain "gos/internal/domain/release"
)

func TestShouldTriggerTemplateHook(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name      string
		condition domain.TemplateHookTriggerCondition
		status    domain.OrderStatus
		want      bool
	}{
		{
			name:      "on_success with success",
			condition: domain.TemplateHookTriggerOnSuccess,
			status:    domain.OrderStatusSuccess,
			want:      true,
		},
		{
			name:      "on_success with failed",
			condition: domain.TemplateHookTriggerOnSuccess,
			status:    domain.OrderStatusFailed,
			want:      false,
		},
		{
			name:      "on_failed with failed",
			condition: domain.TemplateHookTriggerOnFailed,
			status:    domain.OrderStatusFailed,
			want:      true,
		},
		{
			name:      "on_failed with cancelled",
			condition: domain.TemplateHookTriggerOnFailed,
			status:    domain.OrderStatusCancelled,
			want:      true,
		},
		{
			name:      "on_failed with success",
			condition: domain.TemplateHookTriggerOnFailed,
			status:    domain.OrderStatusSuccess,
			want:      false,
		},
		{
			name:      "always with success",
			condition: domain.TemplateHookTriggerAlways,
			status:    domain.OrderStatusSuccess,
			want:      true,
		},
		{
			name:      "always with failed",
			condition: domain.TemplateHookTriggerAlways,
			status:    domain.OrderStatusFailed,
			want:      true,
		},
		{
			name:      "always with cancelled",
			condition: domain.TemplateHookTriggerAlways,
			status:    domain.OrderStatusCancelled,
			want:      true,
		},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			got := shouldTriggerTemplateHook(tc.condition, tc.status)
			if got != tc.want {
				t.Fatalf("shouldTriggerTemplateHook(%q, %q) = %v, want %v", tc.condition, tc.status, got, tc.want)
			}
		})
	}
}

func TestHookMatchesOrderEnv(t *testing.T) {
	t.Parallel()

	cases := []struct {
		name      string
		envCodes  []string
		orderEnv  string
		wantMatch bool
	}{
		{
			name:      "empty hook envs means all envs",
			envCodes:  nil,
			orderEnv:  "prod",
			wantMatch: true,
		},
		{
			name:      "single env match",
			envCodes:  []string{"prod"},
			orderEnv:  "prod",
			wantMatch: true,
		},
		{
			name:      "case insensitive match",
			envCodes:  []string{"Prod"},
			orderEnv:  "prod",
			wantMatch: true,
		},
		{
			name:      "env not matched",
			envCodes:  []string{"prod"},
			orderEnv:  "dev",
			wantMatch: false,
		},
		{
			name:      "blank order env does not match filtered hook",
			envCodes:  []string{"prod"},
			orderEnv:  "",
			wantMatch: false,
		},
	}

	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			if got := hookMatchesOrderEnv(tc.envCodes, tc.orderEnv); got != tc.wantMatch {
				t.Fatalf("hookMatchesOrderEnv(%v, %q) = %v, want %v", tc.envCodes, tc.orderEnv, got, tc.wantMatch)
			}
		})
	}
}

func TestBuildTemplateHookEnvSkipMessage(t *testing.T) {
	t.Parallel()

	got := buildTemplateHookEnvSkipMessage([]string{"prod", "pre"}, "dev")
	want := "当前环境 dev 未命中 Hook 执行环境（prod / pre），已跳过"
	if got != want {
		t.Fatalf("buildTemplateHookEnvSkipMessage mismatch: got %q want %q", got, want)
	}
}

func TestParseHookTaskBatchIdentity(t *testing.T) {
	t.Parallel()

	message := buildHookTaskBatchProgressMessage(
		domain.ReleaseTemplateHook{Name: "发布后校验", TargetName: "发布后校验"},
		agentdomain.Task{ID: "agtask-source", Name: "发布后校验"},
		[]agentdomain.Task{
			{ID: "agtask-1", Status: agentdomain.TaskStatusPending},
			{ID: "agtask-2", Status: agentdomain.TaskStatusRunning},
		},
		"agbatch-1",
	)
	sourceTaskID, batchID := parseHookTaskBatchIdentity(message)
	if sourceTaskID != "agtask-source" {
		t.Fatalf("sourceTaskID = %q, want %q", sourceTaskID, "agtask-source")
	}
	if batchID != "agbatch-1" {
		t.Fatalf("batchID = %q, want %q", batchID, "agbatch-1")
	}
}

func TestParseHookTaskIDFromTerminalMessage(t *testing.T) {
	t.Parallel()

	message := buildHookTaskTerminalMessage(
		domain.ReleaseTemplateHook{Name: "发布后校验", TargetName: "发布后校验"},
		agentdomain.Task{ID: "agtask-123", Name: "发布后校验", LastRunSummary: "执行完成"},
		"执行成功",
	)
	if got := parseHookTaskID(message); got != "agtask-123" {
		t.Fatalf("parseHookTaskID(%q) = %q, want %q", message, got, "agtask-123")
	}
}

func TestEvaluateMainReleaseStatus(t *testing.T) {
	t.Parallel()

	status, message, done := evaluateMainReleaseStatus([]domain.ReleaseOrderExecution{
		{Status: domain.ExecutionStatusSuccess},
		{Status: domain.ExecutionStatusSuccess},
	})
	if !done || status != domain.OrderStatusSuccess || message != "发布完成" {
		t.Fatalf("success case mismatch: done=%v status=%s message=%s", done, status, message)
	}

	status, message, done = evaluateMainReleaseStatus([]domain.ReleaseOrderExecution{
		{Status: domain.ExecutionStatusSuccess},
		{Status: domain.ExecutionStatusFailed},
	})
	if !done || status != domain.OrderStatusFailed || message != "存在失败执行单元" {
		t.Fatalf("failed case mismatch: done=%v status=%s message=%s", done, status, message)
	}

	status, message, done = evaluateMainReleaseStatus([]domain.ReleaseOrderExecution{
		{Status: domain.ExecutionStatusCancelled},
	})
	if !done || status != domain.OrderStatusCancelled || message != "存在已取消执行单元" {
		t.Fatalf("cancelled case mismatch: done=%v status=%s message=%s", done, status, message)
	}

	status, message, done = evaluateMainReleaseStatus([]domain.ReleaseOrderExecution{
		{Status: domain.ExecutionStatusRunning},
	})
	if done || status != domain.OrderStatusRunning || message != "" {
		t.Fatalf("running case mismatch: done=%v status=%s message=%s", done, status, message)
	}
}

func TestSendTemplateWebhookTimeout(t *testing.T) {
	t.Parallel()

	previousTimeout := templateWebhookHTTPTimeout
	templateWebhookHTTPTimeout = 50 * time.Millisecond
	t.Cleanup(func() {
		templateWebhookHTTPTimeout = previousTimeout
	})

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(200 * time.Millisecond)
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	t.Cleanup(server.Close)

	req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, server.URL, strings.NewReader(`{}`))
	if err != nil {
		t.Fatalf("NewRequestWithContext failed: %v", err)
	}

	startedAt := time.Now()
	_, err = sendTemplateWebhook(req)
	if err == nil {
		t.Fatal("sendTemplateWebhook error = nil, want timeout error")
	}
	if elapsed := time.Since(startedAt); elapsed >= 180*time.Millisecond {
		t.Fatalf("sendTemplateWebhook elapsed = %s, want timeout before server responds", elapsed)
	}
}

func TestBuildNotificationHookRequestAddsDingTalkSignature(t *testing.T) {
	t.Parallel()

	req, err := buildNotificationHookRequest(context.Background(), notificationdomain.Source{
		SourceType:        notificationdomain.SourceTypeDingTalk,
		WebhookURL:        "https://oapi.dingtalk.com/robot/send?access_token=test-token",
		VerificationParam: "ding-secret",
	}, "title", "body")
	if err != nil {
		t.Fatalf("buildNotificationHookRequest failed: %v", err)
	}

	parsedURL, err := url.Parse(req.URL.String())
	if err != nil {
		t.Fatalf("url.Parse failed: %v", err)
	}
	query := parsedURL.Query()
	if query.Get("access_token") != "test-token" {
		t.Fatalf("access_token = %q, want %q", query.Get("access_token"), "test-token")
	}
	if query.Get("timestamp") == "" {
		t.Fatal("timestamp = empty, want signed timestamp")
	}
	if query.Get("sign") == "" {
		t.Fatal("sign = empty, want signed signature")
	}
}
