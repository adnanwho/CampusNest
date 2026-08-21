# Changelog

All notable CampusNest project changes are documented here.

## [Unreleased]

### Changed

- Reverted the temporary Option A unified Next.js backend prototype.
- Selected Option B: retain the Spring Boot REST backend and add a separate Next.js frontend when frontend implementation resumes.

### Added

- Started the Option A unified Next.js application in `web/`.
- Added Next.js 15 App Router, TypeScript, Tailwind CSS, ESLint, and Turbopack setup.
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
- Added App Router API endpoints:
  - `GET /api/health`
  - `GET /api/properties`
  - `GET /api/properties/{id}`

### Validation

- Confirmed the Next.js application passes `npm run lint`.
- Confirmed the Next.js application passes `npm run build`.
- Smoke-tested the health and filtered property endpoints locally.

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
