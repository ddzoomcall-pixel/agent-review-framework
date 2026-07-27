// Core derivation logic for Classification, Autonomy Level, and Risk Tier.
// Ported from the verified finalized.html prototypes (register-intake,
// reviewer-decision) — same behavior, now typed and unit-testable.
//
// Derived, not self-selected: none of these are form fields a submitter
// picks directly. They're computed from behavioral answers so a label
// can't be used to dodge a fuller review (Premise 2, /office-hours).

import type { AutonomyLevel, MaturityLabel, RiskTier, TechnicalForm } from './supabase/types';

export interface ClassificationAnswers {
  stillExperiment: boolean | null; // Step 1
  namedOwnerAndUsed: boolean | null; // Step 2
  decidesOwnNextMove: boolean | null; // Step 3
  fixedSequence: boolean | null; // Step 4
}

export interface ClassificationResult {
  technicalForm: TechnicalForm | null;
  maturityLabel: MaturityLabel | null;
  /** Human-readable label, e.g. "Product (is a Workflow)" or "Tool". */
  display: string | null;
}

/**
 * Two things are always computed, not one (fixes the classification-tree
 * ordering bug found in /plan-eng-review round 1): a mature, fully
 * autonomous system must never lose its technical form just because it
 * also qualifies as "Product".
 */
export function computeClassification(a: ClassificationAnswers): ClassificationResult {
  let maturityLabel: MaturityLabel | null = null;
  if (a.stillExperiment === true) maturityLabel = 'mvp';
  else if (a.namedOwnerAndUsed === true) maturityLabel = 'product';

  let technicalForm: TechnicalForm | null = null;
  if (a.decidesOwnNextMove !== null) {
    technicalForm = a.decidesOwnNextMove ? 'agent' : a.fixedSequence ? 'workflow' : 'tool';
  }

  let display: string | null = null;
  if (maturityLabel && technicalForm) {
    const article = technicalForm === 'agent' ? 'an' : 'a';
    const formLabel = technicalForm.charAt(0).toUpperCase() + technicalForm.slice(1);
    display = `${maturityLabel === 'mvp' ? 'MVP' : 'Product'} (is ${article} ${formLabel})`;
  } else if (maturityLabel) {
    display = maturityLabel === 'mvp' ? 'MVP' : 'Product';
  } else if (technicalForm) {
    display = technicalForm.charAt(0).toUpperCase() + technicalForm.slice(1);
  }

  return { technicalForm, maturityLabel, display };
}

/**
 * Sticky Product label (from /plan-eng-review, closing Reviewer Concerns
 * item 1): once an item reaches Product, re-evaluation only happens at an
 * explicit re-certification event, never from a rolling 30-day window
 * lapsing. This function is the re-certification-time recomputation; the
 * intake-time computation above should not be re-run silently by a cron job.
 */
export function shouldReevaluateMaturity(currentLabel: MaturityLabel | null, recertTriggered: boolean): boolean {
  if (currentLabel === 'product') return recertTriggered;
  return true;
}

export interface AutonomyAnswers {
  realExternalEffect: boolean | null; // Step 1
  producesDraft: boolean | null; // Step 2
}

export function computeAutonomyLevel(a: AutonomyAnswers): AutonomyLevel | null {
  if (a.realExternalEffect === true) return 'autonomous_action';
  if (a.realExternalEffect === false && a.producesDraft === true) return 'draft_signoff';
  if (a.realExternalEffect === false && a.producesDraft === false) return 'advisory';
  return null;
}

export interface RiskTierInputs {
  // Hard triggers
  affectsNavValuationOrTerms: boolean; // H1
  clientFacingForMarketing: boolean; // H2
  autonomyLevel: AutonomyLevel | null; // used for H3
  dataCategories: string[]; // used for H3 + dimension C
  clientFacing: boolean; // used for H4
  validatedSourceOfTruth: boolean | null; // used for H4 + dimension V

  // Scored rubric (only consulted if no hard trigger fires)
  writesAuthoritativeRecord: boolean | null; // dimension I
  outageImpactsDeliverable: boolean | null; // dimension A
  ingestsUntrustedContent: boolean | null; // dimension S
  maturityLabel: MaturityLabel | null; // dimension G
}

