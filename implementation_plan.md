# Implementation Plan — CampusNest MVP

Build and deploy the complete **CampusNest MVP**: an AI-Powered Student Accommodation Marketplace with Verified Listings, Live Availability, Deterministic Recommendation Scoring with AI explanations, and Blockchain-Backed Verification Records based on `CampusNest_MVP_PRD_v3_refined.docx`.

---

## User Review Required

> [!IMPORTANT]
> **Backend Architecture Alignment**:
> The PRD mentions Java/Spring Boot for the backend and Next.js + TypeScript + Tailwind CSS for the frontend. 
> Because `mvn` is not installed globally in PATH, we can either:
> 1. **Option A (Full-Stack Next.js 15 App Router + TypeScript + SQLite/PostgreSQL)**: Not selected. This unified backend approach was prototyped and reverted in favor of the separated backend architecture below.
> 2. **Option B (Polyglot: Spring Boot REST API with Maven Wrapper + Next.js Frontend)**: **Selected.** Maintain the standalone Spring Boot application (`mvnw`) on port 8080 exposing the REST endpoints defined in PRD Section 15, and connect a Next.js frontend on port 3000 to the Spring Boot backend.
>
> *(Option B is the committed architecture for this project.)*

---

## Key Features & PRD Compliance

| Pillar | Features to Implement | PRD Section |
| :--- | :--- | :--- |
| **Authentication & Roles** | Role-based entry (Student / Seeker, Lister / Property Owner, Admin / Verifier) with secure JWT/session token handling | §8.1, §9.1, §17 |
| **Student Journey** | Profile setup (College, Budget min/max, Move-in date, Locality, Accommodation type, 6 Fixed Lifestyle Tags), Search & Discovery, Filter by budget/locality/type/availability | §8.2, §8.3 |
| **Deterministic AI Recommendations** | 5-Factor Weighted Match Engine (Budget 30%, Distance 25%, Trust 20%, Facilities 15%, Lifestyle 10%) + 1–2 sentence AI explanation generated via Gemini with robust golden fallbacks | §12.1, §12.2, §12.3 |
| **Property Details & Real Costs** | Rent + Deposit + dynamic Effective Monthly Cost calculator (Rent + Food + Electricity + WiFi + Maintenance), Distance & Commute, Facilities list, 2–3 sample reviews labeled as demo | §8.5, §14 |
| **Side-by-Side Comparison** | Multi-select 2–3 properties to compare match score, rent, effective cost, deposit, commute, rating, availability, verification, and facilities | §8.6 |
| **Lister Portal** | Property creation (all cost fields, coordinates, capacity, distance, facilities), Lister listing dashboard, Occupancy management | §9.1 – §9.4 |
| **Live Availability Model** | Lister updates occupied count (e.g. 18/20 → 19/20) → Student UI dynamically shows updated beds and status badges (`Available`, `Filling Fast`, `Almost Full`, `Full`) | §13 |
| **Verification Workflow** | Lister Submits for Verification → Status `Under Review` → Admin Review Portal → Approve/Reject → Hash generation & blockchain record creation | §10, §15 |
| **Blockchain Record** | Tamper-evident verification record (Property ID, SHA-256 Record Hash, Timestamp, Tx Hash, Testnet: Sepolia / Polygon Amoy, Contract Address) + direct Explorer link | §11 |
| **Demo Data & Golden Profiles** | 15 seeded properties in Greater Noida / Noida (near NIET, Sharda, Galgotias, Amity, Knowledge Park) + 3 Golden Student Profiles + Live demo judge flow | §18, §21 |

---

## Proposed Changes

### 1. Core Design System & Frontend Shell (`/web` or root)
- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Design Aesthetic**: Premium modern UI with dark/light mode, glassmorphism cards, glowing verification badges, smooth animated transitions, interactive comparison drawer, and responsive mobile/desktop layouts.
- **Google Fonts**: Inter / Plus Jakarta Sans / Outfit for crisp typography.

### 2. State & Data Layer
- **Persistent Data Store**: JSON-backed local database with seeded demo data or SQLite / Prisma with full support for:
  - `users` (id, role, name, email, password_hash, created_at)
  - `students` (user_id, college, budget_min, budget_max, move_in_date, locality_pref, accommodation_type, lifestyle_tags)
  - `listers` (user_id, profile, verification_status)
  - `properties` (id, lister_id, name, type, address, locality, lat, lng, description, rent, deposit, food_cost, electricity_cost, wifi_cost, maintenance_cost, facilities, distance_km, commute_time_min, commute_mode, capacity, occupied, available, rating, verification_status, verification_hash, verification_timestamp, blockchain_tx)
  - `reviews` (id, property_id, rating, category_ratings, text, is_demo)
  - `verification_records` (id, property_id, lister_id, verification_status, record_hash, timestamp, blockchain_tx, contract_address, network, reviewed_by)

