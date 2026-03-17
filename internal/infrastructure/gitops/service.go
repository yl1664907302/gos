package gitops

import (
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"

	yaml "gopkg.in/yaml.v2"
)

// Config 描述平台在 GitOps 模式下操作声明式仓库所需的最小运行时参数。
//
// 这里刻意不做“通用 Git 客户端”，而是只支持受控的 clone / pull / commit / push：
// 1. local_root 既可以是工作副本根目录，也可以直接就是目标 GitOps 仓库；
// 2. default_branch 用于 ArgoCD Application 配置为 HEAD 时的回退分支；
// 3. author_name / author_email 固定平台提交身份，方便审计；
// 4. username/password 或 token 仅用于远端仓库认证注入。
type Config struct {
	Enabled           bool
	LocalRoot         string
	DefaultBranch     string
	Username          string
	Password          string
	Token             string
	AuthorName        string
	AuthorEmail       string
	CommandTimeoutSec int
}

type Service struct {
	enabled           bool
	localRoot         string
	defaultBranch     string
	username          string
	password          string
	token             string
	authorName        string
	authorEmail       string
	commandTimeoutSec int
}

type Status struct {
	Enabled           bool
	LocalRoot         string
	Mode              string
	DefaultBranch     string
	Username          string
	AuthorName        string
	AuthorEmail       string
	CommandTimeoutSec int
	PathExists        bool
	IsGitRepo         bool
	RemoteOrigin      string
	RemoteReachable   bool
	CurrentBranch     string
	HeadCommit        string
	HeadCommitSubject string
	WorktreeDirty     bool
	StatusSummary     []string
}

type BindingTarget struct {
	Path                  string
	AppDirectory          string
	DisplayName           string
	HierarchyHint         string
	AvailableEnvironments []string
}

func NewService(cfg Config) *Service {
	return &Service{
		enabled:           cfg.Enabled,
		localRoot:         strings.TrimSpace(cfg.LocalRoot),
		defaultBranch:     strings.TrimSpace(cfg.DefaultBranch),
		username:          strings.TrimSpace(cfg.Username),
		password:          strings.TrimSpace(cfg.Password),
		token:             strings.TrimSpace(cfg.Token),
		authorName:        strings.TrimSpace(cfg.AuthorName),
		authorEmail:       strings.TrimSpace(cfg.AuthorEmail),
		commandTimeoutSec: cfg.CommandTimeoutSec,
	}
}

func (s *Service) Enabled() bool {
	return s != nil && s.enabled && s.localRoot != ""
}

// GetStatus 返回 GitOps 工作目录的当前可见状态，供组件管理页展示。
//
// 这里故意返回“尽量完整的快照”而不是遇错即失败：
// 1. local_root 不存在时，前端也应该能看到配置摘要；
// 2. 目录存在但不是 Git 仓库时，应明确告诉用户当前状态；
// 3. 远端可达性单独探测，方便定位是本地目录问题还是 Git 凭据/网络问题。
func (s *Service) GetStatus(ctx context.Context) (Status, error) {
	status := Status{
		Enabled:           s.Enabled(),
		LocalRoot:         strings.TrimSpace(s.localRoot),
		Mode:              "workspace_root",
		DefaultBranch:     strings.TrimSpace(s.defaultBranch),
		Username:          strings.TrimSpace(s.username),
		AuthorName:        strings.TrimSpace(s.authorName),
		AuthorEmail:       strings.TrimSpace(s.authorEmail),
		CommandTimeoutSec: s.commandTimeoutSec,
	}
	if !status.Enabled {
		return status, nil
	}

	if _, err := os.Stat(status.LocalRoot); err == nil {
		status.PathExists = true
	} else if os.IsNotExist(err) {
		return status, nil
	} else {
		return status, err
	}

	if _, err := os.Stat(filepath.Join(status.LocalRoot, ".git")); err != nil {
		if os.IsNotExist(err) {
			return status, nil
		}
		return status, err
	}

	status.IsGitRepo = true
	status.Mode = "direct_repo"

	remoteOrigin, err := s.remoteOriginURL(ctx, status.LocalRoot)
	if err == nil {
		status.RemoteOrigin = strings.TrimSpace(remoteOrigin)
	}

	if status.CurrentBranch, err = s.gitSingleLine(ctx, status.LocalRoot, "rev-parse", "--abbrev-ref", "HEAD"); err != nil {
		return status, err
	}
	if status.HeadCommit, err = s.gitSingleLine(ctx, status.LocalRoot, "rev-parse", "HEAD"); err != nil {
		return status, err
	}
	if status.HeadCommitSubject, err = s.gitSingleLine(ctx, status.LocalRoot, "log", "-1", "--pretty=%s"); err != nil {
		return status, err
	}

	worktreeOutput, err := s.runGit(ctx, status.LocalRoot, "status", "--short")
	if err != nil {
		return status, err
	}
	lines := splitNonEmptyLines(worktreeOutput)
	status.WorktreeDirty = len(lines) > 0
	status.StatusSummary = lines

	if status.RemoteOrigin != "" {
		status.RemoteReachable = s.checkRemoteReachable(ctx, status.RemoteOrigin)
	}
	return status, nil
}