export interface RiskTierResult {
  tier: RiskTier;
  reason: string;
  hardTriggerFired: string | null;
  elevatedCount: number;
  elevatedDimensions: string[];
}

const SENSITIVE_CATEGORIES = ['mnpi', 'client_pii', 'cross_border'];

function touchesSensitiveData(dataCategories: string[]): boolean {
  return dataCategories.some((c) => SENSITIVE_CATEGORIES.includes(c));
}

/**
 * Risk Tier: hard triggers first, then a scored rubric grounded in the CIA
 * triad, NIST AI RMF trustworthiness characteristics, and ISO 42001 AIMS.
 * 2-of-6 elevated dimensions tips to Full-review (threshold chosen in
 * /plan-eng-review D9 — "stricter" option — tunable once real volume is seen).
 */
export function computeRiskTier(inputs: RiskTierInputs): RiskTierResult {
  // H1: Integrity — output affects client terms/valuation/NAV.
  if (inputs.affectsNavValuationOrTerms) {
    return {
      tier: 'full_review',
      reason: 'H1: output affects client terms, a valuation, an allocation, or fund NAV/financials.',
      hardTriggerFired: 'H1',
      elevatedCount: 0,
      elevatedDimensions: [],
    };
  }

  // H2: Confidentiality/reputational — client-facing AND built for marketing/investor comms.
  if (inputs.clientFacingForMarketing) {
    return {
      tier: 'full_review',
      reason: 'H2: client-facing and specifically used in, or built to produce content for, marketing or investor communications.',
      hardTriggerFired: 'H2',
      elevatedCount: 0,
      elevatedDimensions: [],
    };
  }

  // H3: Confidentiality (reused from Autonomy + Data categories) — autonomous action + sensitive data.
  if (inputs.autonomyLevel === 'autonomous_action' && touchesSensitiveData(inputs.dataCategories)) {
    return {
      tier: 'full_review',
      reason: 'H3: Autonomous action and touches MNPI/Client PII/cross-border data.',
      hardTriggerFired: 'H3',
      elevatedCount: 0,
      elevatedDimensions: [],
    };
  }

  // H4: Integrity — client-facing AND not validated against a source of truth.
  // Closes the gap where the headline hallucination scenario would otherwise
  // only elevate dimension V (1 of 6, below threshold) — see /plan-eng-review round 2.
  if (inputs.clientFacing && inputs.validatedSourceOfTruth === false) {
    return {
      tier: 'full_review',
      reason: 'H4: client-facing and its output has not been validated against a source of truth.',
      hardTriggerFired: 'H4',
      elevatedCount: 0,
      elevatedDimensions: [],
    };
  }

  // Scored rubric: C / I / A / V / S / G
  const elevatedDimensions: string[] = [];
  if (touchesSensitiveData(inputs.dataCategories)) elevatedDimensions.push('C (Confidentiality)');
  if (inputs.writesAuthoritativeRecord === true) elevatedDimensions.push('I (Integrity)');
  if (inputs.outageImpactsDeliverable === true) elevatedDimensions.push('A (Availability)');
  if (inputs.validatedSourceOfTruth === false) elevatedDimensions.push('V (Valid & Reliable)');
  if (inputs.ingestsUntrustedContent === true) elevatedDimensions.push('S (Secure & Resilient)');
  if (inputs.maturityLabel === 'mvp') elevatedDimensions.push('G (Governance maturity)');

  const elevatedCount = elevatedDimensions.length;
  const tier: RiskTier = elevatedCount >= 2 ? 'full_review' : 'light_touch';
  const reason =
    tier === 'full_review'
      ? `No hard trigger fired. Scored rubric: ${elevatedCount} of 6 elevated (${elevatedDimensions.join(', ')}) — meets the 2-of-6 threshold.`
      : `No hard trigger fired. Scored rubric: ${elevatedCount} of 6 elevated — below the 2-of-6 threshold.`;

  return { tier, reason, hardTriggerFired: null, elevatedCount, elevatedDimensions };
}
