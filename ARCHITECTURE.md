# BidPulse Architecture Redesign

## 1. Database Schema & Data Flow

### Current "As-Is" State
- **Core Table:** `admin_operations_queue`
  - Acts as a single, flat catch-all table for operations.
  - Stores order details, fulfillment status, and payment confirmation in one place.
- **Authentication & Security:** 
  - Supabase Auth handles user sessions.
  - Database tables currently lack Row Level Security (RLS) policies.
- **Data Pipeline (The Stripe Flow):** 
  - Customer completes a $495 payment via Stripe.
  - `api/webhooks/stripe` intercepts the completion event.
  - Webhook formats the data and executes a direct `INSERT` into the `admin_operations_queue`.

---

### Proposed "To-Be" State

The new architecture replaces the flat operations queue with a relational model to manage the entire RFP lifecycle, compliance tracking, and pilot program logging.

#### The Database Schema (SQL Blueprint)

```sql
-- 1. Intakes & Submissions (Unified Draft + Final Submission Record)
CREATE TABLE rfp_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    is_test_waived BOOLEAN NOT NULL DEFAULT FALSE,
    company_name VARCHAR(255),
    naics_codes TEXT[], 
    small_business_statuses TEXT[], 
    set_aside_selections TEXT[],
    solicitation_number VARCHAR(128),
    agency_name VARCHAR(255),
    bid_due_date TIMESTAMPTZ,
    contract_details TEXT,
    rfp_file_url TEXT,
    rfp_file_metadata JSONB,
    current_pilot_stage INT DEFAULT 1 CHECK (current_pilot_stage BETWEEN 1 AND 6),
    stage_action_owner VARCHAR(16) DEFAULT 'client', -- 'client' | 'admin'
    last_saved_at TIMESTAMPTZ DEFAULT now(),
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Compliance Checklist (Interactive readiness checklist per intake)
CREATE TABLE intake_compliance_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intake_id UUID NOT NULL REFERENCES rfp_intakes(id) ON DELETE CASCADE,
    item_key VARCHAR(64) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'not_started',
    notes TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Deliverables (Output storage & preview links)
CREATE TABLE intake_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intake_id UUID NOT NULL REFERENCES rfp_intakes(id) ON DELETE CASCADE,
    deliverable_type VARCHAR(32) NOT NULL,
    file_url TEXT NOT NULL,
    version INT DEFAULT 1,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Matched Opportunities (Solves pending manual/automated bid-pipeline feeding)
CREATE TABLE matched_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    solicitation_title VARCHAR(255) NOT NULL,
    solicitation_number VARCHAR(128),
    agency VARCHAR(255),
    fit_score NUMERIC(5,2),
    naics_code VARCHAR(16),
    set_aside VARCHAR(64),
    response_deadline TIMESTAMPTZ,
    source VARCHAR(32) DEFAULT 'admin_curated',
    status VARCHAR(32) DEFAULT 'shortlisted',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Admin Activity & Pilot Evidence Log (Audit trail, pilot tracking & notes)
CREATE TABLE admin_pilot_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intake_id UUID REFERENCES rfp_intakes(id),
    client_id UUID NOT NULL REFERENCES users(id),
    admin_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(64) NOT NULL,
    notes TEXT,
    evidence_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);