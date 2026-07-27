export type Role = 'submitter' | 'reviewer' | 'compliance';
export type TechnicalForm = 'agent' | 'workflow' | 'tool';
export type MaturityLabel = 'mvp' | 'product';
export type AutonomyLevel = 'autonomous_action' | 'draft_signoff' | 'advisory';
export type RiskTier = 'light_touch' | 'full_review';
export type EntryStatus =
  | 'pending'
  | 'assigned'
  | 'approved'
  | 'remediation_required'
  | 'cross_check_mismatch'
  | 'disputed';
export type DecisionType = 'approved' | 'more_info_requested' | 'remediation_required';

export interface Profile {
  id: string;
  display_name: string;
  role: Role;
  created_at: string;
}

export interface RegisterEntry {
  id: string;
  created_at: string;
  updated_at: string;

  owner_id: string;
  owner_name: string;
  team: string;
  llm_provider: string;

  data_categories: string[];
  client_facing: boolean;
  existing_sign_off: string | null;

  cls_step1_still_experiment: boolean | null;
  cls_step2_named_owner_and_used: boolean | null;
  cls_step3_decides_own_next_move: boolean | null;
  cls_step4_fixed_sequence: boolean | null;
  technical_form: TechnicalForm | null;
  maturity_label: MaturityLabel | null;

  auto_step1_real_external_effect: boolean | null;
  auto_step2_produces_draft: boolean | null;
  autonomy_level: AutonomyLevel | null;

  hard_trigger_h1_nav_valuation: boolean;
  hard_trigger_h2_marketing: boolean;
  validated_source_of_truth: boolean | null;
  writes_authoritative_record: boolean | null;
  outage_impacts_deliverable: boolean | null;
  ingests_untrusted_content: boolean | null;
  risk_tier: RiskTier | null;
  risk_tier_reason: string | null;

  status: EntryStatus;
  reviewer_id: string | null;
  remediation_deadline: string | null;
  owner_contradiction_resolved: boolean;
}

export interface Decision {
  id: string;
  register_entry_id: string;
  reviewer_id: string;
  decision: DecisionType;
  detail: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, 'id' | 'display_name'>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      register_entries: {
        Row: RegisterEntry;
        Insert: Partial<RegisterEntry> &
          Pick<RegisterEntry, 'owner_id' | 'owner_name' | 'team' | 'llm_provider'>;
        Update: Partial<RegisterEntry>;
        Relationships: [];
      };
      decisions: {
        Row: Decision;
        Insert: Partial<Decision> &
          Pick<Decision, 'register_entry_id' | 'reviewer_id' | 'decision' | 'detail'>;
        Update: Partial<Decision>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
