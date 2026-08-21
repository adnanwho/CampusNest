# Implementation Plan — CampusNest MVP

Build and deploy the complete **CampusNest MVP**: a Smart Student Accommodation Marketplace with Verified Listings, Live Availability, Deterministic Recommendation Scoring with rule-based explanations, and Blockchain-Backed Verification Records based on `CampusNest_MVP_PRD_v3_refined.docx`.

---

## Architecture Decision

> [!IMPORTANT]
> **Backend Architecture Alignment**:
> The PRD mentions Java/Spring Boot for the backend and Next.js + TypeScript + Tailwind CSS for the frontend.
> **Option B (Polyglot: Spring Boot REST API with Maven Wrapper + Next.js Frontend)**: **Selected and implemented.** Maintain the standalone Spring Boot application (`mvnw`) on port 8080 exposing the REST endpoints defined in PRD Section 15, and connect a Next.js frontend on port 3000 to the Spring Boot backend.

---

## Current Implementation Status

### Completed ✅

| Pillar | Features Implemented | Status |
| :--- | :--- | :--- |
| **Authentication & Roles** | Role-based entry (Student / Seeker, Lister / Property Owner, Admin / Verifier) with secure JWT/session token handling | ✅ Done |
| **Student Journey** | Profile setup (College, Budget min/max, Move-in date, Locality, Accommodation type, Lifestyle Tags), Search & Discovery, Filter by budget/locality/type/availability | ✅ Done |
| **Deterministic Smart Recommendations** | 5-Factor Weighted Match Engine (Budget 30%, Distance 25%, Trust 20%, Facilities 15%, Lifestyle 10%) + rule-based explanations | ✅ Done |
| **Property Details & Real Costs** | Rent + Deposit + dynamic Effective Monthly Cost calculator (Rent + Food + Electricity + WiFi + Maintenance), Distance & Commute, Facilities list, 2–3 sample reviews labeled as demo | ✅ Done |
| **Side-by-Side Comparison** | Multi-select 2–3 properties to compare match score, rent, effective cost, deposit, commute, rating, availability, verification, and facilities | ✅ Done |
| **Lister Portal** | Property creation (all cost fields, coordinates, capacity, distance, facilities), Lister listing dashboard, Occupancy management, Property editing | ✅ Done |
| **Live Availability Model** | Lister updates occupied count (e.g. 18/20 → 19/20) → Student UI dynamically shows updated beds and status badges (`Available`, `Filling Fast`, `Almost Full`, `Full`) | ✅ Done |
| **Verification Workflow** | Lister Submits for Verification → Status `Under Review` → Admin Review Portal → Approve/Reject → Hash generation & blockchain record creation | ✅ Done |
| **Blockchain Record** | Tamper-evident verification record (Property ID, SHA-256 Record Hash, Timestamp, Tx Hash, Testnet: Polygon Amoy, Contract Address) + direct Explorer link when real blockchain enabled; demo mode clearly labeled otherwise | ✅ Done |
| **Registration** | Student and Lister registration with email, password, and role selection | ✅ Done |
| **Profile Editing** | Students can edit college, budget, move-in date, locality, accommodation type, and lifestyle tags | ✅ Done |
| **Route Guards** | Frontend guards on `/student`, `/lister`, `/admin` redirect unauthenticated users to login | ✅ Done |
| **Search/Filter** | Student search page with locality, budget range, and property type filters connected to backend | ✅ Done |

### Remaining / P2 🔲

| Feature | Notes |
| :--- | :--- |
| Real blockchain (Polygon Amoy/Sepolia) | Backend code exists; needs real RPC URL, private key, and contract address to enable. Currently in demo mode with clear labeling. |
| Real AI/LLM explanations | Currently rule-based. UI no longer claims "AI". Integrate LLM API if available. |
| Lister profile editing | Not implemented in current scope. |
| Production deployment config | Demo data seeder should be disabled via Spring profile in production. Admin seed credentials should be rotated. |

---

## Security & Production Readiness

### Completed Security Fixes
- Removed hardcoded admin credentials from frontend bundle
- Removed hardcoded JWT secret fallback; `JWT_SECRET` required from environment
- Backend enforces role-based access (`/admin/**` → ADMIN, `/listings/**` → LISTER, etc.)
- Frontend `RouteGuard` for UX (backend is source of truth)
- Demo blockchain records clearly labeled; explorer links hidden for mock hashes

### Production Checklist
- [ ] Set `JWT_SECRET` environment variable (no default)
- [ ] Set `CORS_ORIGINS` to production frontend URL only
- [ ] Rotate `ADMIN_EMAIL` / `ADMIN_PASSWORD` from demo defaults
- [ ] Disable demo data seeder in production (use separate Spring profile)
- [ ] Configure real blockchain: `BLOCKCHAIN_ENABLED=true`, `BLOCKCHAIN_PRIVATE_KEY`, `CONTRACT_ADDRESS`, `BLOCKCHAIN_RPC_URL`
- [ ] Configure real AI/LLM API key if using AI explanations

