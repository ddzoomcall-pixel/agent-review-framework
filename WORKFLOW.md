# AI Agent Governance Platform — Complete Workflow & Screen Map

## End-to-End User Journeys

This document maps the complete workflow including all newly added confirmation states.

### Journey 1: Analyst — Register & Submit (Light-touch)

```
/register (Intake form with questionnaire)
    ↓
(All questions answered, form valid)
    ↓
Click "Submit for tiering"
    ↓
Backend: Classification, Autonomy, Risk Tier computed
Backend: Entry inserted to database with status='pending'
    ↓
/register/confirmation?tier=Light-touch&classification=MVP
    ├─ ✓ Success indicator
    ├─ Classification & Tier display
    ├─ Reference ID (entry UUID)
    ├─ "What happens next" section:
    │  ├─ Automatic approval for light-touch
    │  ├─ No further review needed
    │  ├─ Can view/edit anytime before finalization
    │  └─ Will appear in audit export
    ├─ CTAs: "View your dashboard" + "Register another item"
    └─ Footer note: Can edit before decision made

Subsequent actions:
/dashboard
  ├─ Entry shows in All/Light-touch tabs
  ├─ Status: "Approved"
  └─ Owner can click to view or edit (if status still pending)
```

### Journey 2: Analyst — Register & Submit (Full-review)

```
/register (Intake form with questionnaire)
    ↓
(Form triggers Full-review via hard trigger or 2-of-6 rubric)
    ↓
Click "Submit for tiering"
    ↓
Backend: Classification, Autonomy, Risk Tier computed
Backend: Entry inserted with status='assigned', routed to reviewer pool
    ↓
/register/confirmation?tier=Full-review&classification=Product
    ├─ ✓ Success indicator
    ├─ Classification & Tier display
    ├─ Reference ID
    ├─ "What happens next" section:
    │  ├─ Routed to reviewer pool
    │  ├─ Decision within 5 business days (SLA target)
    │  ├─ Will be notified when decision made
    │  └─ Can monitor status from dashboard
    ├─ CTAs: "View your dashboard" (primary)
    └─ Footer note: May be asked for additional info

Subsequent actions:
/dashboard
  ├─ Entry shows in All/Full-review tabs
  ├─ Status: "Assigned for review" + SLA countdown
  └─ Owner watches for decision notification
```

### Journey 3: Reviewer — Evaluate & Decide

```
/dashboard (Compliance/Reviewer view)
  ├─ Tabs include "Full-review (N)" queue
  └─ Reviewer assigned = can see this entry
      ↓
Click entry in Full-review queue or click "Review" link
      ↓
/review/[id]
  ├─ Entry details (Owner, Classification, Autonomy, Data)
  ├─ "Why this is Full-review" explanation box
  ├─ Decision buttons:
  │  ├─ Approve
  │  ├─ Request more info
  │  └─ Require remediation (opens deadline picker)
  └─ (Click any button to record decision)
      ↓
Backend: Decision inserted to decisions table
Backend: register_entries.status updated (approved/pending/remediation_required)
Backend: register_entries.reviewer_id set
      ↓
/review/confirmation
  ?decision=approved|more_info_requested|remediation_required
  ?itemName={llm_provider}
  ?ownerName={owner_name}
  ?deadline={remediation_deadline}
  │
  ├─ Icon + "Your decision has been recorded" heading
  ├─ Decision pill (color-coded):
  │  ├─ Green checkmark for Approved
  │  ├─ Gold ? for More info requested
  │  └─ Red ⚠ for Remediation required
  ├─ "What this means" section (decision-specific):
  │  ├─ Approved:
  │  │  ├─ Item marked safe for use in audit trail
  │  │  ├─ Owner notified immediately
  │  │  └─ Complete & will appear in compliance export
  │  ├─ More info requested:
  │  │  ├─ Owner prompted for additional information
  │  │  ├─ Can track & follow up from queue
  │  │  └─ Resubmission routes back to reviewer
  │  └─ Remediation required:
  │     ├─ Item paused pending remediation
  │     ├─ Owner has [N] days to resolve
  │     ├─ Agent non-operational until approved
  │     └─ Monitor queue for owner follow-up
  ├─ CTA: "Back to your queue" (primary)
  └─ Footer: Decision recorded in audit trail with timestamp

Subsequent actions:
/dashboard
  └─ Entry status updated in table
      └─ Reviewer can see their decision was recorded
```

### Journey 4: Compliance — Generate Audit Export

```
/dashboard (Compliance view)
  └─ Top right: "Export" button
      ↓
/export
  ├─ Stats cards: Total, Full-review, Approved, Remediation
  ├─ Export options:
  │  ├─ Reporting period input (e.g., "Q3 2026")
  │  └─ Format: CSV or JSON
  ├─ "Download as CSV/JSON" button
  └─ Export includes section
      ↓
Click "Download as CSV/JSON"
      ↓
Backend: Compile entries + metadata
Frontend: Trigger browser download (CSV or JSON file)
      ↓
/export (after download)
  ├─ Success result box appears:
  │  ├─ ✓ "Export ready"
  │  ├─ "Downloaded" status
  │  └─ Time: "Downloaded at [HH:MM:SS]. Period: Q3 2026"
  ├─ Stats summary of export contents
  ├─ Caveat: "Generated [date] at [time]"
  └─ CTA: "Back to dashboard"
```