// ListBindingTargets 扫描 GitOps 仓库里可绑定到 ArgoCD CD 的工作子目录。
//
// 当前约定的目录层级是：
// apps/<应用目录>/overlays/<环境目录>
//
// 例如：
// apps/java_nantong/overlays/dev
// apps/java_nantong/overlays/test
//
// 这里返回给前端的不是 overlay 级目录，而是 apps/<应用目录> 这一层：
//  1. 绑定 CD=ArgoCD 时，用户只需要先选应用目录；
//  2. 实际执行环境通过平台标准 Key `env` 传入；
//  3. 发布执行时平台再拼出真正的 overlay 目录：
//     apps/<应用目录>/overlays/<env>
func (s *Service) ListBindingTargets(ctx context.Context) ([]BindingTarget, error) {
	status, err := s.GetStatus(ctx)
	if err != nil {
		return nil, err
	}
	if !status.Enabled {
		return []BindingTarget{}, nil
	}
	if !status.PathExists || !status.IsGitRepo {
		return []BindingTarget{}, nil
	}

	root := filepath.Join(strings.TrimSpace(status.LocalRoot), "apps")
	entries, err := os.ReadDir(root)
	if err != nil {
		if os.IsNotExist(err) {
			return []BindingTarget{}, nil
		}
		return nil, err
	}

	targets := make([]BindingTarget, 0)
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		appDir := strings.TrimSpace(entry.Name())
		if appDir == "" {
			continue
		}
		overlayRoot := filepath.Join(root, appDir, "overlays")
		envEntries, envErr := os.ReadDir(overlayRoot)
		if envErr != nil {
			if os.IsNotExist(envErr) {
				continue
			}
			return nil, envErr
		}
		environments := make([]string, 0, len(envEntries))
		for _, envEntry := range envEntries {
			if !envEntry.IsDir() {
				continue
			}
			environment := strings.TrimSpace(envEntry.Name())
			if environment != "" {
				environments = append(environments, environment)
			}
		}
		if len(environments) == 0 {
			continue
		}
		sort.Strings(environments)
		path := filepath.ToSlash(filepath.Join("apps", appDir))
		targets = append(targets, BindingTarget{
			Path:                  path,
			AppDirectory:          appDir,
			DisplayName:           appDir,
			HierarchyHint:         fmt.Sprintf("apps -> %s -> overlays -> <env>（env 由平台标准 Key 传递）", appDir),
			AvailableEnvironments: append([]string(nil), environments...),
		})
	}

	sort.Slice(targets, func(i, j int) bool {
		return strings.Compare(targets[i].Path, targets[j].Path) < 0
	})
	return targets, nil
}

