# SprintFlow

> A modern, full-stack project management platform built for high-performing engineering teams.

![Stack](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLAlchemy-009688?style=flat-square&logo=fastapi)
![Stack](https://img.shields.io/badge/Styling-TailwindCSS%20v4-38bdf8?style=flat-square&logo=tailwindcss)
![Stack](https://img.shields.io/badge/State-Redux%20Toolkit-764abc?style=flat-square&logo=redux)

---

## What Has Been Built

### Frontend — React 19 + Vite

#### Pages

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/dashboard` | Overview with stat cards, task completion chart, priority distribution, recent activity, active projects, team members, and quick actions |
| **Board** | `/board` | Kanban board with drag-and-drop columns (To Do, In Progress, Review, Done) and task detail drawer |
| **Tasks** | `/tasks` | Full task list with filtering, sorting, and slide-in task detail drawer |
| **Projects** | `/projects` | Project cards grid with status, priority, progress bars, tags, and member avatars |
| **Project Detail** | `/projects/:id` | Per-project view with task breakdown by status, team members, and timeline |
| **Workspaces** | `/workspaces` | Workspace management — create, view, and switch workspaces |
| **Notifications** | `/notifications` | Notification list with read/unread state |
| **Reports** | `/reports` | Analytics and reporting views |
| **Settings** | `/settings` | Application and user preferences including dark mode |
| **Profile** | `/profile` | User profile information |
| **Login / Register** | `/login`, `/register` | Auth pages with animated gradient branding panel |
| **404 Not Found** | `*` | Custom not-found page |

#### Layout System

- **AppLayout** — Main authenticated shell with fixed sidebar, responsive navbar, and a scrollable main region
- **AuthLayout** — Split-panel auth layout with animated gradient branding panel (left) and form area (right)
- **Sidebar** — Collapsible fixed left sidebar (256px expanded / 70px collapsed) with smooth spring animation, section-grouped navigation, active route indicator, unread notification badge, user footer, and collapse toggle button
- **Navbar** — Fixed top bar that tracks sidebar width; contains search, create button, theme toggle (with View Transitions API ripple effect), notification dropdown, and profile dropdown

#### Component Library

| Component | Notes |
|---|---|
| Avatar | Initials-based avatar with colour support, sizes (sm/md/lg), and online badge |
| Badge | Status/label badge with colour variants |
| Button | Primary, secondary, danger variants; sm/md/lg sizes; icon support; loading state |
| Drawer | Slide-in panel (left or right) via React Portal; sidebar-aware overlay that never covers the sidebar; spring animation; ESC key to close |
| Dropdown | Click-triggered dropdown with outside-click dismiss, left/right/center alignment, and animated menu |
| EmptyState | Reusable empty state with icon, title, description, and optional CTA |
| Input | Controlled text input with label, error, and icon support |
| Loader | Animated loading spinner |
| Modal | Centred modal dialog via React Portal with backdrop blur |
| PageTransition | Wraps page content with fade + slide enter/exit animation |
| SearchBar | Search input with debouncing |
| Tabs | Horizontal tab bar with animated active indicator |
| Toast | Toast notification system with success, error, warning, and info variants |
| Tooltip | Hover tooltip with placement support (top, right, bottom, left) |

#### State Management — Redux Toolkit

| Slice | Manages |
|---|---|
| authSlice | JWT authentication, current user, login/logout async thunks |
| projectSlice | Project list, CRUD operations via async thunks |
| taskSlice | Task list, drawer open/close state, selected task, CRUD + status update |
| workspaceSlice | Workspace list and selection |
| notificationSlice | Notification list and unread count |
| uiSlice | Sidebar collapsed state, mobile sidebar toggle, theme (light/dark) |

#### Frontend Services

- `api.js` — Axios instance with base URL and auth token interceptor
- `auth.service.js` — Login, register, token refresh
- `project.service.js` — Project CRUD
- `task.service.js` — Task CRUD, status updates, assignment
- `workspace.service.js` — Workspace CRUD
- `notification.service.js` — Fetch and mark notifications as read
- `user.service.js` — User listing
- `report.service.js` — Dashboard stats and chart data

#### Design System

- TailwindCSS v4 with custom design token system
- Custom CSS utility classes: card, btn, sidebar-link, stat-card-*, progress-bar, progress-fill, gradient-primary, text-gradient, chart-area
- Dark mode support via .dark class on html element
- Theme transition using the View Transitions API — circular ripple reveal from click point when toggling light/dark mode

---

### Backend — FastAPI + SQLAlchemy

#### Tech Stack

| Library | Role |
|---|---|
| fastapi | Web framework and OpenAPI docs |
| uvicorn | ASGI server |
| sqlalchemy | ORM and database abstraction |
| pydantic / pydantic-settings | Request/response validation and env config |
| python-jose[cryptography] | JWT token generation and verification |
| passlib[bcrypt] | Password hashing |
| python-multipart | File upload support |
| python-dotenv | .env loading |

#### Database Models

| Model | Key Fields |
|---|---|
| User | id, name, email, hashed_password, role, color, avatar |
| Workspace | id, name, description, owner_id, members |
| Project | id, name, description, status, priority, color, icon, tags, progress, startDate, dueDate, workspace_id |
| Task | id, title, description, status, priority, assignee_id, project_id, due_date, labels |
| Board | id, name, project_id |
| Column | id, name, board_id, order |
| Comment | id, content, author_id, task_id, created_at |
| Notification | id, title, description, type, is_read, user_id, created_at |
| Activity | id, action, target, from_status, to_status, user_id, created_at |
| Attachment | id, filename, url, task_id, uploaded_by |

#### REST API Endpoints

| Router | Prefix | Key Endpoints |
|---|---|---|
| auth | /api/v1/auth | POST /register, POST /login, GET /me |
| users | /api/v1/users | GET / (list all users) |
| workspaces | /api/v1/workspaces | Full CRUD, member management |
| projects | /api/v1/projects | Full CRUD, member assignment |
| tasks | /api/v1/tasks | Full CRUD, status update, assignment, filtering |
| comments | /api/v1/comments | Create and list comments per task |
| notifications | /api/v1/notifications | List, mark as read |
| attachments | /api/v1/attachments | Upload and serve file attachments |
| reports | /api/v1/reports | Dashboard stats, chart data |

#### Backend Architecture

- Layered architecture: api -> services -> repositories -> models
- Core: JWT authentication middleware, CORS configuration, dependency injection via deps.py
- Database: SQLite (dev) via SQLAlchemy, Alembic for migrations
- Seed data (seed.py): Pre-populates users, workspaces, projects, tasks, notifications, and activities for development

---

## Project Structure

```
SprintFlow/
├── backend/
│   ├── app/
│   │   ├── api/v1/             # REST API route handlers
│   │   ├── core/               # Security, config, JWT
│   │   ├── middleware/         # CORS, auth middleware
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── repositories/       # Data access layer
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # Helpers
│   │   ├── main.py             # FastAPI app entry point
│   │   └── seed.py             # Dev seed data
│   ├── alembic/                # DB migrations
│   └── requirements.txt
│
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI component library
│   │   ├── layout/             # AppLayout, AuthLayout, Sidebar, Navbar
│   │   ├── board/              # Kanban board components
│   │   ├── task/               # Task components
│   │   ├── project/            # Project components
│   │   ├── notification/       # Notification components
│   │   └── charts/             # Chart components
│   ├── pages/                  # Page-level route components
│   ├── redux/                  # Redux Toolkit slices and store
│   ├── services/               # API service layer (Axios)
│   ├── hooks/                  # Custom React hooks
│   ├── routes/                 # React Router route definitions
│   ├── styles/                 # Global CSS and design tokens
│   ├── constants/              # App-wide constants
│   └── utils/                  # Utility functions
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html
```

---

## Getting Started

### Frontend

```bash
npm install
npm run dev
# http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1

# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Seed the Database

```bash
cd backend
python app/seed.py
```

---

## Environment Variables

### Frontend (`src/.env`)

```
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```
DATABASE_URL=sqlite:///./sprintflow.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

---

## UI Fixes & Improvements Log

| Fix | Files Changed |
|---|---|
| Drawer overlay was covering the sidebar — overlay now offsets by sidebar width (70px collapsed / 256px expanded), reading state from Redux | Drawer.jsx |
| Sidebar collapse toggle arrow was invisible — removed overflow-hidden from aside element that was clipping the button positioned at -right-3 | Sidebar.jsx |
| Notification bell misaligned in navbar — Dropdown trigger wrapper changed from plain div to flex items-center so it centres correctly in the flex row | Dropdown.jsx |
| Dashboard container had no breathing room — padding increased from p-6 to p-8 pb-10, max-width tightened from 1400px to 1280px, stat card gap increased from 12px to 16px | Dashboard.jsx |
