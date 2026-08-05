# Checkly — Feature List

> "Check in, check off."

A full-stack task management web application for small teams.

---

## 1. Foundation: Auth & Workspace

### 1.1 Authentication (BetterAuth — Email/Password Only)
- **Sign up**: disabled for general public
- **Sign in**: email + password
- **Password reset**: secure token via email *(transactional — required for auth)*
- **Session management**: JWT or database sessions via BetterAuth; middleware protects routes
- **No OAuth**

### 1.2 Single Workspace Model
- **One workspace per deployment** — no switching, no additional workspace creation
- Auto-provisioned on first signup or database-seeded
- All users belong implicitly to this workspace
- **Workspace settings**: name, description (Owner/Admin only)

### 1.3 Roles & Permissions

| Role | Permissions |
|---|---|
| **Owner** | Full control, manage members, delete workspace data |
| **Admin** | Manage members (change roles, remove), edit settings, create projects |
| **Member** | Create/edit tasks, view reports |
| **Viewer** | Read-only across all projects and tasks |

- **Project-level restrictions** (optional): limit specific projects to certain members
- **Server Action enforcement**: every mutation checks `userId` + `role`

### 1.4 User Onboarding *(Admin-Created Only)*
- **Owner/Admin creates accounts** via a form: name, email, temporary password, role
- New user signs in with provided credentials
- **No self-registration**
- **No invite flow or welcome emails** — credentials shared directly by the admin

---

## 2. Core Task Management

### 2.1 Tasks
- **Create task**: title (required), description (rich text or markdown), due date, priority
- **Completion**: simple checkbox to mark done / not done *(no multi-step statuses, no workflows)*
- **Properties**:
  - Assignee (single user from workspace member list)
  - Priority: Low, Medium, High, Urgent
  - Labels/tags (workspace-scoped, color-coded)
  - Due date & time
  - Estimated effort (hours or story points)
- **Task duplication** and **templates**

### 2.2 Task Detail View
- Full-page or side-panel drawer
- **Activity log**: tracks completion toggles, reassignments, due date edits, description changes

---

## 3. Organization & Views

### 3.1 Projects
- Tasks belong to a **Project**
- Project settings: name, description, default assignee, member access list, archived status

### 3.2 Views
- **List view**: spreadsheet-style, sortable columns, inline editing
- **My Tasks**: cross-project view filtered to the current user

### 3.3 Filtering
- Filter by: assignee, completion state, priority, label, due date range, creator
- **No full-text search** — filter by structured fields only
- **No saved filters**

---

## 4. Team Collaboration

### 4.1 Assignment
- Assign from workspace member dropdown
- Claim unassigned tasks
- Reassign with optional note

### 4.2 Activity
- **Activity feed**: automatic log of completion toggles, reassignments, due date changes visible on each task

### 4.3 Notifications *(In-App Only)*
- **In-app notification center**: unread badge, mark read
- Notification triggers:
  - Assigned to a task
  - Task due soon / overdue
- **No email notifications**
- **No per-user notification preferences** — all in-app notifications are on by default

---

## 5. Management & Reporting

### 5.1 Dashboard
- **Metrics cards**: completed this week, overdue count, pending vs. completed
- **Team workload**: task distribution per member
- **Recent activity** feed

### 5.2 Reports
- **Productivity**: tasks completed per member over time
- **Project health**: overdue rate, average time to completion
- **No Velocity, Workload calendar, Time Tracking, or Exports**

---

## 6. User Experience

### 6.1 UI/UX
- **Command palette** (`Cmd+K`): search tasks, create task, switch view
- **Keyboard shortcuts**: `C` create, `D` done (toggle completion), `Esc` close, `/` focus search
- **Optimistic UI**: `useOptimistic` with Server Actions for instant feedback on checkboxes
- **Responsive**: tablet-friendly web layout

### 6.2 Theming
- **Light / dark toggle** only
- **No system mode**
- **No workspace accent color**

---

## 7. Settings & Administration

### 7.1 User Settings
- Profile: name, avatar, email, password change
- **No notification preferences**
- Default landing view

### 7.2 Workspace Administration (Owner/Admin)
- **Member management**: view all users, change roles, remove from workspace
- **Label management**: create/edit/delete workspace labels
- **Archiving**: soft-delete projects or tasks (recoverable)
- **Audit log**: role changes, removals, project deletions
- **No custom statuses / workflow settings**

---

## Removed Features Summary

| Feature | Reason |
|---|---|
| OAuth | Email/password only |
| Multi-workspace | Single workspace per deployment |
| Invite flow / magic links | Admin-created accounts only |
| Subtasks | Simplified task model |
| Batch operations | Not needed |
| Comments / @mentions | Not needed |
| File attachments | Not needed |
| Board view / Calendar view | List view only |
| Full-text search / Saved filters | Structured filtering only |
| Email notifications / Per-user preferences | In-app only, no preferences |
| Velocity / Workload calendar / Time Tracking / Exports | Reporting scope reduced |
| System mode / Workspace accent color | Light/dark toggle only |
| Workflow statuses | Simple done/not-done checkbox |
