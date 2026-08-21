# Changelog

All notable CampusNest project changes are documented here.

## [Unreleased]

### Added

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

- The Next.js frontend experience is not implemented yet.
- The Next.js data store is currently in memory and is not persistent across restarts.
- Authentication, lister management, admin verification, comparison, and blockchain APIs still need to be implemented in the unified Next.js backend.
- Recommendation explanations are currently deterministic text rather than Gemini-generated content.
- Blockchain is disabled by default; seeded transaction identifiers are local demo values.
- The backend currently has no automated test sources.
