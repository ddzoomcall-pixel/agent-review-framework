# TODOs

## Success/confirmation states (Register + Dashboard + Audit Export)

**What:** Design and build the missing confirmation states: what an analyst sees right after "Submit for tiering," what a reviewer sees right after making a decision (approve/request-info/require-remediation), and what compliance sees right after generating an audit export.

**Why:** Every primary action in the current mockup ends at a button click with nothing shown after. This is the single largest interaction-state gap found in `/plan-design-review` (2026-07-26) — flagged as Issue 2, left unresolved when the user didn't respond to the initial question.

**Pros:** Closes the biggest state-coverage gap in the design. Directly protects the design doc's own "must not create panic" constraint — the moment right after submission is exactly when an anxious analyst needs clear feedback, and it's currently undesigned.

**Cons:** Three separate states to design (not one), each for a different persona (analyst, reviewer, compliance).

**Context:** See `~/.gstack/projects/Agentreviewframework/Nilay-unknown-design-20260726-170207.md` for the full design doc and `~/.gstack/projects/Agentreviewframework/designs/governance-platform-mockup-20260726/mockup.html` for the current mockup (Screens 1-5, 4.5). The reviewer decision screen (4.5) was added during this review specifically — its own confirmation-after-decision state is part of this same gap.

**Depends on / blocked by:** None — can be designed independently of any other open item.

---

## Remaining unmockuped screens: Light-touch self-service, dispute/reclassification, versioned audit trail diff view

**What:** Design the three screens named in the design doc's Approach B but never mockuped: (1) the Light-touch self-service sign-off lane, (2) the destination for the "Flag for manual reclassification" dispute link, and (3) the versioned audit-trail diff view (field-level change history across re-certifications, T9 in the eng review's Implementation Tasks).

**Why:** These are real, in-scope features (confirmed during `/plan-eng-review`'s TODO triage) with zero visual design behind them yet — an implementer would be improvising all three from scratch.

**Pros:** Completes visual coverage of every feature already committed to in the design doc, rather than leaving three features to be designed ad hoc mid-implementation.

**Cons:** Real design effort — the dispute flow in particular needs its own state machine (open → reviewer picks up → resolved/reclassified), not just a static screen.

**Context:** See the same design doc and mockup referenced above. The reviewer pool + SLA architecture (D2/D7 from `/plan-eng-review`) already gives the dispute flow's owner and turnaround target — the missing piece is purely visual/interaction design, not a new architectural decision.

**Depends on / blocked by:** None.
