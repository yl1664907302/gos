# CLAUDE.md

GOS is an internal release governance platform. It is not a replacement for Jenkins, ArgoCD, or GitOps. The platform owns application governance, release templates, permissions, auditing, and UI workflows; external systems own execution.

## Working Rules

- Communicate in Chinese unless the user explicitly asks otherwise.
- Treat the browser screenshots and inline comments as the highest priority product feedback.
- Do not revert unrelated dirty worktree changes.
- Use `rg` / `rg --files` for search.
- Use `apply_patch` for manual file edits.
- For frontend UI changes, verify with targeted tests first, then `npx vue-tsc --noEmit`, and run `npm run build` when the change is not trivial.
- The frontend dev server disables HMR by default. After style or route changes, hard refresh the page if the browser view does not update.

## Project Structure

- Backend entry: `cmd/server/main.go`
- Backend domain/use cases: `internal/domain`, `internal/application`
- Backend HTTP handlers: `internal/interfaces/http`
- Backend infra: `internal/infrastructure`
- Frontend app: `frontend/src`
- Frontend routes: `frontend/src/router/index.ts`
- Layout/sidebar: `frontend/src/layouts/AppLayout.vue`
- Global frontend styles: `frontend/src/style.css`
- Frontend layout regression tests: `frontend/tests/*.mjs`
- UI specs: `docs/样式规范/前端ui组件规范文档-全局.md` and `docs/样式规范/组件UI规范/*`

## Common Commands

Backend:

```bash
go run ./cmd/server
go test ./...
```

Frontend:

```bash
cd frontend
npm run dev
npx vue-tsc --noEmit
npm run build
```

Targeted frontend tests are plain Node tests, for example:

```bash
node frontend/tests/system-notification-layout.test.mjs
node frontend/tests/global-table-radius.test.mjs
node frontend/tests/jenkins-management-layout.test.mjs
node frontend/tests/executor-param-layout.test.mjs
```

## Current UI Baseline

### Page Header And Query

- Page header is one row: title on the left, actions on the right.
- Search belongs in `page-header-actions`, not in a large card below the title.
- Use a magnifier trigger button for fuzzy search.
- Clicking the magnifier opens a transparent glass search overlay with live suggestions.
- Suggestions must come from backend fuzzy query. Do not fake-search only the current page.
- Query buttons, select boxes, and action buttons must share the same transparent glass visual language.
- Do not restore old `a-card + inline form + 查询/重置` filter blocks unless there is a specific business reason.
- Do not keep `重置` next to `查询` in standard header query areas. Use explicit `全部` options or context reset behavior.

### Tables

- All tables in GOS must use square corners now.
- This overrides older docs that mention `18px` table container radius.
- Global table radius reset lives in `frontend/src/style.css`.
- Page-scoped table styles must not reintroduce `border-radius: 18px` or `20px`.
- Ant table shells and cells should explicitly reset radius where a page has scoped table styles:

```css
.xxx-table :deep(.ant-table),
.xxx-table :deep(.ant-table-content),
.xxx-table :deep(.ant-table-body) {
  border-radius: 0 !important;
}

.xxx-table :deep(.ant-table-container),
.xxx-table :deep(.ant-table-thead > tr > th),
.xxx-table :deep(.ant-table-tbody > tr > td) {
  border-radius: 0 !important;
}
```

- Fixed operation columns must be opaque, not translucent.
- For pages that still intentionally use Ant tables, keep the dark slate table header, solid fixed operation column, and compact link buttons.

### Cards And Modules

- Avoid unnecessary nested cards.
- Do not add repeated module headers like `01 · xxx` when the page title already provides context.
- Avoid large permanent explanation notes. Prefer concise labels, empty states, or click-triggered tips.
- Resource cards should not use excessive animation, glow, or vertical decorative lines unless explicitly required.

### Modals And Forms

- Avoid default Ant modal footers for important business forms.
- Use custom title bars with right-aligned action buttons.
- Use transparent glass button shells for modal actions.
- Hide default close/footer where the design requires a custom modal shell.

## Current Feature/UI Progress

### ArgoCD

- `/components/argocd` is the ArgoCD management page.
- ArgoCD applications have been split to `/components/argocd/applications`.
- The management page should only include instances and environment binding.
- The application page should first select an ArgoCD instance, then select an application.
- With no ArgoCD instance selected, applications should not render default content.
- ArgoCD application data should not be displayed inside the main ArgoCD management page.

### GitOps

- `/components/gitops` follows the ArgoCD management visual direction.
- Detail/status content must switch based on the selected GitOps instance.
- Status panels should be compact and useful; avoid oversized colored pills and low-density grids.
- Repository status, path status, and workspace status should be presented as a coherent status block, not as scattered cards.
- Remove unnecessary animation and decorative styling from GitOps instance cards.

### Jenkins Management

- Jenkins group currently includes:
  - `/components/jenkins`
  - `/components/executor-params`
- Both pages must keep square table corners.
- Local scoped styles in these pages previously overrode the global rule; keep tests protecting this:
  - `frontend/tests/jenkins-management-layout.test.mjs`
  - `frontend/tests/executor-param-layout.test.mjs`
- Jenkins table action column must stay visible and opaque.

### Agent Scripts

- `/components/agent-scripts` keeps the original table for script management.
- Only the top header/query area should follow the current standard.
- Do not add extra nested module wrappers or duplicate section headers above the script table.

### Agent Tasks

- `/components/agent-tasks` uses a global right-top search that searches both resident and temporary tasks.
- Search suggestions must include resident tasks; do not only query temporary tasks.
- Temporary task status tags should be removed because temporary tasks are selected by release templates rather than representing standalone publish state.
- The create/edit task form should follow the same modal/form standard as other management pages.

### Release Templates And Task Selection

- Release templates must not allow selecting historical task executions.
- When selecting Agent tasks in a release template, only show valid current task definitions/configurations.
- Temporary task selection is a binding configuration, not a history picker.

### Permissions

- `/system/permissions` should not use a heavy outer card.
- Permission content should be visually unified instead of multiple inconsistent cards.
- Remove redundant Chinese subtitles from permission blocks.
- User dropdown/action controls should follow the same header glass control style.

### Notifications

- `/system/notifications` uses the standard top header query/action alignment.
- Buttons and inputs must align with the page title baseline.
- Magnifier search overlay must use transparent glass styling.
- The three notification tables must be proper square tables with no rounded table shell or clipped rounded remnants.

## Product Notes

### Mini Program Release

Mini program release should be modeled as its own executor type, not as a Jenkins temporary task.

Recommended flow:

1. Upload experience version.
2. Internal confirmation/test of experience version.
3. Submit WeChat review.
4. Publish formal version only after review passes.

Do not treat "confirm experience version" as formal release. Formal release must bind to a review-passed WeChat version.

## When Adding New UI Work

1. Read the relevant spec under `docs/样式规范/组件UI规范/`.
2. Check current implemented baseline pages before copying old docs.
3. Add or update a `frontend/tests/*.mjs` regression test for the visual/behavior rule.
4. Implement the smallest scoped change.
5. Run targeted test, `npx vue-tsc --noEmit`, and build if practical.
6. If browser state looks stale, hard refresh because default dev command disables HMR.
