# Changelog

All notable CampusNest project changes are documented here.

## [Unreleased]

### Changed

- Reverted the temporary Option A unified Next.js backend prototype.
- Selected Option B: retain the Spring Boot REST backend and add a separate Next.js frontend when frontend implementation resumes.

### Added

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
