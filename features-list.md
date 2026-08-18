# Checkly — Feature List

> "Check in, check off."

A full-stack task management web application for small teams.

---

## 1. Foundation: Auth & Workspace

### 1.1 Authentication (BetterAuth — Email/Password Only)

- [x] **Sign up**: public self-registration (email + password)
- [x] **Sign in**: email + password with "remember me"
- [ ] **Password reset**: secure token via email _(transactional — required for auth; deferred — needs SMTP)_
- [x] **Session management**: database sessions via BetterAuth; `src/proxy.ts` protects routes (Next 16 has no middleware)
- [x] **No OAuth**

### 1.2 Single Workspace Model

- [x] **One workspace per deployment** — no switching, no additional workspace creation
- [x] Auto-provisioned on first signup or database-seeded
- [x] All users belong implicitly to this workspace
- [x] **Workspace settings**: name, description (Admin only)

### 1.3 Roles & Permissions

| Role      | Permissions                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| **Admin** | Full control: manage members (change roles, remove), edit settings, manage labels |
| **User**  | Create/edit tasks, view workspace                                                 |

- [ ] **Project-level restrictions** (optional): limit specific projects to certain members
- [x] **API route enforcement**: every mutation checks the session + `role`

### 1.4 User Onboarding _(Self-Signup + Admin-Created)_

- [x] Public self-registration (sign up page with name, email, password)
- [x] **Admin creates accounts** via admin form: name, email, temporary password, role
- [x] New user signs in with provided credentials
- [ ] **No invite flow or welcome emails** — credentials shared directly by the admin

---

## 2. Core Task Management

### 2.1 Tasks

- [x] **Create task**: title (required), description, due date & time, priority, assignee, labels, estimated effort, optional image
- [x] **Completion**: checkbox to mark done / not done
- [x] **Properties**:
  - [x] Assignee (single user from workspace member list)
  - [x] Priority: Low, Medium, High, Urgent
  - [x] Labels/tags (workspace-scoped, color-coded; owner/admin manage)
  - [x] Due date & time
  - [x] Estimated effort (hours)
- [ ] **Task duplication** and **templates**

### 2.2 Task Detail View

- [x] Side-panel drawer with full details and image
- [x] **Activity log**: tracks creation, updates, completion toggles

---

## 3. Organization & Views

### 3.1 Projects

- [ ] Tasks belong to a **Project**
- [ ] Project settings: name, description, default assignee, member access list, archived status

### 3.2 Views

- [ ] **List view**: spreadsheet-style, sortable columns, inline editing _(plain list with drawers for now)_
- [x] **My Tasks**: open tasks assigned to the current user, shown on profile

### 3.3 Filtering

- [ ] Filter by: assignee, completion state, priority, label, due date range, creator
- [x] **No full-text search** — filter by structured fields only
- [x] **No saved filters**

---

## 4. Team Collaboration

### 4.1 Assignment

- [x] Assign from workspace member dropdown
- [ ] Claim unassigned tasks
- [ ] Reassign with optional note

### 4.2 Activity

- [x] **Activity feed**: automatic log of creation, updates, completion toggles visible on each task

### 4.3 Notifications _(In-App Only)_

- [ ] **In-app notification center**: unread badge, mark read
- [ ] Notification triggers: assigned to a task, task due soon / overdue
- [x] **No email notifications**
- [x] **No per-user notification preferences** — all in-app notifications are on by default

---

## 5. Management & Reporting

### 5.1 Dashboard

- [x] **Metrics cards**: counts and overview for the workspace
- [ ] **Team workload**: task distribution per member
- [ ] **Recent activity** feed

### 5.2 Reports

- [ ] **Productivity**: tasks completed per member over time
- [ ] **Project health**: overdue rate, average time to completion
- [x] **No Velocity, Workload calendar, Time Tracking, or Exports**

---

## 6. User Experience

### 6.1 UI/UX

- [ ] **Command palette** (`Cmd+K`): search tasks, create task, switch view
- [ ] **Keyboard shortcuts**: `C` create, `D` done (toggle completion), `Esc` close, `/` focus search
- [x] **Optimistic UI**: `useOptimistic` with API calls for instant feedback on checkboxes
- [x] **Responsive**: sidebar collapses to sheet on mobile

### 6.2 Theming

- [x] **Light / dark toggle**
- [x] **No system mode**
- [x] **No workspace accent color**

---

## 7. Settings & Administration

### 7.1 User Settings

- [x] Profile: name, avatar, banner, bio, email, password change
- [x] **Inline editing**: double-click text to edit (name, email, bio); edit icon overlay on avatar/banner to change or remove images
- [x] **No notification preferences**
- [ ] Default landing view

### 7.2 Workspace Administration (Admin)

- [x] **Member management**: view all users, change roles, remove from workspace
- [x] **Label management**: create/delete workspace labels (color-coded)
- [ ] **Archiving**: soft-delete projects or tasks (recoverable)
- [ ] **Audit log**: role changes, removals, project deletions
- [x] **No custom statuses / workflow settings**

---

## Removed Features Summary

| Feature                                                | Reason                          |
| ------------------------------------------------------ | ------------------------------- |
| OAuth                                                  | Email/password only             |
| Multi-workspace                                        | Single workspace per deployment |
| Invite flow / magic links                              | Admin-created accounts only     |
| Subtasks                                               | Simplified task model           |
| Batch operations                                       | Not needed                      |
| Comments / @mentions                                   | Not needed                      |
| File attachments                                       | Not needed                      |
| Board view / Calendar view                             | List view only                  |
| Full-text search / Saved filters                       | Structured filtering only       |
| Email notifications / Per-user preferences             | In-app only, no preferences     |
| Velocity / Workload calendar / Time Tracking / Exports | Reporting scope reduced         |
| System mode / Workspace accent color                   | Light/dark toggle only          |
| Workflow statuses                                      | Simple done/not-done checkbox   |
