# BidPulse Master Project Plan & Execution Roadmap

**Role:** Lead Technical Project Manager / Systems Architect  
**Project:** BidPulse (GovCon Procurement Intelligence & Proposal Acceleration Platform)  
**Current Milestone:** Architecture Redesign & Relational Data Migration  
**Active Branch:** `feature/architecture-redesign`

---

## 1. Project Status & Current Baseline

* **Completed:** 
  * Landing page UI baseline restored and verified.
  * PRD, legal governance requirements (TOS, MNDA, FAR integrity attestations), and 6-stage lifecycle formalized in `ARCHITECTURE.md` and Google Docs.
  * Relational database schema designed (moving from the flat `admin_operations_queue` to 6 linked tables: `users`, `rfp_intakes`, `intake_compliance_checklists`, `intake_deliverables`, `matched_opportunities`, and `admin_pilot_logs`).
* **In Progress:** Transitioning technical documentation into executable Supabase migrations and preparing Next.js server actions for relational reads/writes.
* **Pending:** UI intake flow refactor, compliance matrix integration, Stripe webhook relational routing, automated QA testing, and pilot deployment.

---

## 2. Master Sprint Schedule & Work Breakdown Structure (WBS)

| Sprint / Phase | Focus Area | Key Deliverables & Engineering Tasks | Est. Timeline | QA & Verification Window |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Database & Security** *(Current)* | Schema Migration & RLS Policies | - Generate Supabase migration for 6 relational tables.<br>- Implement RLS policies for client and admin roles.<br>- Validate foreign key cascades and data integrity. | Sprints 15–16 (3 Days) | 1.0 Day (Migration rollback & access violation testing) |
| **Phase 2: Auth & Legal Onboarding** | Identity & Legal Attestations | - Hook up user registration to `users` profile creation.<br>- Build clickwrap modals for TOS, MNDA, and FAR attestation timestamps.<br>- Enforce Next.js route middleware guards. | Sprint 17 (2 Days) | 0.5 Day (Auth edge case & session persistence testing) |
| **Phase 3: Relational Intake & Checklist Pipeline** | Stage 1 & 2 Portal Lifecycle | - Refactor `/portal` to write drafts to `rfp_intakes`.<br>- Build interactive compliance checklist UI mapped to `intake_compliance_checklists`.<br>- Wire file upload handling for RFP documents. | Sprints 18–19 (4 Days) | 1.5 Days (Form state, file upload payload, and schema stress testing) |
| **Phase 4: Deliverables & Admin Ops Dashboard** | Stage 3–5 Admin Review | - Build `/admin` operations view for review and evidence logging (`admin_pilot_logs`).<br>- Create deliverable staging and publishing engine (`intake_deliverables`).<br>- Refactor Stripe webhook to create relational intake records. | Sprint 20 (3 Days) | 1.0 Day (Webhook simulation, deliverable preview, and RLS bypass validation) |
| **Phase 5: End-to-End QA, Polish & Staging** | Full Lifecycle Validation | - Execute full 6-stage lifecycle smoke tests.<br>- Load testing, UI responsive checks across desktop and mobile views.<br>- Production migration rehearsal on Supabase staging. | Sprint 21 (2 Days) | 2.0 Days (Dedicated Full-Regression QA) |

---

## 3. Dedicated QA & Verification Framework

To prevent regressions and avoid broken builds, each development milestone requires passing three QA gates before merging to `main`:

* **Gate 1: Schema & Access Control (Database QA)**
  * Verify unauthenticated requests are rejected by RLS.
  * Verify clients cannot query or modify another client's `rfp_intakes` or `intake_compliance_checklists`.
  * Confirm admin-only access on `admin_pilot_logs` and publishing rights on `intake_deliverables`.
* **Gate 2: Integration & Webhook Reliability (API QA)**
  * Simulate Stripe checkout webhook payloads using the Stripe CLI.
  * Confirm database transactions write cleanly across `users` and `rfp_intakes` without orphan records.
* **Gate 3: End-to-End User Journey (UI/UX QA)**
  * Walk through the entire 6-stage workflow from solicitation upload to final deliverable download.
  * Verify layout responsiveness on both desktop browser viewports and mobile display modes.

---

## 4. Immediate Next Tasks (Sprint 15 Execution)

1. **Task 15.1:** Generate timestamped Supabase migration file `init_rfp_relational_schema.sql`.
2. **Task 15.2:** Paste the complete 6-table SQL schema into the migration file and commit to `feature/architecture-redesign`.
3. **Task 15.3:** Apply the migration locally or via the Supabase dashboard and run preliminary QA queries.