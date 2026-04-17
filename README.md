# Restaurant App

React + TypeScript + NestJS + Postgres + Tailwind CSS.

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## Setup

### Backend

```bash
cd Backend
cp env.example .env        # fill in real values
npm install
npm run start:dev          # runs on :3001
```

### Frontend

```bash
cd Frontend
npm install
npm run dev                # runs on :5173, proxies /api to :3001
```

## Environment Variables (Backend)

| Variable             | Description                        |
|---------------------|------------------------------------|
| `DB_HOST`           | Postgres host                      |
| `DB_PORT`           | Postgres port (5432)               |
| `DB_USERNAME`       | Postgres username                  |
| `DB_PASSWORD`       | Postgres password                  |
| `DB_NAME`           | Database name                      |
| `JWT_SECRET`        | Access token signing secret        |
| `JWT_REFRESH_SECRET`| Refresh token signing secret       |
| `PORT`              | Backend port (default 3001)        |
| `FRONTEND_URL`      | CORS origin (default localhost:5173)|

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/menu/categories | Public | All categories + items |
| POST | /api/menu/categories | Admin | Add category |
| POST | /api/menu/items | Admin | Add menu item |
| GET | /api/reservations | Staff/Admin | All reservations |
| POST | /api/reservations | Public | Create reservation |
| GET | /api/reservations/my | Auth | My reservations |
| PATCH | /api/reservations/:id/status | Staff/Admin | Update status |
| GET | /api/dashboard/stats | Staff/Admin | Dashboard stats |
| GET | /api/users | Admin | All users |