## Screen Inventory

| Screen | Route | User | Status | Purpose |
|--------|-------|------|--------|---------|
| Register form | `/register` | Analyst | ✅ Existing | Intake questionnaire, classification trees |
| Submission confirmation | `/register/confirmation` | Analyst | ✅ **NEW** | Success state + next steps after submit |
| Dashboard | `/dashboard` | Analyst/Reviewer/Compliance | ✅ Existing | Queue, filter, status overview |
| Review decision | `/review/[id]` | Reviewer | ✅ Existing | Evaluate and make decision |
| Decision confirmation | `/review/confirmation` | Reviewer | ✅ **NEW** | Success state with decision-specific messaging |
| Audit export | `/export` | Compliance | ✅ **NEW** | Generate & download CSV/JSON export |

## Key Features Added

### 1. Submission Confirmation (`/register/confirmation`)
- **Who sees it:** Analyst, right after submitting registration
- **What it shows:** Classification, tier, reference ID, personalized "next steps"
- **Next actions:** View dashboard or register another item
- **Solves:** Analyst anxiety at submission ("What now?") — provides clear feedback and path forward

### 2. Decision Confirmation (`/review/confirmation`)
- **Who sees it:** Reviewer, right after making approval/remediation decision
- **What it shows:** Decision-specific messaging (3 variants), timestamp, next steps
- **Variants:**
  - Approved: Item marked safe, owner notified, complete
  - More info: Owner prompted for details, resubmission routes back
  - Remediation: Agent paused, deadline set, monitor queue
- **Next actions:** Back to queue
- **Solves:** Reviewer gets immediate confirmation their decision was recorded; owner gets clear understanding of what each decision means

### 3. Audit Export (`/export`)
- **Who sees it:** Compliance officer
- **What it shows:** Stats, export options (period + format), download button, success confirmation
- **Formats:** CSV (spreadsheet) or JSON (structured data)
- **Next actions:** Download file or return to dashboard
- **Solves:** Compliance can generate audit-ready exports on demand for external auditors/client due diligence

## Data Flow Diagram

```
┌─ Analyst registers entry ─────────────────────────────────┐
│  Form → Compute classification/autonomy/risk → Insert DB  │
└───────────────────┬─────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Tier decision logic   │
        └───────┬───────┬───────┘
                ├─ Light-touch (auto-approved)
                └─ Full-review (requires decision)
                    ↓
        ┌─────────────────────────────┐
        │ Route to reviewer pool      │
        │ (set status='assigned')     │
        └────────────┬────────────────┘
                     ↓
    ┌────────────────────────────────────┐
    │ Reviewer makes decision            │
    │ (approve/request-info/remediate)   │
    └────────┬───────────────────────────┘
             ↓
    ┌────────────────────────┐
    │ Insert to decisions    │
    │ Update entry status    │
    └────────┬───────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Entry ready for audit export   │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Compliance generates export    │
    │ (select period, download CSV)  │
    └────────────────────────────────┘
```

## Database State Transitions

**Register Entry Lifecycle:**

```
1. Created by analyst (status='pending' or 'assigned' based on tier)
2. Reviewer makes decision → status updated to:
   - 'approved' (Approve button)
   - 'pending' (Request more info — awaiting resubmission)
   - 'remediation_required' (Require remediation — paused with deadline)
3. Optional: Cross-check mismatch detected → status='cross_check_mismatch'
4. Optional: Owner disputes classification → status='disputed'
5. Final: Included in audit export with all status history
```

**Decision Table:**
- One row per decision event
- Links to register_entry_id, reviewer_id
- Records: decision type, detail message, timestamp
- Visible in audit trail for compliance

## Testing the Workflow

### Test Case 1: Light-touch submission → confirmation → dashboard
```
1. Go to /register
2. Fill out form with low-risk answers
3. Submit
4. Confirm: /register/confirmation shows Light-touch + next steps
5. Click "View your dashboard"
6. Confirm: Entry visible in Light-touch tab with "Approved" status
```

### Test Case 2: Full-review submission → reviewer decision → confirmation
```
1. Go to /register
2. Fill out form with high-risk answers (affects NAV, client-facing, etc.)
3. Submit
4. Confirm: /register/confirmation shows Full-review + routed to pool
5. Sign in as reviewer
6. Go to /dashboard, click Full-review tab
7. Click entry, review details
8. Click "Approve"
9. Confirm: /review/confirmation shows green checkmark + approval messaging
10. Click "Back to your queue"
11. Confirm: Entry status updated to "Approved" in dashboard
```

### Test Case 3: Export generation
```
1. As compliance officer, go to /dashboard
2. Click "Export" button (top right)
3. Enter period "Q3 2026"
4. Select format (CSV or JSON)
5. Click "Download as CSV"
6. Confirm: Browser downloads file + success box appears in /export
7. Open file to verify data structure
```

## Navigation Summary

**Analyst flow:**
```
/register → /register/confirmation → /dashboard
```

**Reviewer flow:**
```
/dashboard (Full-review tab) → /review/[id] → /review/confirmation → /dashboard
```

**Compliance flow:**
```
/dashboard (Export link) → /export (select options) → Download → /export (confirmation)
```

**All users:**
```
Home → /dashboard (central hub) → Any screen
```