// UpdateKustomizationImage 只做一件事：更新某个 overlay 下 kustomization.yaml 的镜像 tag。
//
// 这里特意限制为“单镜像条目受控修改”：
// 1. 平台首版只支持更新 images[].newTag，不开放任意 YAML 路径编辑；
// 2. 若文件里存在多条 image 记录，会直接报错，避免错误改动 sidecar 等其他镜像；
// 3. 每次更新后都会以平台固定身份提交，并 push 到指定分支。
func (s *Service) UpdateKustomizationImage(
	ctx context.Context,
	repoURL string,
	sourcePath string,
	branch string,
	newTag string,
	commitMessage string,
) (workspacePath string, manifestPath string, commitSHA string, previousTag string, changed bool, err error) {
	if !s.Enabled() {
		return "", "", "", "", false, fmt.Errorf("gitops service is not configured")
	}

	repoURL = strings.TrimSpace(repoURL)
	sourcePath = strings.TrimSpace(sourcePath)
	branch = resolveBranch(branch, s.defaultBranch)
	newTag = strings.TrimSpace(newTag)
	commitMessage = strings.TrimSpace(commitMessage)
	if repoURL == "" {
		return "", "", "", "", false, fmt.Errorf("gitops repo url is required")
	}
	if sourcePath == "" {
		return "", "", "", "", false, fmt.Errorf("gitops source path is required")
	}
	if newTag == "" {
		return "", "", "", "", false, fmt.Errorf("image_version is required")
	}
	if commitMessage == "" {
		commitMessage = "chore(gitops): update image version"
	}

	workspacePath, err = s.resolveWorkspacePath(ctx, repoURL)
	if err != nil {
		return "", "", "", "", false, err
	}
	if err = os.MkdirAll(s.localRoot, 0o755); err != nil {
		return "", "", "", "", false, err
	}
	if err = s.prepareWorkspace(ctx, repoURL, branch, workspacePath); err != nil {
		return "", "", "", "", false, err
	}
	if err = s.configureAuthor(ctx, workspacePath); err != nil {
		return "", "", "", "", false, err
	}

	manifestPath, err = secureJoin(workspacePath, sourcePath, "kustomization.yaml")
	if err != nil {
		return "", "", "", "", false, err
	}
	content, readErr := os.ReadFile(manifestPath)
	if readErr != nil {
		return "", "", "", "", false, readErr
	}

	updatedContent, previousTag, changed, err := updateSingleKustomizeImageTag(content, newTag)
	if err != nil {
		return "", "", "", "", false, err
	}
	if changed {
		if err = os.WriteFile(manifestPath, updatedContent, 0o644); err != nil {
			return "", "", "", "", false, err
		}
		relativeManifestPath, relErr := filepath.Rel(workspacePath, manifestPath)
		if relErr != nil {
			return "", "", "", "", false, relErr
		}
		if _, cmdErr := s.runGit(ctx, workspacePath, "add", relativeManifestPath); cmdErr != nil {
			return "", "", "", "", false, cmdErr
		}
		if _, cmdErr := s.runGit(ctx, workspacePath, "commit", "-m", commitMessage); cmdErr != nil {
			return "", "", "", "", false, cmdErr
		}
		if _, cmdErr := s.runGit(ctx, workspacePath, "push", "origin", branch); cmdErr != nil {
			return "", "", "", "", false, cmdErr
		}
	}

	commitSHA, err = s.currentCommitSHA(ctx, workspacePath)
	if err != nil {
		return "", "", "", "", false, err
	}
	return workspacePath, manifestPath, commitSHA, previousTag, changed, nil
}

// resolveWorkspacePath 优先复用 local_root 本身作为 GitOps 工作仓库。
//
// 这样可以支持两种模式：
//  1. local_root 是普通目录：平台在其下创建稳定命名的工作副本；
//  2. local_root 本身已经是目标仓库：平台直接在该仓库里 pull / edit / commit / push，
//     避免出现“仓库里再套一层 gitops-xxxx 子仓库”的混乱结构。
func (s *Service) resolveWorkspacePath(ctx context.Context, repoURL string) (string, error) {
	root := strings.TrimSpace(s.localRoot)
	if root == "" {
		return "", fmt.Errorf("gitops local root is required")
	}
	if _, err := os.Stat(filepath.Join(root, ".git")); err == nil {
		remoteURL, remoteErr := s.remoteOriginURL(ctx, root)
		if remoteErr == nil && sameRepo(remoteURL, repoURL) {
			return root, nil
		}
	}
	return filepath.Join(root, repoWorkspaceName(repoURL)), nil
}

