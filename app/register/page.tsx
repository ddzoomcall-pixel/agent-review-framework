'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  computeAutonomyLevel,
  computeClassification,
  computeRiskTier,
  type AutonomyAnswers,
  type ClassificationAnswers,
} from '@/lib/classification';
import { ThemeToggle } from '../components/ThemeToggle';
import shared from '../shared.module.css';

const DATA_CATEGORY_OPTIONS = [
  { value: 'mnpi', label: 'MNPI' },
  { value: 'client_pii', label: 'Client PII' },
  { value: 'cross_border', label: 'Cross-border transfer' },
  { value: 'fund_nav', label: 'Fund NAV / financials' },
];

type YesNo = boolean | null;

function YesNoButtons({
  value,
  onChange,
  disabled,
}: {
  value: YesNo;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 8 }} role="group">
      <button
        type="button"
        className={shared.btn}
        style={value === true ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' } : undefined}
        onClick={() => onChange(true)}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        Yes
      </button>
      <button
        type="button"
        className={shared.btn}
        style={value === false ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' } : undefined}
        onClick={() => onChange(false)}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        No
      </button>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [owner] = useState('J. Alvarez — verified via SSO'); // MVP stub: real SSO identity binding is a follow-up dependency
  const [team, setTeam] = useState('Due Diligence');
  const [llmProvider, setLlmProvider] = useState('Claude (approved)');
  const [dataCategories, setDataCategories] = useState<string[]>([]);
  const [clientFacing, setClientFacing] = useState(false);

  const [cls, setCls] = useState<ClassificationAnswers>({
    stillExperiment: null,
    namedOwnerAndUsed: null,
    decidesOwnNextMove: null,
    fixedSequence: null,
  });
  const [auto, setAuto] = useState<AutonomyAnswers>({ realExternalEffect: null, producesDraft: null });

  const [affectsNav, setAffectsNav] = useState<YesNo>(null);
  const [marketingUse, setMarketingUse] = useState<YesNo>(null);
  const [writesAuthoritative, setWritesAuthoritative] = useState<YesNo>(null);
  const [outageImpacts, setOutageImpacts] = useState<YesNo>(null);
  const [validatedTruth, setValidatedTruth] = useState<YesNo>(null);
  const [ingestsUntrusted, setIngestsUntrusted] = useState<YesNo>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // D5 (from /plan-eng-review): Owner filled + Step 1 = "still an experiment"
  // is a contradiction. Submission blocks; no computed result is shown.
  const ownerContradiction = owner.trim().length > 0 && cls.stillExperiment === true;

  const classification = useMemo(() => computeClassification(cls), [cls]);
  const autonomyLevel = useMemo(() => computeAutonomyLevel(auto), [auto]);

  const step2Active = cls.stillExperiment === false;
  const techFormActive = cls.stillExperiment === false && cls.namedOwnerAndUsed !== null;
  const step4Active = techFormActive && cls.decidesOwnNextMove === false;
  const autoStep2Active = auto.realExternalEffect === false;

  const riskTier = useMemo(() => {
    if (ownerContradiction) return null;
    return computeRiskTier({
      affectsNavValuationOrTerms: affectsNav === true,
      clientFacingForMarketing: clientFacing && marketingUse === true,
      autonomyLevel,
      dataCategories,
      clientFacing,
      validatedSourceOfTruth: validatedTruth,
      writesAuthoritativeRecord: writesAuthoritative,
      outageImpactsDeliverable: outageImpacts,
      ingestsUntrustedContent: ingestsUntrusted,
      maturityLabel: classification.maturityLabel,
    });
  }, [
    ownerContradiction,
    affectsNav,
    clientFacing,
    marketingUse,
    autonomyLevel,
    dataCategories,
    validatedTruth,
    writesAuthoritative,
    outageImpacts,
    ingestsUntrusted,
    classification.maturityLabel,
  ]);

  function toggleDataCategory(value: string) {
    setDataCategories((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (ownerContradiction) {
      setSubmitError('Resolve the Owner/Classification contradiction before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Not signed in. Sign in first, then submit.');
      }

      const { error } = await supabase.from('register_entries').insert({
        owner_id: user.id,
        owner_name: owner,
        team,
        llm_provider: llmProvider,
        data_categories: dataCategories,
        client_facing: clientFacing,
        existing_sign_off: null,
        cls_step1_still_experiment: cls.stillExperiment,
        cls_step2_named_owner_and_used: cls.namedOwnerAndUsed,
        cls_step3_decides_own_next_move: cls.decidesOwnNextMove,
        cls_step4_fixed_sequence: cls.fixedSequence,
        technical_form: classification.technicalForm,
        maturity_label: classification.maturityLabel,
        auto_step1_real_external_effect: auto.realExternalEffect,
        auto_step2_produces_draft: auto.producesDraft,
        autonomy_level: autonomyLevel,
        hard_trigger_h1_nav_valuation: affectsNav === true,
        hard_trigger_h2_marketing: clientFacing && marketingUse === true,
        validated_source_of_truth: validatedTruth,
        writes_authoritative_record: writesAuthoritative,
        outage_impacts_deliverable: outageImpacts,
        ingests_untrusted_content: ingestsUntrusted,
        risk_tier: riskTier?.tier ?? null,
        risk_tier_reason: riskTier?.reason ?? null,
        status: riskTier?.tier === 'full_review' ? 'assigned' : 'pending',
        owner_contradiction_resolved: true,
      });

      if (error) throw error;

      const tier = riskTier?.tier === 'full_review' ? 'Full-review' : 'Light-touch';
      const classificationDisplay = classification.display ?? 'Unclassified';

      // Redirect to confirmation page with query params
      const params = new URLSearchParams({
        tier,
        classification: classificationDisplay,
        id: 'register-entry-id', // In production, this would be the actual entry ID from the response
      });
      router.push(`/register/confirmation?${params.toString()}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong submitting this entry.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={shared.main}>
      <div className={shared.topbar} style={{ padding: '24px 0' }}>
        <span className={shared.name}>AI Agent Governance Platform — Register Intake</span>
        <ThemeToggle />
      </div>

      <section className={shared.screen}>
        <header className={shared.titlebar}>
          <h1>Register a new agent, workflow, or tool</h1>
          <span className={shared.envBadge}>Internal — Compliance</span>
        </header>

        <form className={shared.body} onSubmit={handleSubmit}>
          <div className={shared.row}>
            <div className={shared.field}>
              <label htmlFor="owner">Owner (you)</label>
              <input id="owner" value={owner} readOnly />
            </div>
            <div className={shared.field}>
              <label htmlFor="team">Team / desk</label>
              <input id="team" value={team} onChange={(e) => setTeam(e.target.value)} />
            </div>
          </div>

          <div className={shared.row}>
            <div className={shared.field}>
              <label htmlFor="llm">LLM / model provider used</label>
              <select id="llm" value={llmProvider} onChange={(e) => setLlmProvider(e.target.value)}>
                <option>Claude (approved)</option>
                <option>GPT-4 (approved)</option>
                <option>Gemini (approved)</option>
              </select>
            </div>
            <div />
          </div>

          <h2 style={{ fontSize: 13.5, fontWeight: 600, margin: '22px 0 5px' }}>
            A few questions about this item
          </h2>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 14 }}>
            Answer honestly — the type below is figured out from your answers, not picked by you.
          </p>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Still an experiment — no assigned owner yet, no commitment to keep it running?
            </div>
            <YesNoButtons value={cls.stillExperiment} onChange={(v) => setCls((s) => ({ ...s, stillExperiment: v, namedOwnerAndUsed: null }))} />
          </div>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10, opacity: step2Active ? 1 : 0.45 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Named owner/team AND used by 2+ people beyond the builder in the last 30 days?
            </div>
            <YesNoButtons
              value={cls.namedOwnerAndUsed}
              onChange={(v) => setCls((s) => ({ ...s, namedOwnerAndUsed: v }))}
              disabled={!step2Active}
            />
          </div>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10, opacity: techFormActive ? 1 : 0.45 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              After you give it an input, does it decide on its own what to do next — without you re-prompting at each step?
            </div>
            <YesNoButtons
              value={cls.decidesOwnNextMove}
              onChange={(v) => setCls((s) => ({ ...s, decidesOwnNextMove: v }))}
              disabled={!techFormActive}
            />
          </div>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10, opacity: step4Active ? 1 : 0.45 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Fixed, human-designed sequence of steps, with the LLM called at one or more points in it?
            </div>
            <YesNoButtons
              value={cls.fixedSequence}
              onChange={(v) => setCls((s) => ({ ...s, fixedSequence: v }))}
              disabled={!step4Active}
            />
          </div>

          {ownerContradiction && (
            <div className={shared.errorInline} role="alert">
              <span className="ic">⚠</span>
              <span className="tx">
                Contradiction detected: you entered an Owner above, but Step 1 says &quot;still an experiment, no
                owner yet.&quot; Resolve before continuing — the record can&apos;t say both.
              </span>
            </div>
          )}

          {!ownerContradiction && classification.display && (
            <div className={shared.result}>
              <div>
                <div className="rl">Computed classification</div>
                <div className="rv">{classification.display}</div>
              </div>
              <div className="rn">
                Sticky — won&apos;t revert to MVP from a quiet month. Re-evaluated only at re-certification.
              </div>
            </div>
          )}

          <div className={shared.row} style={{ marginTop: 18 }}>
            <div className={shared.field}>
              <label>Data categories this touches</label>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12.5 }}>
                {DATA_CATEGORY_OPTIONS.map((opt) => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--ink)' }}>
                    <input
                      type="checkbox"
                      checked={dataCategories.includes(opt.value)}
                      onChange={() => toggleDataCategory(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className={shared.field}>
              <label htmlFor="client-facing">Client-facing?</label>
              <select id="client-facing" value={clientFacing ? 'yes' : 'no'} onChange={(e) => setClientFacing(e.target.value === 'yes')}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          <h2 style={{ fontSize: 13.5, fontWeight: 600, margin: '22px 0 5px' }}>Autonomy level</h2>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 14 }}>
            Same reasoning as above — &quot;Autonomous action&quot; sounds riskier than &quot;Advisory,&quot; so it
            isn&apos;t self-picked either.
          </p>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Does it ever take an action with a real external effect — sending something to a client,
              filing/posting a number to another system, executing a trade, modifying a shared record — without a
              human approving that specific instance first?
            </div>
            <YesNoButtons value={auto.realExternalEffect} onChange={(v) => setAuto((s) => ({ ...s, realExternalEffect: v, producesDraft: null }))} />
          </div>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10, opacity: autoStep2Active ? 1 : 0.45 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Does it produce a specific draft that a named human must explicitly review and approve before it&apos;s
              used or sent anywhere?
            </div>
            <YesNoButtons value={auto.producesDraft} onChange={(v) => setAuto((s) => ({ ...s, producesDraft: v }))} disabled={!autoStep2Active} />
          </div>

          {autonomyLevel && (
            <div className={shared.result}>
              <div>
                <div className="rl">Computed autonomy level</div>
                <div className="rv">
                  {autonomyLevel === 'autonomous_action' ? 'Autonomous action' : autonomyLevel === 'draft_signoff' ? 'Draft + sign-off' : 'Advisory'}
                </div>
              </div>
              <div className="rn">Reviewer of record required before use if Draft + sign-off — see Section 9.</div>
            </div>
          )}

          <h2 style={{ fontSize: 13.5, fontWeight: 600, margin: '22px 0 5px' }}>Risk tier questions</h2>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 14 }}>
            A few more — most of the tier is reused from your answers above.
          </p>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Does its output affect terms offered to a client, a valuation, an allocation, or a fund&apos;s
              NAV/financials?
            </div>
            <YesNoButtons value={affectsNav} onChange={setAffectsNav} />
          </div>

          {clientFacing && (
            <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
              <div style={{ fontSize: 13.5, marginBottom: 9 }}>
                Is it specifically used in, or built to produce content for, marketing materials or investor
                communications?
              </div>
              <YesNoButtons value={marketingUse} onChange={setMarketingUse} />
            </div>
          )}

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Has its output been validated against known-correct answers or checked against a source of truth?
            </div>
            <YesNoButtons value={validatedTruth} onChange={setValidatedTruth} />
          </div>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Does it write or modify a number/record another system or person relies on as authoritative, without
              independent reconciliation?
            </div>
            <YesNoButtons value={writesAuthoritative} onChange={setWritesAuthoritative} />
          </div>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              If it stopped working for a day, would a client deliverable, regulatory filing, or fund-admin process
              due within the next 5 business days be delayed or blocked?
            </div>
            <YesNoButtons value={outageImpacts} onChange={setOutageImpacts} />
          </div>

          <div style={{ border: '1px solid var(--rule)', borderRadius: 7, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>
              Does it ingest documents, emails, or web content from outside the firm that it wasn&apos;t specifically
              designed/tested to handle safely?
            </div>
            <YesNoButtons value={ingestsUntrusted} onChange={setIngestsUntrusted} />
          </div>

          {!ownerContradiction && riskTier && (
            <div className={shared.result}>
              <div>
                <div className="rl">Computed risk tier</div>
                <div className="rv">{riskTier.tier === 'full_review' ? 'Full-review' : 'Light-touch'}</div>
              </div>
              <div className="rn">{riskTier.reason}</div>
            </div>
          )}

          {submitError && (
            <div className={shared.errorInline} role="alert" style={{ marginTop: 16 }}>
              <span className="ic">⚠</span>
              <span className="tx">{submitError}</span>
            </div>
          )}

          <div className={shared.btnbar}>
            <button type="submit" className={`${shared.btn} ${shared.btnPrimary}`} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit for tiering'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
