package usecase

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	userdomain "gos/internal/domain/user"
	"gos/internal/support/logx"

	"golang.org/x/crypto/bcrypt"
)

type UserManagement struct {
	repo userdomain.Repository
	now  func() time.Time
}

type AuthSessionManager struct {
	repo       userdomain.Repository
	sessionTTL time.Duration
	now        func() time.Time
}

type CreateUserInput struct {
	Username    string
	DisplayName string
	Email       string
	Phone       string
	Role        userdomain.Role
	Status      userdomain.Status
	Password    string
}

type UpdateUserInput struct {
	DisplayName string
	Email       string
	Phone       string
	Role        userdomain.Role
	Status      userdomain.Status
	Password    string
}

type LoginInput struct {
	Username  string
	Password  string
	ClientIP  string
	UserAgent string
}

type LoginOutput struct {
	AccessToken string          `json:"access_token"`
	ExpiredAt   time.Time       `json:"expired_at"`
	User        userdomain.User `json:"user"`
}

func NewUserManagement(repo userdomain.Repository) *UserManagement {
	return &UserManagement{
		repo: repo,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func NewAuthSessionManager(repo userdomain.Repository, sessionTTL time.Duration) *AuthSessionManager {
	if sessionTTL <= 0 {
		sessionTTL = 24 * time.Hour
	}
	return &AuthSessionManager{
		repo:       repo,
		sessionTTL: sessionTTL,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func HashPassword(password string) (string, error) {
	raw := strings.TrimSpace(password)
	if raw == "" {
		return "", fmt.Errorf("%w: password is required", ErrInvalidInput)
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(raw), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func (uc *UserManagement) EnsureSeedData(
	ctx context.Context,
	adminUsername string,
	adminDisplayName string,
	adminPassword string,
) error {
	username := strings.TrimSpace(adminUsername)
	password := strings.TrimSpace(adminPassword)
	if username == "" || password == "" {
		return nil
	}
	passwordHash, err := HashPassword(password)
	if err != nil {
		return err
	}
	return uc.repo.EnsureSeedData(ctx, username, strings.TrimSpace(adminDisplayName), passwordHash, uc.now())
}

func (uc *UserManagement) ListUsers(ctx context.Context, filter userdomain.UserListFilter) ([]userdomain.User, int64, error) {
	const (
		defaultPage     = 1
		defaultPageSize = 20
		maxPageSize     = 100
	)
	filter.Username = strings.TrimSpace(filter.Username)
	filter.Name = strings.TrimSpace(filter.Name)
	if filter.Role != "" && !filter.Role.Valid() {
		return nil, 0, ErrInvalidInput
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
	return uc.repo.ListUsers(ctx, filter)
}

func (uc *UserManagement) GetUserByID(ctx context.Context, id string) (userdomain.User, error) {
	if strings.TrimSpace(id) == "" {
		return userdomain.User{}, ErrInvalidID
	}
	return uc.repo.GetUserByID(ctx, id)
}

func (uc *UserManagement) CreateUser(ctx context.Context, input CreateUserInput) (userdomain.User, error) {
	username := strings.TrimSpace(input.Username)
	if username == "" {
		return userdomain.User{}, fmt.Errorf("%w: username is required", ErrInvalidInput)
	}
	displayName := strings.TrimSpace(input.DisplayName)
	if displayName == "" {
		displayName = username
	}
	role := input.Role
	if role == "" {
		role = userdomain.RoleNormal
	}
	if !role.Valid() {
		return userdomain.User{}, ErrInvalidInput
	}
	status := input.Status
	if status == "" {
		status = userdomain.StatusActive
	}
	if !status.Valid() {
		return userdomain.User{}, ErrInvalidStatus
	}
	passwordHash, err := HashPassword(input.Password)
	if err != nil {
		return userdomain.User{}, err
	}

	now := uc.now()
	item := userdomain.User{
		ID:           generateID("usr"),
		Username:     username,
		DisplayName:  displayName,
		Email:        strings.TrimSpace(input.Email),
		Phone:        strings.TrimSpace(input.Phone),
		Role:         role,
		Status:       status,
		PasswordHash: passwordHash,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	if err := uc.repo.CreateUser(ctx, item); err != nil {
		return userdomain.User{}, err
	}
	return uc.repo.GetUserByID(ctx, item.ID)
}

func (uc *UserManagement) UpdateUser(ctx context.Context, id string, input UpdateUserInput) (userdomain.User, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return userdomain.User{}, ErrInvalidID
	}
	current, err := uc.repo.GetUserByID(ctx, id)
	if err != nil {
		return userdomain.User{}, err
	}

	role := input.Role
	if role == "" {
		role = current.Role
	}
	if !role.Valid() {
		return userdomain.User{}, ErrInvalidInput
	}
	status := input.Status
	if status == "" {
		status = current.Status
	}
	if !status.Valid() {
		return userdomain.User{}, ErrInvalidStatus
	}

	passwordHash := current.PasswordHash
	if strings.TrimSpace(input.Password) != "" {
		hash, hashErr := HashPassword(input.Password)
		if hashErr != nil {
			return userdomain.User{}, hashErr
		}
		passwordHash = hash
	}
	displayName := strings.TrimSpace(input.DisplayName)
	if displayName == "" {
		displayName = current.DisplayName
	}

	return uc.repo.UpdateUser(ctx, id, userdomain.UserUpdateInput{
		DisplayName:  displayName,
		Email:        strings.TrimSpace(input.Email),
		Phone:        strings.TrimSpace(input.Phone),
		Role:         role,
		Status:       status,
		PasswordHash: passwordHash,
	}, uc.now())
}

func (uc *UserManagement) DeleteUser(ctx context.Context, id string) error {
	id = strings.TrimSpace(id)
	if id == "" {
		return ErrInvalidID
	}
	return uc.repo.DeleteUser(ctx, id)
}

func (uc *UserManagement) ListUserOptions(ctx context.Context) ([]userdomain.User, error) {
	return uc.repo.ListUserOptions(ctx)
}

func (uc *UserManagement) ListPermissions(ctx context.Context, filter userdomain.PermissionFilter) ([]userdomain.Permission, error) {
	filter.Module = strings.TrimSpace(filter.Module)
	filter.Action = strings.TrimSpace(filter.Action)
	return uc.repo.ListPermissions(ctx, filter)
}

func (uc *UserManagement) ListUserPermissions(ctx context.Context, userID string) ([]userdomain.UserPermission, error) {
	if strings.TrimSpace(userID) == "" {
		return nil, ErrInvalidID
	}
	if _, err := uc.repo.GetUserByID(ctx, userID); err != nil {
		return nil, err
	}
	return uc.repo.ListUserPermissions(ctx, userID)
}

func (uc *UserManagement) GrantUserPermissions(
	ctx context.Context,
	userID string,
	items []userdomain.UserPermissionGrant,
) error {
	userID = strings.TrimSpace(userID)
	if userID == "" {
		return ErrInvalidID
	}
	if _, err := uc.repo.GetUserByID(ctx, userID); err != nil {
		return err
	}
	if len(items) == 0 {
		return fmt.Errorf("%w: permission items are required", ErrInvalidInput)
	}

	clean := make([]userdomain.UserPermissionGrant, 0, len(items))
	for _, item := range items {
		code := strings.TrimSpace(item.PermissionCode)
		if code == "" {
			return fmt.Errorf("%w: permission_code is required", ErrInvalidInput)
		}
		scopeType := strings.ToLower(strings.TrimSpace(item.ScopeType))
		if scopeType == "" {
			scopeType = "global"
		}
		scopeValue := strings.TrimSpace(item.ScopeValue)
		if scopeType == "application" && scopeValue == "" {
			return fmt.Errorf("%w: scope_value is required when scope_type=application", ErrInvalidInput)
		}
		clean = append(clean, userdomain.UserPermissionGrant{
			PermissionCode: code,
			ScopeType:      scopeType,
			ScopeValue:     scopeValue,
		})
	}
	return uc.repo.GrantUserPermissions(ctx, userID, clean, uc.now())
}

func (uc *UserManagement) RevokeUserPermissions(
	ctx context.Context,
	userID string,
	items []userdomain.UserPermissionGrant,
) error {
	userID = strings.TrimSpace(userID)
	if userID == "" {
		return ErrInvalidID
	}
	if _, err := uc.repo.GetUserByID(ctx, userID); err != nil {
		return err
	}
	if len(items) == 0 {
		return fmt.Errorf("%w: permission items are required", ErrInvalidInput)
	}
	clean := make([]userdomain.UserPermissionGrant, 0, len(items))
	for _, item := range items {
		code := strings.TrimSpace(item.PermissionCode)
		if code == "" {
			return fmt.Errorf("%w: permission_code is required", ErrInvalidInput)
		}
		scopeType := strings.ToLower(strings.TrimSpace(item.ScopeType))
		if scopeType == "" {
			scopeType = "global"
		}
		scopeValue := strings.TrimSpace(item.ScopeValue)
		if scopeType == "application" && scopeValue == "" {
			return fmt.Errorf("%w: scope_value is required when scope_type=application", ErrInvalidInput)
		}
		clean = append(clean, userdomain.UserPermissionGrant{
			PermissionCode: code,
			ScopeType:      scopeType,
			ScopeValue:     scopeValue,
		})
	}
	return uc.repo.RevokeUserPermissions(ctx, userID, clean)
}

func (uc *UserManagement) ListUserParamPermissions(
	ctx context.Context,
	userID string,
	applicationID string,
) ([]userdomain.UserParamPermission, error) {
	userID = strings.TrimSpace(userID)
	if userID == "" {
		return nil, ErrInvalidID
	}
	if _, err := uc.repo.GetUserByID(ctx, userID); err != nil {
		return nil, err
	}
	return uc.repo.ListUserParamPermissions(ctx, userID, strings.TrimSpace(applicationID))
}

func (uc *UserManagement) UpsertUserParamPermission(
	ctx context.Context,
	item userdomain.UserParamPermission,
) (userdomain.UserParamPermission, error) {
	item.UserID = strings.TrimSpace(item.UserID)
	item.ParamKey = strings.ToLower(strings.TrimSpace(item.ParamKey))
	item.ApplicationID = strings.TrimSpace(item.ApplicationID)
	if item.UserID == "" || item.ParamKey == "" {
		return userdomain.UserParamPermission{}, fmt.Errorf("%w: user_id and param_key are required", ErrInvalidInput)
	}
	if _, err := uc.repo.GetUserByID(ctx, item.UserID); err != nil {
		return userdomain.UserParamPermission{}, err
	}
	if item.ID == "" {
		item.ID = generateID("upp")
	}
	now := uc.now()
	if item.CreatedAt.IsZero() {
		item.CreatedAt = now
	}
	item.UpdatedAt = now
	return uc.repo.UpsertUserParamPermission(ctx, item)
}

func (uc *UserManagement) DeleteUserParamPermission(ctx context.Context, id string) error {
	id = strings.TrimSpace(id)
	if id == "" {
		return ErrInvalidID
	}
	return uc.repo.DeleteUserParamPermission(ctx, id)
}

func (uc *AuthSessionManager) Login(ctx context.Context, input LoginInput) (LoginOutput, error) {
	username := strings.TrimSpace(input.Username)
	password := strings.TrimSpace(input.Password)
	logx.Info("auth", "login_start",
		logx.F("username", username),
		logx.F("client_ip", input.ClientIP),
	)
	if username == "" || password == "" {
		err := fmt.Errorf("%w: username and password are required", ErrInvalidInput)
		logx.Error("auth", "login_failed", err,
			logx.F("username", username),
			logx.F("client_ip", input.ClientIP),
		)
		return LoginOutput{}, err
	}
	user, err := uc.repo.GetUserByUsername(ctx, username)
	if err != nil {
		logx.Error("auth", "login_failed", err,
			logx.F("username", username),
			logx.F("client_ip", input.ClientIP),
		)
		return LoginOutput{}, err
	}
	if user.Status != userdomain.StatusActive {
		err := fmt.Errorf("%w: user is inactive", ErrInvalidInput)
		logx.Warn("auth", "login_denied",
			logx.F("username", username),
			logx.F("user_id", user.ID),
			logx.F("reason", err.Error()),
		)
		return LoginOutput{}, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		loginErr := fmt.Errorf("%w: username or password is incorrect", ErrInvalidInput)
		logx.Warn("auth", "login_denied",
			logx.F("username", username),
			logx.F("client_ip", input.ClientIP),
			logx.F("reason", loginErr.Error()),
		)
		return LoginOutput{}, loginErr
	}

	_ = uc.cleanupExpiredSessions(ctx)

	token, err := generateSecureToken(32)
	if err != nil {
		return LoginOutput{}, err
	}
	now := uc.now()
	session := userdomain.UserSession{
		ID:          generateID("ses"),
		UserID:      user.ID,
		AccessToken: token,
		ExpiredAt:   now.Add(uc.sessionTTL),
		ClientIP:    strings.TrimSpace(input.ClientIP),
		UserAgent:   strings.TrimSpace(input.UserAgent),
		CreatedAt:   now,
	}
	if err := uc.repo.CreateSession(ctx, session); err != nil {
		logx.Error("auth", "login_failed", err,
			logx.F("username", username),
			logx.F("user_id", user.ID),
		)
		return LoginOutput{}, err
	}
	logx.Info("auth", "login_success",
		logx.F("username", username),
		logx.F("user_id", user.ID),
		logx.F("session_id", session.ID),
		logx.F("expired_at", session.ExpiredAt),
	)
	return LoginOutput{
		AccessToken: token,
		ExpiredAt:   session.ExpiredAt,
		User:        user,
	}, nil
}

func (uc *AuthSessionManager) Logout(ctx context.Context, token string) error {
	token = strings.TrimSpace(token)
	if token == "" {
		logx.Warn("auth", "logout_skip", logx.F("reason", "empty_token"))
		return nil
	}
	if err := uc.repo.DeleteSessionByAccessToken(ctx, token); err != nil {
		logx.Error("auth", "logout_failed", err, logx.F("token_suffix", suffixToken(token)))
		return err
	}
	logx.Info("auth", "logout_success", logx.F("token_suffix", suffixToken(token)))
	return nil
}

func (uc *AuthSessionManager) ResolveUserByToken(ctx context.Context, token string) (userdomain.User, userdomain.UserSession, error) {
	token = strings.TrimSpace(token)
	if token == "" {
		err := ErrInvalidInput
		logx.Warn("auth", "resolve_token_failed",
			logx.F("reason", "empty_token"),
		)
		return userdomain.User{}, userdomain.UserSession{}, err
	}
	session, err := uc.repo.GetSessionByAccessToken(ctx, token)
	if err != nil {
		logx.Warn("auth", "resolve_token_failed",
			logx.F("token_suffix", suffixToken(token)),
			logx.F("reason", err.Error()),
		)
		return userdomain.User{}, userdomain.UserSession{}, err
	}
	now := uc.now()
	if !session.ExpiredAt.After(now) {
		_ = uc.repo.DeleteSessionByAccessToken(ctx, token)
		logx.Warn("auth", "resolve_token_failed",
			logx.F("token_suffix", suffixToken(token)),
			logx.F("session_id", session.ID),
			logx.F("reason", "session_expired"),
		)
		return userdomain.User{}, userdomain.UserSession{}, userdomain.ErrSessionNotFound
	}
	user, err := uc.repo.GetUserByID(ctx, session.UserID)
	if err != nil {
		logx.Error("auth", "resolve_token_failed", err,
			logx.F("token_suffix", suffixToken(token)),
			logx.F("session_id", session.ID),
			logx.F("user_id", session.UserID),
		)
		return userdomain.User{}, userdomain.UserSession{}, err
	}
	if user.Status != userdomain.StatusActive {
		err := fmt.Errorf("%w: user is inactive", ErrInvalidInput)
		logx.Warn("auth", "resolve_token_failed",
			logx.F("token_suffix", suffixToken(token)),
			logx.F("session_id", session.ID),
			logx.F("user_id", user.ID),
			logx.F("reason", err.Error()),
		)
		return userdomain.User{}, userdomain.UserSession{}, err
	}
	logx.Info("auth", "resolve_token_success",
		logx.F("token_suffix", suffixToken(token)),
		logx.F("session_id", session.ID),
		logx.F("user_id", user.ID),
	)
	return user, session, nil
}

func (uc *AuthSessionManager) ListEffectivePermissions(ctx context.Context, user userdomain.User) ([]userdomain.UserPermission, error) {
	if user.Role == userdomain.RoleAdmin {
		return []userdomain.UserPermission{
			{
				ID:             "virtual-admin-all",
				UserID:         user.ID,
				PermissionCode: "*",
				ScopeType:      "global",
				Enabled:        true,
				CreatedAt:      uc.now(),
				UpdatedAt:      uc.now(),
			},
		}, nil
	}
	return uc.repo.ListUserPermissions(ctx, user.ID)
}

func (uc *AuthSessionManager) HasPermission(
	ctx context.Context,
	user userdomain.User,
	permissionCode string,
	scopeType string,
	scopeValue string,
) (bool, error) {
	if user.Role == userdomain.RoleAdmin {
		return true, nil
	}
	code := strings.TrimSpace(permissionCode)
	if code == "" {
		return false, nil
	}
	code = strings.ToLower(code)
	perms, err := uc.repo.ListUserPermissions(ctx, user.ID)
	if err != nil {
		return false, err
	}
	scopeType = strings.TrimSpace(scopeType)
	scopeType = strings.ToLower(scopeType)
	scopeValue = strings.TrimSpace(scopeValue)
	// release.create/release.execute/release.cancel 在应用发布场景必须命中 application scoped 权限，
	// 全局授权不再作为这三个动作的兜底，避免绕过“按应用授权”。
	requireApplicationScope := isReleaseApplicationScopedPermission(code) && scopeType == "application" && scopeValue != ""
	for _, item := range perms {
		itemCode := strings.ToLower(strings.TrimSpace(item.PermissionCode))
		if !item.Enabled || itemCode != code {
			continue
		}
		itemScopeType := strings.ToLower(strings.TrimSpace(item.ScopeType))
		if requireApplicationScope {
			if itemScopeType == "application" && strings.TrimSpace(item.ScopeValue) == scopeValue {
				return true, nil
			}
			continue
		}
		switch itemScopeType {
		case "", "global":
			return true, nil
		default:
			if scopeType != "" && itemScopeType == scopeType && strings.TrimSpace(item.ScopeValue) == scopeValue {
				return true, nil
			}
		}
	}
	return false, nil
}

func isReleaseApplicationScopedPermission(code string) bool {
	switch strings.ToLower(strings.TrimSpace(code)) {
	case "release.create", "release.execute", "release.cancel":
		return true
	default:
		return false
	}
}

func (uc *AuthSessionManager) ResolveParamAccess(
	ctx context.Context,
	user userdomain.User,
	applicationID string,
	paramKey string,
) (canView bool, canEdit bool, err error) {
	if user.Role == userdomain.RoleAdmin {
		return true, true, nil
	}
	applicationID = strings.TrimSpace(applicationID)
	paramKey = strings.ToLower(strings.TrimSpace(paramKey))
	if paramKey == "" {
		return false, false, nil
	}
	items, err := uc.repo.ListUserParamPermissions(ctx, user.ID, applicationID)
	if err != nil {
		return false, false, err
	}
	var (
		globalMatch *userdomain.UserParamPermission
		appMatch    *userdomain.UserParamPermission
	)
	for index := range items {
		item := items[index]
		if item.ParamKey != paramKey {
			continue
		}
		if strings.TrimSpace(item.ApplicationID) == "" {
			globalMatch = &item
			continue
		}
		if strings.TrimSpace(item.ApplicationID) == applicationID {
			appMatch = &item
		}
	}
	target := appMatch
	if target == nil {
		target = globalMatch
	}
	if target == nil {
		return false, false, nil
	}
	return target.CanView, target.CanEdit, nil
}

func (uc *AuthSessionManager) cleanupExpiredSessions(ctx context.Context) error {
	_, err := uc.repo.DeleteExpiredSessions(ctx, uc.now())
	return err
}

func generateSecureToken(size int) (string, error) {
	if size <= 0 {
		size = 32
	}
	buffer := make([]byte, size)
	if _, err := rand.Read(buffer); err != nil {
		return "", err
	}
	return strings.ToLower(hex.EncodeToString(buffer)), nil
}

func suffixToken(value string) string {
	value = strings.TrimSpace(value)
	if len(value) <= 8 {
		return value
	}
	return value[len(value)-8:]
}
