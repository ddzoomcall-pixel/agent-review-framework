# Design System — AI Agent Governance Platform

## Product Context
- **What this is:** An internal AI Agent Governance Platform — a register, tiered review workflow, and audit export for AI agents/workflows/tools built by analysts on approved third-party LLMs.
- **Who it's for:** Analysts registering their own agents, a reviewer pool (compliance head + delegates) triaging Full-review items, and compliance/committee members producing audit-ready exports for external auditors and client due diligence.
- **Space/industry:** Financial services (mid-sized firm servicing PE, IB, hedge fund, and VC clients) — internal compliance/GRC tooling.
- **Project type:** Internal admin/dashboard tool (task-focused, data-dense — not a marketing site).
- **Memorable thing:** *Serious software.* Every design decision should reinforce institutional gravity, not startup polish.

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian with a literal "ledger" metaphor — audit-stamp visual language instead of generic SaaS card/pill patterns.
- **Decoration level:** Minimal — typography and three reserved semantic colors do the work; no decorative elements.
- **Mood:** Institutional, precise, trustworthy. Should feel like recordkeeping infrastructure a compliance department would actually use, not a generic B2B dashboard.
- **Reference sites:** None — direction was validated through 2 internal review rounds (`/plan-eng-review`, `/plan-design-review`) rather than competitive research.

## Typography
- **Display/Hero:** Georgia (fallback: 'Iowan Old Style', 'Palatino Linotype', serif) — a serious, institutional serif for headings.
- **Body:** Charter (fallback: 'Iowan Old Style', Georgia, 'Palatino Linotype', serif) — deliberately not a system-UI default; carries the "serious software" mood into every paragraph a person reads.
- **UI/Labels:** Same as body.
- **Data/Tables:** ui-monospace / 'SFMono-Regular' / Consolas — must use `font-variant-numeric: tabular-nums` wherever digits line up in columns.
- **Code:** Same monospace stack as data/tables.
- **Loading:** No external font loading — Charter and Georgia are broadly available system-installed serifs, chosen specifically to avoid an external font-CDN dependency for internal enterprise software. This is a deliberate boring-by-default choice, not an oversight.
- **Scale:** Hero/display 26-38px, section titles 15-19px, body 13-15px, data/mono 10.5-12.5px, micro-labels (mono, uppercase, letter-spaced) 10-11px.

## Color
- **Approach:** Restrained — one accent plus neutrals, with three semantic colors reserved for meaning, never decoration.
- **Primary/Accent:** `#1F5C46` (deep ledger green) — links, primary actions, active states, approvals.
- **Semantic (the "stamp" colors — never used decoratively, only for meaning):**
  - Stamp red `#9C3B32` — blocked, urgent, remediation-required, errors.
  - Stamp gold `#93701F` — conditional, soon-due, pending review.
  - Stamp blue `#2B4A6B` — informational, light-touch tier.
- **Neutrals (light):** background `#E4EAE0`, surface `#F6F8F2`, surface-2 `#EDF1E7`, rule `#C4CFB9`, ink `#17241B`, ink-muted `#4B5C48`.
- **Neutrals (dark):** background `#0E1410`, surface `#141C17`, surface-2 `#1A241D`, rule `#2B3A2E`, ink `#E7EEE4`, ink-muted `#9FB29A`.
- **Semantic tints (light → dark):** accent-tint `#DCE8DE` → `#1C2C22`; stamp-red-tint `#F3E2DF` → `#2E1D1B`; stamp-gold-tint `#F1E7CE` → `#2B2415`; stamp-blue-tint `#DEE6ED` → `#19232C`. Semantic hues stay recognizable in dark mode by brightening (e.g. accent `#1F5C46` → `#4FA37F`) rather than inverting.
- **Dark mode:** token-level redefinition under `[data-theme="dark"]` and `prefers-color-scheme: dark` — never a naive filter/invert. Verified visually in this session (see preview screenshots).

## Spacing
- **Base unit:** 8px.
- **Density:** Comfortable — dense enough for tables/forms, not cramped.
- **Scale:** 2xs(4) xs(6) sm(8) md(12) lg(16) xl(20) 2xl(24) 3xl(32), with larger gaps (36-56px) between major page sections.

## Layout
- **Approach:** Grid-disciplined — dense, predictable tables and forms. This is an APP UI (per `/plan-design-review`'s classifier), not a marketing/editorial layout.
- **Grid:** Two-column form layout on desktop and tablet (768px+); single-column, condensed on mobile (375px).
- **Max content width:** ~1080-1180px for dashboard/table views.
- **Border radius:** sm 4-5px (inputs, chips), md 6-8px (cards, screens), no large/bubbly radii anywhere — matches the AI-slop-avoidance rule against uniform bubbly border-radius.

## Motion
- **Approach:** Minimal-functional — only transitions that aid comprehension (theme toggle fade, focus-ring appearance). No decorative or expressive motion; would undermine "serious software."
- **Easing:** enter (ease-out), exit (ease-in), move (ease-in-out).
- **Duration:** micro 100ms (hover/focus states), short 200ms (theme toggle, panel reveals).

## Accessibility
- Visible `:focus-visible` outline (2px, `--focus: #2B6CB0`) on every interactive element.
- Keyboard tab order follows visual/logical sequence; skipped decision-tree branches are not tab-stops.
- ARIA: `aria-live="polite"` on computed-result boxes so screen readers announce derived classification/tier as it updates.
- Tables use semantic `<table>` markup with proper header cells.
- Color contrast: palette chosen for high contrast (dark ink on near-white / light ink on near-black); must be verified against WCAG 4.5:1 with an actual contrast tool during implementation, not assumed from this document.
- Touch targets: 44px minimum on mobile.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-26 | Initial design system created | Formalizes the direction validated across `/office-hours`, `/plan-eng-review`, and `/plan-design-review` for the AI Agent Governance Platform — not a fresh proposal, a ratification of what already survived review. |
| 2026-07-26 | Charter/Georgia serif system over sans-serif default | Deliberate risk: signals institutional gravity ("serious software") that most compliance tools, which default to sans-serif dashboards, don't have. |
| 2026-07-26 | Ledger/stamp metaphor over generic SaaS card/pill patterns | Deliberate risk: reinforces the tool's identity as recordkeeping infrastructure rather than a generic B2B dashboard. |
