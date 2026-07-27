-- AI Agent Governance Platform — initial schema
-- Matches the data model in DESIGN.md / the approved design doc.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: role mapping for the 3-tier access model (submitter/reviewer/
-- compliance), since auth.users cannot be extended directly. MVP auth is
-- simple email/password (Supabase Auth) — SSO-linked identity is a real
-- follow-up dependency per the design doc, not solved here.
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null default 'submitter' check (role in ('submitter', 'reviewer', 'compliance')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- register_entries: the core register. Every self-report + derived field.
-- ---------------------------------------------------------------------------
create table if not exists register_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  owner_id uuid not null references auth.users (id),
  owner_name text not null,
  team text not null,
  llm_provider text not null,

  data_categories text[] not null default '{}',
  client_facing boolean not null default false,
  existing_sign_off text,

  -- Classification decision tree (D1 fix from /plan-eng-review: technical
  -- form and maturity label are always both computed, never conflated).
  cls_step1_still_experiment boolean,
  cls_step2_named_owner_and_used boolean,
  cls_step3_decides_own_next_move boolean,
  cls_step4_fixed_sequence boolean,
  technical_form text check (technical_form in ('agent', 'workflow', 'tool')),
  maturity_label text check (maturity_label in ('mvp', 'product')),

  -- Autonomy decision tree
  auto_step1_real_external_effect boolean,
  auto_step2_produces_draft boolean,
  autonomy_level text check (autonomy_level in ('autonomous_action', 'draft_signoff', 'advisory')),

  -- Risk tier inputs (hard triggers H1-H4 + scored rubric C/I/A/V/S/G)
  hard_trigger_h1_nav_valuation boolean not null default false,
  hard_trigger_h2_marketing boolean not null default false,
  validated_source_of_truth boolean, -- feeds H4 and dimension V
  writes_authoritative_record boolean, -- dimension I
  outage_impacts_deliverable boolean, -- dimension A
  ingests_untrusted_content boolean, -- dimension S
  risk_tier text check (risk_tier in ('light_touch', 'full_review')),
  risk_tier_reason text,

  -- Workflow state
  status text not null default 'pending' check (
    status in ('pending', 'assigned', 'approved', 'remediation_required', 'cross_check_mismatch', 'disputed')
  ),
  reviewer_id uuid references auth.users (id),
  remediation_deadline date,

  -- Owner-consistency check result (D5 from /plan-eng-review): a submission
  -- with a contradictory Owner + Step 1 answer should never have reached
  -- 'pending' in the first place, but this flag lets the UI/API assert it.
  owner_contradiction_resolved boolean not null default true
);

create index if not exists register_entries_owner_id_idx on register_entries (owner_id);
create index if not exists register_entries_status_idx on register_entries (status);
create index if not exists register_entries_risk_tier_idx on register_entries (risk_tier);

-- ---------------------------------------------------------------------------
-- decisions: the review-decision log (Success Criteria — "visible audit
-- trail" for Full-review routing). Distinct from the deferred "versioned
-- audit trail" (field-level diff history) named in the design doc's TODOs.
-- ---------------------------------------------------------------------------
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  register_entry_id uuid not null references register_entries (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id),
  decision text not null check (decision in ('approved', 'more_info_requested', 'remediation_required')),
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists decisions_register_entry_id_idx on decisions (register_entry_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists register_entries_set_updated_at on register_entries;
create trigger register_entries_set_updated_at
  before update on register_entries
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — 3-tier access model (from /plan-eng-review D3):
--   1. Submitter  — sees only their own entries.
--   2. Reviewer   — sees the Full-review queue plus their own entries.
--   3. Compliance — sees everything.
-- ---------------------------------------------------------------------------
create or replace function current_user_role()
returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

alter table profiles enable row level security;
alter table register_entries enable row level security;
alter table decisions enable row level security;

create policy "profiles: users can read their own profile"
  on profiles for select
  using (id = auth.uid());

create policy "register_entries: submitter reads own entries"
  on register_entries for select
  using (owner_id = auth.uid());

create policy "register_entries: reviewer reads full-review queue + own"
  on register_entries for select
  using (
    current_user_role() = 'reviewer'
    and (risk_tier = 'full_review' or owner_id = auth.uid())
  );

create policy "register_entries: compliance reads everything"
  on register_entries for select
  using (current_user_role() = 'compliance');

create policy "register_entries: submitter inserts own entries"
  on register_entries for insert
  with check (owner_id = auth.uid());

create policy "register_entries: submitter updates own pending entries"
  on register_entries for update
  using (owner_id = auth.uid() and status = 'pending');

create policy "register_entries: reviewer/compliance update for decisions"
  on register_entries for update
  using (current_user_role() in ('reviewer', 'compliance'));

create policy "decisions: reviewer/compliance read all"
  on decisions for select
  using (current_user_role() in ('reviewer', 'compliance'));

create policy "decisions: submitter reads decisions on own entries"
  on decisions for select
  using (
    exists (
      select 1 from register_entries
      where register_entries.id = decisions.register_entry_id
      and register_entries.owner_id = auth.uid()
    )
  );

create policy "decisions: reviewer/compliance insert"
  on decisions for insert
  with check (current_user_role() in ('reviewer', 'compliance') and reviewer_id = auth.uid());
