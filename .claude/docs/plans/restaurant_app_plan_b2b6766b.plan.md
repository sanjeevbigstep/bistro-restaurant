---
name: Restaurant App Plan
overview: Build a single-restaurant web app (React + TypeScript + NestJS + Postgres + Tailwind) covering auth/roles, menu management, table reservations, and an admin dashboard — following the monolithic structure in CLAUDE.md.
todos:
  - id: security-immediate
    content: Rotate the GitHub PAT hardcoded in Frontend/.mcp.json and Backend/.mcp.json before writing any code
    status: pending
  - id: phase1-scaffold
    content: "Phase 1: Scaffold Frontend (Vite + React + TS + Tailwind) and Backend (NestJS + TS), set up .env/.env.example, wire TypeORM to Postgres/Supabase"
    status: pending
  - id: phase2-auth
    content: "Phase 2: Build Auth module — JWT strategy, bcrypt, roles enum, NestJS guards, React auth context, Login/Register pages"
    status: pending
  - id: phase3-menu
    content: "Phase 3: Build Menu module — category/item CRUD on backend, public MenuList page and admin menu management page on frontend"
    status: pending
  - id: phase4-reservations
    content: "Phase 4: Build Reservations module — availability logic on backend, ReservationForm for customers and ReservationList for staff/admin"
    status: pending
  - id: phase5-dashboard
    content: "Phase 5: Build Admin Dashboard — aggregated stat endpoints on backend, summary cards and data tables on frontend"
    status: pending
  - id: phase6-hardening
    content: "Phase 6: Security hardening — Helmet, CORS, throttler, Supabase RLS, audit all guards, responsive UI polish"
    status: pending
isProject: false
---

# Restaurant App — Product Execution Plan

## Stack & Constraints (from CLAUDE.md)
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Database:** Postgres (via Supabase, already scaffolded)
- **Architecture:** Monolithic — single repo with `Frontend/` and `Backend/` directories
- No `console.log` in production code; no `.env` files committed
- **Security note:** Rotate the GitHub PAT currently hardcoded in `.mcp.json` before any further work

---

## Project Structure

### Frontend (`Frontend/src/`)
```
src/
  components/       ← shared UI (Button, Input, Modal, Navbar, etc.)
  pages/            ← route-level pages
    auth/           ← Login, Register
    menu/           ← MenuList, MenuItemDetail
    reservations/   ← ReservationForm, ReservationList
    dashboard/      ← AdminDashboard, Analytics
  utils/helper.ts   ← common functions (date formatting, API calls, etc.)
  constants.ts      ← API base URL, roles enum, route paths
```

### Backend (`Backend/src/`)
```
src/
  auth/             ← JWT strategy, guards, decorators
  users/            ← user entity, roles (ADMIN, STAFF, CUSTOMER)
  menu/             ← categories, items, pricing CRUD
  reservations/     ← booking logic, availability check
  dashboard/        ← aggregated stats endpoints
  common/           ← interceptors, filters, pipes, DTOs
  app.module.ts
  main.ts
```

---

## Database Schema (Postgres)

- **users** — `id, email, password_hash, role (enum), created_at`
- **menu_categories** — `id, name, display_order`
- **menu_items** — `id, category_id (FK), name, description, price, image_url, is_available`
- **reservations** — `id, user_id (FK), party_size, date, time_slot, status (enum), notes, created_at`
- **tables** — `id, capacity, label`

---

## Feature Breakdown

### 1. Authentication & Roles
- JWT-based auth (access token + refresh token)
- Roles: `ADMIN`, `STAFF`, `CUSTOMER`
- NestJS Guards on all protected routes
- Frontend: protected routes via React Router + auth context
- Passwords hashed with `bcrypt`

### 2. Menu Management
- Public-facing menu page (read-only for customers)
- Admin-only CRUD: add/edit/delete categories and items, toggle availability
- Image upload handled via Supabase Storage URL (stored as string in DB)

### 3. Table Reservations
- Customers submit reservation requests (date, time slot, party size)
- Availability check against existing confirmed reservations and table capacity
- Staff/Admin can confirm, cancel, or reschedule reservations
- Reservation statuses: `PENDING`, `CONFIRMED`, `CANCELLED`

### 4. Admin Dashboard
- Summary cards: total reservations today, upcoming reservations count, menu item count
- Reservation list with filter by date/status
- Menu management entry point
- User list (admin only)

---

## Security Checklist
- All secrets in `.env` (never committed); use `.env.example` as template
- JWT secrets stored as env vars (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
- Role-based access enforced server-side via NestJS `@Roles()` guard
- Input validation via `class-validator` DTOs on all endpoints
- Helmet + CORS configured in `main.ts`
- Rate limiting on auth endpoints (`@nestjs/throttler`)
- Supabase RLS (Row Level Security) enabled as a secondary defense layer
- Rotate the existing GitHub PAT in `.mcp.json` immediately

---

## Implementation Phases

### Phase 1 — Scaffold & Infrastructure
- Initialize React (Vite) app in `Frontend/` with TypeScript + Tailwind
- Initialize NestJS app in `Backend/` with TypeScript
- Wire Postgres connection via TypeORM + Supabase
- Set up `.env` / `.env.example` for both

### Phase 2 — Auth Module
- Backend: `UsersModule`, `AuthModule`, JWT strategy, refresh tokens
- Frontend: Login/Register pages, auth context, protected route wrapper

### Phase 3 — Menu Module
- Backend: `MenuCategoriesModule`, `MenuItemsModule` with CRUD endpoints
- Frontend: Public `MenuList` page + Admin menu management page

### Phase 4 — Reservations Module
- Backend: `ReservationsModule` with availability logic
- Frontend: `ReservationForm` for customers + `ReservationList` for staff/admin

### Phase 5 — Admin Dashboard
- Backend: `DashboardModule` with aggregated stat endpoints
- Frontend: `AdminDashboard` page with summary cards + data tables

### Phase 6 — Polish & Security Hardening
- Add Helmet, CORS, throttler to NestJS `main.ts`
- Enable Supabase RLS policies
- Audit all `@Roles` guards
- Tailwind UI polish, responsive layout