func (s *Service) prepareWorkspace(ctx context.Context, repoURL string, branch string, workspacePath string) error {
	authURL, err := s.authRemoteURL(repoURL)
	if err != nil {
		return err
	}
	if _, statErr := os.Stat(filepath.Join(workspacePath, ".git")); statErr == nil {
		if _, err := s.runGit(ctx, workspacePath, "remote", "set-url", "origin", authURL); err != nil {
			return err
		}
		if _, err := s.runGit(ctx, workspacePath, "fetch", "origin", branch); err != nil {
			return err
		}
		if _, err := s.runGit(ctx, workspacePath, "checkout", "-B", branch, "origin/"+branch); err != nil {
			return err
		}
		if _, err := s.runGit(ctx, workspacePath, "clean", "-fd"); err != nil {
			return err
		}
		return nil
	}
	if err := os.RemoveAll(workspacePath); err != nil {
		return err
	}
	_, err = s.runCommand(ctx, "", "git", "clone", "--branch", branch, "--single-branch", authURL, workspacePath)
	return err
}

func (s *Service) remoteOriginURL(ctx context.Context, workspacePath string) (string, error) {
	output, err := s.runGit(ctx, workspacePath, "remote", "get-url", "origin")
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(output), nil
}

func (s *Service) configureAuthor(ctx context.Context, workspacePath string) error {
	if s.authorName == "" || s.authorEmail == "" {
		return nil
	}
	if _, err := s.runGit(ctx, workspacePath, "config", "user.name", s.authorName); err != nil {
		return err
	}
	if _, err := s.runGit(ctx, workspacePath, "config", "user.email", s.authorEmail); err != nil {
		return err
	}
	return nil
}

func (s *Service) currentCommitSHA(ctx context.Context, workspacePath string) (string, error) {
	output, err := s.runGit(ctx, workspacePath, "rev-parse", "HEAD")
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(output), nil
}

func (s *Service) authRemoteURL(rawURL string) (string, error) {
	rawURL = strings.TrimSpace(rawURL)
	if rawURL == "" {
		return "", fmt.Errorf("gitops repo url is required")
	}
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return rawURL, nil
	}
	switch {
	case s.username != "" && s.password != "":
		parsed.User = url.UserPassword(s.username, s.password)
	case s.token != "":
		username := s.username
		if username == "" {
			username = "oauth2"
		}
		parsed.User = url.UserPassword(username, s.token)
	}
	return parsed.String(), nil
}

func (s *Service) runGit(ctx context.Context, workspacePath string, args ...string) (string, error) {
	return s.runCommand(ctx, workspacePath, "git", args...)
}

func (s *Service) gitSingleLine(ctx context.Context, workspacePath string, args ...string) (string, error) {
	output, err := s.runGit(ctx, workspacePath, args...)
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(output), nil
}

func (s *Service) runCommand(ctx context.Context, workspacePath string, name string, args ...string) (string, error) {
	timeout := time.Duration(s.commandTimeoutSec) * time.Second
	if timeout <= 0 {
		timeout = 30 * time.Second
	}
	cmdCtx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	cmd := exec.CommandContext(cmdCtx, name, args...)
	cmd.Dir = workspacePath
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		message := strings.TrimSpace(stderr.String())
		if message == "" {
			message = strings.TrimSpace(stdout.String())
		}
		if message == "" {
			message = err.Error()
		}
		return "", fmt.Errorf("%s %s failed: %s", name, strings.Join(args, " "), message)
	}
	return stdout.String(), nil
}

func repoWorkspaceName(repoURL string) string {
	sum := sha1.Sum([]byte(strings.TrimSpace(repoURL)))
	return "gitops-" + hex.EncodeToString(sum[:8])
}

func (s *Service) checkRemoteReachable(ctx context.Context, remoteURL string) bool {
	authURL, err := s.authRemoteURL(remoteURL)
	if err != nil {
		return false
	}
	_, err = s.runCommand(ctx, "", "git", "ls-remote", authURL, "HEAD")
	return err == nil
}

