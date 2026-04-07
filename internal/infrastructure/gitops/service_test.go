package gitops

import "testing"

func TestBuildCommitMessageUsesConfiguredTemplate(t *testing.T) {
	service := NewService(Config{
		Enabled:               true,
		LocalRoot:             "/tmp/gitops",
		CommitMessageTemplate: "release: {env} -> {image_version}",
	})

	got := service.BuildCommitMessage(
		map[string]string{
			"order_no":      "RO-20260318-001",
			"app_name":      "南通后端",
			"app_key":       "java_nantong",
			"env":           "dev",
			"image_version": "20260318.1",
			"source_path":   "apps/java_nantong/overlays/dev",
		},
	)

	want := "release: dev -> 20260318.1"
	if got != want {
		t.Fatalf("unexpected commit message: got %q want %q", got, want)
	}
}

func TestBuildCommitMessageFallsBackToDefaultTemplate(t *testing.T) {
	service := NewService(Config{
		Enabled:   true,
		LocalRoot: "/tmp/gitops",
	})

	got := service.BuildCommitMessage(
		map[string]string{
			"order_no":      "RO-20260318-002",
			"app_name":      "南通后端",
			"app_key":       "java_nantong",
			"project_name":  "gateway",
			"env":           "dev",
			"branch":        "master",
			"image_version": "20260318.2",
		},
	)

	want := "chore(release): java_nantong/gateway/dev -> 20260318.2 (master)"
	if got != want {
		t.Fatalf("unexpected default commit message: got %q want %q", got, want)
	}
}

func TestBuildCommitMessageSupportsDynamicPlatformKeys(t *testing.T) {
	service := NewService(Config{
		Enabled:               true,
		LocalRoot:             "/tmp/gitops",
		CommitMessageTemplate: "release: {env} / {image_version} / {project_name}",
	})

	got := service.BuildCommitMessage(map[string]string{
		"env":           "test",
		"image_version": "20260318.3",
		"project_name":  "gateway",
	})

	want := "release: test / 20260318.3 / gateway"
	if got != want {
		t.Fatalf("unexpected dynamic commit message: got %q want %q", got, want)
	}
}

func TestNormalizeHoistedHelmValuesFilePathTemplate(t *testing.T) {
	got := normalizeHoistedHelmValuesFilePathTemplate("apps/java-nantong-test/helm/platform.values-{env}.yaml")
	want := "apps/helm/platform.values-{env}.yaml"
	if got != want {
		t.Fatalf("unexpected hoisted helm values path: got %q want %q", got, want)
	}
}

func TestNormalizeHoistedHelmValuesFilePathTemplateKeepsSharedPath(t *testing.T) {
	got := normalizeHoistedHelmValuesFilePathTemplate("apps/helm/platform.values-{env}.yaml")
	want := "apps/helm/platform.values-{env}.yaml"
	if got != want {
		t.Fatalf("unexpected shared helm values path: got %q want %q", got, want)
	}
}
