# CampusNest Frontend

React + Vite / Next.js frontend for the CampusNest MVP — AI-powered student housing with verified listings, live availability, and blockchain-backed trust.

## Quick Start

```bash
cd web
npm install          # or npm ci
npm run dev          # → http://localhost:3000
```

The frontend proxies all API calls to `http://localhost:8080/api` (configurable via `NEXT_PUBLIC_API_URL`).

## Demo Credentials

One-click login on the landing page, or log in manually:

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Student | <aarav@campusnest.demo>  | student123 |
| Lister  | <lister@campusnest.demo> | lister123  |
| Admin   | <admin@campusnest.demo>  | admin123   |

## App Flows

1. **Login** — `/` landing page with one-click role demo or manual email login. JWT is stored in `localStorage`.
2. **Student Dashboard** — `/student` — AI-powered recommendations with match scores, availability badges, and explanations.
3. **Property Discovery** — `/student` — filtered list of verified properties with match scoring.
4. **Property Details** — `/student/property/[id]` — full cost breakdown, availability, facilities, reviews, and blockchain verification record.
5. **Match Score / Explanation** — shown on every property card and detail page. Uses `property.matchScore` and `property.aiExplanation` from the backend (falls back to frontend scoring via `lib/scoring.ts`).
6. **Compare** — `/student/compare` — side-by-side table of up to 3 properties using the backend `/properties/compare` endpoint.
7. **Lister Dashboard** — `/lister` — manage listings, update live occupancy, and submit for verification.
8. **Admin Dashboard** — `/admin` — review pending verifications, approve (creates blockchain record), or reject.

## API Contract

All endpoints are relative to `http://localhost:8080/api`:

| Method | Endpoint                             | Description                          |
|--------|--------------------------------------|--------------------------------------|
| POST   | `/auth/login`                        | Returns JWT + user info              |
| GET    | `/students/me`                       | Current student profile              |
| GET    | `/recommendations`                   | AI-scored property recommendations   |
| GET    | `/properties`                        | Search verified available properties |
| GET    | `/properties/{id}`                   | Property detail with reviews & verification |
| POST   | `/properties/compare`                | Compare up to 3 properties           |
| GET    | `/listings/mine`                     | Lister's own listings                |
| POST   | `/listings`                          | Create a new listing                 |
| PUT    | `/listings/{id}`                     | Update a listing                     |
| PUT    | `/listings/{id}/availability`        | Update occupancy                     |
| POST   | `/listings/{id}/verify`              | Submit for admin verification        |
| GET    | `/admin/verifications/pending`       | Pending verification queue           |
| POST   | `/admin/verifications/{id}/review`   | Mark as under review                 |
| POST   | `/admin/verifications/{id}/approve` | Approve + create blockchain record   |
| POST   | `/admin/verifications/{id}/reject`   | Reject with reason                   |

Full interactive API docs: <http://localhost:8080/api/swagger-ui.html>

## Build

```bash
npm run build    # production build
npm run lint     # ESLint
```
