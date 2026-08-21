# Changelog

All notable CampusNest project changes are documented here.

## [Unreleased]

### Added

<<<<<<< HEAD
- Separated architecture: Spring Boot REST backend (`backend/`) + Next.js 16 frontend (`web/`).
- Added Next.js 16 App Router, TypeScript, Tailwind CSS, ESLint, and Turbopack setup.
- Added typed CampusNest domain module with property, student preference, verification, and availability types.
- Added seeded marketplace properties for the initial discovery flow.
- Added effective monthly cost calculation using rent, food, electricity, Wi-Fi, and maintenance costs.
- Added availability calculation and status labels for available, filling fast, almost full, and full properties.
- Added backend-driven recommendation scoring and rule-based explanations (`RecommendationService`).
- Added filtered, ranked property discovery with verified and available listings only.
- Added App Router API endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/students/me`
  - `PUT /api/students/me`
  - `GET /api/recommendations`
  - `GET /api/properties`
  - `GET /api/properties/{id}`
  - `POST /api/properties/compare`
  - `GET /api/listings/mine`
  - `POST /api/listings`
  - `PUT /api/listings/{id}`
  - `PUT /api/listings/{id}/availability`
  - `POST /api/listings/{id}/verify`
  - `GET /api/admin/verifications/pending`
  - `POST /api/admin/verifications/{id}/approve`
  - `POST /api/admin/verifications/{id}/reject`
  - `GET /api/verification/{id}`
- Added frontend registration page (`/register`) with student/lister role selection.
- Added student profile editing (`/student/profile`) with pre-filled form and backend update.
- Added lister property editing (`/lister/[id]/edit`) with full form and ownership enforcement.
- Added student search/filter page (`/student/search`) connected to backend query parameters.
- Added frontend route guards (`RouteGuard`) protecting `/student`, `/lister`, `/admin` with auth + role checks.
- Added logout behavior that clears JWT and redirects to home.

### Changed

- Removed hardcoded admin demo credentials (`admin@campusnest.demo / admin123`) from frontend bundle.
- Removed hardcoded JWT secret fallback from `application.yml`; `JWT_SECRET` must be provided via environment variable.
- Updated misleading "AI" labels to "Smart" across landing page, metadata, property cards, and nav.
- Frontend availability badges now respect backend `availabilityStatus` field first, with local ratio fallback.
- Removed duplicate frontend scoring logic (`calculateMatchScore`); frontend now consumes backend `matchScore` and `aiExplanation` only.
- Removed unused `generateMockTxHash()` utility from frontend.
- Blockchain verification modal now distinguishes demo records from real on-chain records; hides explorer links for mock transaction hashes.
- Property card verification badge changed from "Verified on Blockchain" to "Verified Property".

### Validation

- Confirmed `npm run build` passes for Next.js frontend.
- Confirmed `npx tsc --noEmit` passes.
- Confirmed `./mvnw clean test` passes (12/12 backend tests).
- Confirmed `./mvnw clean package` succeeds.
- End-to-end runtime verification completed for 14 user flows (registration, login, profile edit, search, property CRUD, availability sync, comparison, route guards, admin verification, logout).
=======
- Added a Next.js 16 frontend with Student, Lister, and Admin portals.
- Added student discovery, profile, property detail, and property comparison screens.
- Added lister dashboard and listing creation screens with occupancy controls.
- Added admin verification queue and approval/rejection screens.
- Added shared portal navigation, property cards, detail modals, role switching, and responsive Tailwind styling.
- Added Framer Motion and Lucide React dependencies for frontend interaction and icons.

- Recorded the earlier Option A prototype work for project history:
  - Added a typed CampusNest domain module with property, student preference, verification, and availability types.
  - Added seeded marketplace properties for the initial discovery flow.
  - Added effective monthly cost calculation using rent, food, electricity, Wi-Fi, and maintenance costs.
  - Added availability calculation and status labels for available, filling fast, almost full, and full properties.
  - Added deterministic five-factor recommendation scoring:
    - Budget compatibility: 30%
    - Distance and commute: 25%
    - Verification trust: 20%
    - Facilities: 15%
    - Lifestyle compatibility: 10%
  - Added filtered, ranked property discovery with verified and available listings only.
  - Added the prototype App Router API endpoints: `GET /api/health`, `GET /api/properties`, and `GET /api/properties/{id}`.

### Validation

- Added six Spring Boot unit tests covering availability thresholds, effective cost, recommendation scoring, and explanation bands.
- Added three H2-backed MockMvc security integration tests covering public auth, protected student routes, admin registration rejection, and public verification lookup.
- Configured unauthenticated API requests to return `401 Unauthorized`, preserving `403 Forbidden` for authenticated role violations.
- Confirmed the Spring Boot test suite passes with the H2 profile.
- Confirmed the earlier Next.js prototype passed `npm run lint` and `npm run build`.
- Smoke-tested the earlier prototype health and filtered property endpoints locally.
>>>>>>> origin/main

## Initial Backend Foundation

### Added

- Created the Spring Boot REST backend for the CampusNest MVP.
- Added role-based users for students, listers, and admins.
- Added BCrypt password hashing and stateless JWT authentication.
- Added Spring Security authorization rules for student, lister, admin, and public verification routes.
- Added student profile and accommodation preference management.
- Added lister property creation, editing, ownership checks, and listing dashboards.
- Added occupancy updates with calculated available bed counts and vacancy status.
- Added student property search, recommendations, property details, and two-to-three-property comparison.
- Added deterministic recommendation scoring and rule-based explanations.
- Added effective monthly cost calculation.
- Added admin verification review, approval, and rejection workflows.
- Added SHA-256 verification record hashing.
- Added optional Web3j blockchain registration support for Polygon Amoy.
- Added local mock blockchain transactions when blockchain integration is disabled.
- Added PostgreSQL configuration with Docker Compose support.
- Added H2 profile support for lightweight local execution.
- Added Flyway database migration for users, profiles, properties, reviews, and verification records.
- Added demo seeding for admin, lister, three golden student profiles, 15 Greater Noida/Noida properties, reviews, and verification records.
- Added the live occupancy demo property, Shree Balaji Boys PG, seeded at 18 of 20 beds occupied.
- Added global JSON exception handling and request validation.

### Known Limitations

- The Next.js frontend currently uses local demo data and scoring instead of the Spring Boot API.
- Frontend authentication and role enforcement are not yet connected to backend JWT authentication.
- Frontend lister management, admin verification, comparison, and occupancy actions still need API integration.
- Persistence-backed and endpoint-level domain tests beyond the current security coverage are still pending.
- Recommendation explanations are currently deterministic text rather than Gemini-generated content.
- Blockchain is disabled by default; seeded transaction identifiers are local demo values.