### 3. Recommendation Scoring & AI Explanation Engine
- Implementation of the exact PRD weighted formula:
  $$\text{Score} = (0.30 \times S_{\text{budget}}) + (0.25 \times S_{\text{distance}}) + (0.20 \times S_{\text{trust}}) + (0.15 \times S_{\text{facilities}}) + (0.10 \times S_{\text{lifestyle}})$$
- Integration with Gemini API for dynamic, contextual 1–2 sentence student match explanations.
- Offline pre-computed explanations for the 3 Golden Student Profiles to ensure 100% demo uptime.

### 4. Blockchain & Verification Subsystem
- Verification hashing: SHA-256 over canonical property snapshot (Property ID + Lister + Address + Capacity + Admin Signoff).
- Smart Contract Simulation & Testnet integration:
  - Smart Contract ABI for `registerVerification(propertyId, recordHash)` and `getVerification(propertyId)`.
  - Realistic on-chain transaction hashes linking to Sepolia Etherscan / Polygon Amoy Explorer.
  - Interactive verification modal showing raw cryptographic proof and chain details.

### 5. UI Views & Portals
- **Role Switcher & Landing Page**: Hero section with quick-entry buttons for **Student / Seeker**, **Lister / Owner**, and **Admin / Verifier**, plus "Quick Demo" presets.
- **Student Portal**:
  - Profile & Preferences setup modal/page.
  - Discovery & Recommendation Feed with live filter bars and AI match badges.
  - Property Detail Modal / View with cost breakdown visualizer, commute badge, and vacancy indicator.
  - Compare Drawer / Modal (2–3 properties side-by-side).
- **Lister Portal**:
  - Listing creation wizard (multi-step with cost breakdown and coordinates).
  - My Properties dashboard with 1-click occupancy adjustment buttons (+ / - occupied count).
  - "Submit for Verification" action.
- **Admin Verification Portal**:
  - Pending verification requests queue.
  - Lister & property audit view.
  - 1-click Approve / Reject with automatic blockchain record generation.

---

## 15 Seeded Greater Noida / Noida Properties

1. **Stanza Living Kyoto House** — Knowledge Park III, Greater Noida (PG, ₹9,500/mo, Near NIET/Sharda) [Verified, On-Chain]
2. **Your-Space Hostel Greater Noida** — Knowledge Park II (Hostel, ₹11,000/mo, Near Galgotias) [Verified, On-Chain]
3. **Scholar Nest PG for Boys** — Alpha 1, Greater Noida (PG, ₹7,200/mo, Near NIET) [Verified, On-Chain]
4. **Zolo Silicon Valley** — Sector 62, Noida (PG, ₹8,500/mo) [Verified, On-Chain]
5. **Aura Student Residencies** — Pari Chowk, Greater Noida (Hostel, ₹12,500/mo) [Verified, On-Chain]
6. **Campus Haven Girls PG** — Knowledge Park III (PG, ₹6,800/mo, Near Sharda) [Verified, On-Chain]
7. **Green View 2BHK Flatshare** — Gamma 2, Greater Noida (Flat, ₹6,000/mo) [Verified, On-Chain]
8. **Metro Pride Student PG** — Sector 52, Noida (PG, ₹7,500/mo) [Verified, On-Chain]
9. **The Elite Residency** — Beta 1, Greater Noida (PG, ₹9,000/mo) [Under Review]
10. **Apex Luxury Hostel** — Knowledge Park I (Hostel, ₹14,000/mo, Near Bennett) [Verified, On-Chain]
11. **Budget Stay Dorms** — Jagat Farm, Greater Noida (Hostel, ₹4,500/mo) [Draft]
12. **Comfort Zone 3BHK Shared** — Chi 4, Greater Noida (Flat, ₹5,500/mo) [Verified, On-Chain]
13. **Shree Balaji Boys PG** — Knowledge Park III (PG, ₹7,000/mo, 18/20 Occupied - Live Demo Property) [Verified, On-Chain]
14. **NestAway Urban Living** — Sector 128, Noida (Shared Flat, ₹10,500/mo) [Verified, On-Chain]
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
- Run type checks and build tests (`npm run build`).

### Manual & Interactive Verification
- Walk through the full 21-step Hackathon Demo Story:
  1. Open Lister Portal → inspect "Shree Balaji Boys PG" (18/20 occupied).
  2. Switch to Student Portal → load Aarav Sharma profile → verify top recommendation has 90%+ match score and AI explanation.
  3. Inspect effective monthly cost breakdown and blockchain verification modal.
  4. Compare 2 properties side-by-side.
  5. Go to Lister Portal → increase occupied count to 19/20 → switch to Student Portal and verify vacancy shows 1 bed available immediately.
  6. Create a new listing as Lister → Submit for Verification → Switch to Admin Portal → Approve → Verify on-chain record generation.