---

## How to Run

### Backend
```bash
cd backend

# Required: Set JWT secret (no default anymore)
$env:JWT_SECRET="your-secret-key-min-32-chars"

# Optional: use H2 if PostgreSQL not available
$env:SPRING_PROFILES_ACTIVE="h2"

./mvnw spring-boot:run
```
→ `http://localhost:8080/api`

### Frontend
```bash
cd web
npm install
npm run dev
```
→ `http://localhost:3000`

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Student | `aarav@campusnest.demo` | `student123` |
| Lister | `lister@campusnest.demo` | `lister123` |
| Admin | `admin@campusnest.demo` | `admin123` |

Or register a new account at `/register`.

---

## 15 Seeded Greater Noida / Noida Properties

1. **Stanza Living Kyoto House** — Knowledge Park III, Greater Noida (PG, ₹9,500/mo, Near NIET/Sharda) [Verified, Demo Hash]
2. **Your-Space Hostel Greater Noida** — Knowledge Park II (Hostel, ₹11,000/mo, Near Galgotias) [Verified, Demo Hash]
3. **Scholar Nest PG for Boys** — Alpha 1, Greater Noida (PG, ₹7,200/mo, Near NIET) [Verified, Demo Hash]
4. **Zolo Silicon Valley** — Sector 62, Noida (PG, ₹8,500/mo) [Verified, Demo Hash]
5. **Aura Student Residencies** — Pari Chowk, Greater Noida (Hostel, ₹12,500/mo) [Verified, Demo Hash]
6. **Campus Haven Girls PG** — Knowledge Park III (PG, ₹6,800/mo, Near Sharda) [Verified, Demo Hash]
7. **Green View 2BHK Flatshare** — Gamma 2, Greater Noida (Flat, ₹6,000/mo) [Verified, Demo Hash]
8. **Metro Pride Student PG** — Sector 52, Noida (PG, ₹7,500/mo) [Verified, Demo Hash]
9. **The Elite Residency** — Beta 1, Greater Noida (PG, ₹9,000/mo) [Under Review]
10. **Apex Luxury Hostel** — Knowledge Park I (Hostel, ₹14,000/mo, Near Bennett) [Verified, Demo Hash]
11. **Budget Stay Dorms** — Jagat Farm, Greater Noida (Hostel, ₹4,500/mo) [Draft]
12. **Comfort Zone 3BHK Shared** — Chi 4, Greater Noida (Flat, ₹5,500/mo) [Verified, Demo Hash]
13. **Shree Balaji Boys PG** — Knowledge Park III (PG, ₹7,000/mo, 18/20 Occupied - Live Demo Property) [Verified, Demo Hash]
14. **NestAway Urban Living** — Sector 128, Noida (Shared Flat, ₹10,500/mo) [Verified, Demo Hash]
15. **Grand Plaza Student Suites** — Alpha 2, Greater Noida (Hostel, ₹8,000/mo) [Submitted for Verification]

---

## 3 Golden Student Profiles for Hackathon Demo

1. **Aarav Sharma** (NIET student, Budget ₹6,000–₹8,000, Preferences: Safety, Food Quality, Quiet Environment, Locality: Knowledge Park / Alpha).
2. **Priya Patel** (Sharda University student, Budget ₹9,000–₹13,000, Preferences: Wi-Fi, Cleanliness, Safety, Locality: Knowledge Park III).
3. **Rohan Verma** (Galgotias / Tech student, Budget ₹5,000–₹7,000, Preferences: Proximity to Market, Wi-Fi, Budget-friendly).

---

## Verification Plan

### Automated Verification
- Verify deterministic recommendation scoring algorithm unit tests against test vectors.
- Verify API endpoints for property filtering, listing creation, occupancy updates, and verification status lifecycle.
- Run type checks and build tests (`npm run build`, `npx tsc --noEmit`, `./mvnw clean test`).

### Manual & Interactive Verification
- Walk through the full Hackathon Demo Story:
  1. Open Lister Portal → inspect "Shree Balaji Boys PG" (18/20 occupied).
  2. Switch to Student Portal → load Aarav Sharma profile → verify top recommendation has high match score and explanation.
  3. Inspect effective monthly cost breakdown and verification modal.
  4. Compare 2 properties side-by-side.
  5. Go to Lister Portal → increase occupied count → switch to Student Portal and verify vacancy updates immediately.
  6. Create a new listing as Lister → Submit for Verification → Switch to Admin Portal → Approve → Verify hash generation and DB record.
