# UniSphere
## Complete University Management & Student Success System

> One Platform. Every Step of the University Journey.

---

## Overview

UniSphere is a full-featured university management ecosystem built with React. It covers the complete student lifecycle — from programme discovery and application through registration, academic study, at-risk monitoring, and communication.

The system includes a **Student Early Warning Engine** that identifies learners who may be falling behind, and enables lecturers and student success officers to intervene with documented, trackable support.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Database Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Neon PostgreSQL**:
   Copy `.env.example` to `.env` (or open `.env`) and add your Neon database connection string:
   ```env
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-YOUR-ENDPOINT.neon.tech/neondb?sslmode=require
   PORT=5000
   ```

3. **Initialize & Seed the Database**:
   ```bash
   npm run db:seed
   ```
   *(This creates all tables and populates them with initial university data.)*

4. **Start Both Server & Client (Single Command)**:
   ```bash
   npm run dev:all
   ```
   *Alternatively, run `npm run server` and `npm run dev` in separate terminals.*

   * API runs at `http://localhost:5000` (with live WebSockets)
   * Web App runs at `http://localhost:5173` (Vite proxy forwards `/api` to port 5000)

---

## Demo Accounts

Log in instantly with any of these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | admin@unisphere.ac.za | Admin@123 |
| **Lecturer** | lecturer@unisphere.ac.za | Lecture@123 |
| **Student** | student@unisphere.ac.za | Student@123 |
| **Success Officer** | success@unisphere.ac.za | Success@123 |

Click the quick-login buttons on the login screen to sign in without typing.

---

## Key Features

### For Administrators
- **Dashboard** — Enrolment trends, module pass rates, application pipeline, at-risk overview
- **Applications** — Review, accept, reject or request documents for student applications
- **Students** — Full student roster with at-risk flags
- **Programmes** — Academic programme and module catalogue
- **Email System** — View delivery queue, templates, retry failed emails, compose test emails
- **Reports** — Charts, tables and programme analytics
- **Audit Log** — Immutable record of all system actions
- **Messages** — Internal communication to any role

### For Lecturers
- **Dashboard** — At-a-glance view of modules, enrolled students, at-risk flags
- **My Modules** — Module details, announcements, student counts
- **Grades & Marks** — Record assessment results, view grade book per module
- **Attendance** — Take a register, view per-student attendance stats
- **At-Risk Students** — Review flagged students, log interventions, message students
- **Messages** — Full two-way messaging with students and support officers

### For Students
- **Dashboard** — Risk alert banner, today's classes, upcoming assessments, module overview
- **My Modules** — Enrolled module details, attendance bars, announcements
- **Timetable** — Weekly visual schedule grid
- **Results** — Grade book with weighted marks, feedback from lecturers
- **Messages** — Direct messaging with lecturers and success officers
- **Notifications** — Academic alerts, grade postings, support messages

### For Student Success Officers
- **Dashboard** — Prioritised risk case summary
- **At-Risk Cases** — Expandable case view with triggers, intervention history, log new actions
- **Interventions** — Full log of all actions taken across all students
- **Students** — Student cards with risk status, direct message button
- **Messages** — Contact students, view all conversations

---

## Student Early Warning Engine

The at-risk system uses configurable rules to flag students:

| Trigger | Example Rule |
|---------|-------------|
| Low marks | Average below 50% pass threshold |
| Attendance | Below 75% of sessions |
| Missed work | 2+ assignments outstanding |
| Declining trend | Mark average falling across assessments |

**Important:** Risk flags are prompts for human review only. They do not automatically affect a student's academic standing, graduation eligibility, or any other record. All flags must be reviewed by authorised staff.

---

## Communication System

UniSphere includes a full in-app messaging system:

- Students can text their lecturer directly from their portal
- Lecturers can message students individually or reply to queries
- Success officers can contact any student
- All messages are threaded by conversation
- Real-time toast notifications on send
- Unread badges on sidebar navigation

### Email Queue (Admin → Email System)
- View all outbound email events (delivered, queued, failed)
- Retry failed deliveries
- Browse email templates
- Compose test emails

---

## Architecture

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router and layout composition
├── index.css             # Design system (CSS custom properties)
├── contexts/
│   ├── AuthContext.jsx   # Authentication state
│   └── DataContext.jsx   # Shared application data + actions
├── data/
│   └── seed.js           # All fictional demo data
├── components/
│   ├── Sidebar.jsx       # Role-aware navigation
│   ├── PageHeader.jsx    # Top bar with notifications bell
│   └── ToastStack.jsx    # Toast notification renderer
└── pages/
    ├── LoginPage.jsx
    ├── admin/            # 8 admin pages
    ├── lecturer/         # 6 lecturer pages
    ├── student/          # 6 student pages
    ├── success/          # 5 success officer pages
    └── shared/           # Shared notification page
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Build | Vite |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Pure CSS (custom properties, no framework) |
| State | React Context API |
| Backend | Node.js, Express.js REST API |
| Database | Neon PostgreSQL (Serverless via `@neondatabase/serverless`) |
| Real-Time | Socket.io (bidirectional WebSockets) |
| Security | JWT (`jsonwebtoken`), Bcrypt password hashing (`bcryptjs`) |
| File Uploads | Multer (applications document verification) |
| Email | Nodemailer (SMTP + Ethereal test inbox) |
| Containerization | Docker (Alpine multi-stage build) |

---

## Design System

The UI uses a UniSphere-specific design language:

- **Navy** (`#0f1f3d`) — Primary brand, sidebar, headings
- **Gold** (`#d4a843`) — Active states, accents, awards
- **Surface** (`#f7f8fc`) — Page backgrounds
- **Sora** — Display typeface (headings, numbers)
- **Inter** — Body typeface (UI, labels, paragraphs)

---

## Fictional Data

All data in this system is completely fictional:
- Student names, IDs, programmes
- Assessment grades and attendance records
- Application details
- Risk cases and interventions
- Email addresses and messages

No real student or institutional data is used anywhere.

---

## Extending the System

### Add a new user role
1. Add to `USERS` in `src/data/seed.js`
2. Add navigation config to `NAV_CONFIG` in `Sidebar.jsx`
3. Add route guard to `App.jsx`
4. Create portal pages under `src/pages/<role>/`

### Add a new module or programme
Edit `MODULES` or `PROGRAMMES` in `src/data/seed.js`

### Connect a real backend
Replace the Context providers with API calls:
- `AuthContext.jsx` — swap `login()` for a real auth endpoint
- `DataContext.jsx` — swap in-memory state with `fetch()` / React Query

---

## Recommended Next Steps

1. **Backend** — ASP.NET Core Web API or Node/Express REST API
2. **Database** — PostgreSQL or SQL Server with the entity groups from the SRS
3. **Authentication** — JWT tokens, session management, MFA
4. **Real email** — SMTP relay (Mailpit for dev, SendGrid or Postfix for prod)
5. **Real-time** — Replace in-memory notifications with WebSockets or SignalR
6. **Testing** — Playwright for E2E, Vitest for unit tests
7. **Deployment** — Docker Compose + GitHub Actions CI/CD

---

## Documentation Index

| Document | Location |
|----------|----------|
| This README | `README.md` |
| SRS (requirements) | See the project specification document |
| Risk Engine design | See `SuccessRiskCases.jsx` + `DataContext.jsx` |
| Email system | See `AdminEmailSystem.jsx` + `DataContext.jsx` |
| Data model | See `src/data/seed.js` entity structures |

---

*UniSphere — Built to demonstrate professional full-stack university management software. All data is fictional.*