func sameRepo(left string, right string) bool {
	return normalizeRepoURL(left) == normalizeRepoURL(right)
}

func normalizeRepoURL(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return ""
	}
	parsed, err := url.Parse(raw)
	if err != nil {
		return strings.TrimSuffix(raw, "/")
	}
	parsed.User = nil
	parsed.Path = strings.TrimSuffix(parsed.Path, "/")
	return parsed.String()
}

func splitNonEmptyLines(raw string) []string {
	lines := strings.Split(raw, "\n")
	items := make([]string, 0, len(lines))
	for _, line := range lines {
		value := strings.TrimSpace(line)
		if value != "" {
			items = append(items, value)
		}
	}
	return items
}

func resolveBranch(candidate string, fallback string) string {
	candidate = strings.TrimSpace(candidate)
	if candidate == "" || strings.EqualFold(candidate, "HEAD") {
		candidate = strings.TrimSpace(fallback)
	}
	if candidate == "" {
		return "master"
	}
	return candidate
}

func secureJoin(root string, parts ...string) (string, error) {
	joined := filepath.Join(append([]string{root}, parts...)...)
	cleanRoot := filepath.Clean(root)
	cleanJoined := filepath.Clean(joined)
	relative, err := filepath.Rel(cleanRoot, cleanJoined)
	if err != nil {
		return "", err
	}
	if strings.HasPrefix(relative, "..") {
		return "", fmt.Errorf("gitops source path escapes workspace")
	}
	return cleanJoined, nil
}

func updateSingleKustomizeImageTag(content []byte, newTag string) ([]byte, string, bool, error) {
	var doc yaml.MapSlice
	if err := yaml.Unmarshal(content, &doc); err != nil {
		return nil, "", false, fmt.Errorf("parse kustomization.yaml failed: %w", err)
	}

	imagesValue, ok := mapSliceGet(doc, "images")
	if !ok {
		return nil, "", false, fmt.Errorf("kustomization.yaml is missing images section")
	}
	images, ok := imagesValue.([]interface{})
	if !ok || len(images) == 0 {
		return nil, "", false, fmt.Errorf("kustomization.yaml has no image entries")
	}
	if len(images) != 1 {
		return nil, "", false, fmt.Errorf("kustomization.yaml contains %d image entries, current GitOps strategy only supports one", len(images))
	}

	imageItem, ok := images[0].(yaml.MapSlice)
	if !ok {
		return nil, "", false, fmt.Errorf("unsupported images item structure")
	}
	currentTag, ok := mapSliceString(imageItem, "newTag")
	if !ok {
		return nil, "", false, fmt.Errorf("images[0].newTag is missing")
	}
	if strings.TrimSpace(currentTag) == strings.TrimSpace(newTag) {
		return content, currentTag, false, nil
	}

	imageItem = mapSliceSet(imageItem, "newTag", newTag)
	images[0] = imageItem
	doc = mapSliceSet(doc, "images", images)

	updated, err := yaml.Marshal(doc)
	if err != nil {
		return nil, "", false, fmt.Errorf("encode kustomization.yaml failed: %w", err)
	}
	return updated, currentTag, true, nil
}

func mapSliceGet(items yaml.MapSlice, key string) (interface{}, bool) {
	for _, item := range items {
		if strings.EqualFold(fmt.Sprint(item.Key), key) {
			return item.Value, true
		}
	}
	return nil, false
}

func mapSliceString(items yaml.MapSlice, key string) (string, bool) {
	value, ok := mapSliceGet(items, key)
	if !ok {
		return "", false
	}
	return strings.TrimSpace(fmt.Sprint(value)), true
}

func mapSliceSet(items yaml.MapSlice, key string, value interface{}) yaml.MapSlice {
	for idx, item := range items {
		if strings.EqualFold(fmt.Sprint(item.Key), key) {
			items[idx].Value = value
			return items
		}
	}
	return append(items, yaml.MapItem{Key: key, Value: value})
}
