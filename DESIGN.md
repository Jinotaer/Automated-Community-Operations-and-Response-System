# Design System: ACORS Staff Portal — Automated Community Operations & Response System

> Single source of truth for Google Stitch screen generation. This document encodes the premium, non-generic design language for the ACORS Staff-facing web portal (Barangay / LGU / Admin). All new screens must be prompted through these tokens.

---

## 1. Visual Theme & Atmosphere

**Atmosphere:** *"Civic Authority, Warmly Accessible" — a restrained, trustworthy institutional interface that feels like a legitimate government operations console, not a startup dashboard.*

Imagine a well-lit municipal operations center at 9 AM: quiet, orderly, matte-paper clean, with deep crimson wayfinding. Airy but not empty. Confident but not loud. Every element earns its space.

- **Density: 4 / 10 — Daily App Balanced**  
  Generous whitespace around hero and cards. Content breathes. No cockpit clutter. The landing page is intentionally sparse: one centered hero block + three portal cards + minimal footer. Negative space signals authority.

- **Variance: 3 / 10 — Predictable Symmetric (Intentionally Restrained)**  
  Centered, symmetrical hero and equal-width card grid on desktop. This is a GOVERNMENT system — asymmetry would undermine trust. Symmetry = fairness, stability, legibility. Variance is deliberately kept low; novelty comes from material quality, not chaotic layout.

- **Motion: 4 / 10 — Fluid CSS Restrained**  
  Subtle, single-purpose transitions only: 220–300ms ease-out for card elevation, arrow nudge (4px), border tint. No scroll-jacking, no parallax, no hero entrance choreography. Hover is tactile, not theatrical.

**Design Philosophy:** Clean institutional minimalism. No decorative gradients, no glassmorphism, no neon. Depth comes from layered whites, soft shadows tinted to the slate background hue, and a single deep-crimson accent used surgically. The page should be instantly recognizable as OFFICIAL without feeling bureaucratic or cold.

**Stitch Prompt Keywords:** `government design system, municipal operations console, restrained institutional, matte paper texture, deep crimson accent, airy centered hero, equal card grid, trustworthy minimal, accessible, civic service`

---

## 2. Color Palette & Roles

> Single-palette system. Absolute neutral base (Slate/Zinc). ONE accent family (deep crimson reds). Saturation of primary < 80%. No purple, no neon, no warm/cool gray fluctuation. Never pure black.

- **App Canvas** (#F8FAFC) — *Slate-50* — Primary page background. Cool, almost-white with a whisper of blue-grey. Used for full viewport fill. Matte, paper-like, reduces eye fatigue over long sessions. Not warm beige.

- **Pure Surface** (#FFFFFF) — *Card & container fill* — All portal cards, login panels, modals. Crisp elevation against canvas. Always paired with 1px Whisper Border + diffused shadow.

- **Charcoal Ink** (#1E293B) — *Slate-800, Primary Text* — Headings, card titles, body copy titles. Deep blue-charcoal, not pure black. High contrast (15.8:1 on white) for WCAG AAA legibility.

- **Muted Steel** (#64748B) — *Slate-500, Secondary Text* — Descriptions, subheadings, supporting copy, metadata, footer text. Never place Muted Steel on App Canvas below 14px without 4.5:1 check (it passes at 16px).

- **Whisper Border** (rgba(226,232,240,0.9)) / hex #E2E8F0 — *Structural 1px lines* — Card borders, dividers, input borders in idle state. Tinted to background hue so shadows and borders harmonize. Opacity 90% on cards; 50% on subtle dividers.

- **Deep ACORS Crimson** (#8B0000) — *Primary Brand / Accent — THE ONLY saturated accent* — Primary CTA buttons, active icon containers, ACORS wordmark "O" tint, focus rings, selected/hover border tint. Deep, bureau-red with saturation ~100% hue but perceived as restrained due to dark value (not neon). Use sparingly: buttons, icon badges, hover accent only. Never as page background.

- **Crimson Hover** (#6B0000) — *Primary Hover/Active* — Button hover, pressed state. 12% darker than Deep Crimson. Paired with `translate-y-[1px]` tactile press.

- **Secondary Crimson** (#B91C1C) — *Red-700, Subtle Accent Variant* — Icon glyph color inside light crimson pill, inline hover links ("Request access"), secondary badge text. Used inside `bg-red-50` containers, never as solid button fill except for small badges.

- **Crimson Wash** (#FEF2F2) → (#FFF1F2) — *Light accent surface* — `bg-red-50` for icon containers (`h-14 w-14 rounded-2xl bg-red-50 border border-red-100`). Provides soft warmth around the sole accent without flooding the page.

- **Success Green** (#16A34A) — *Green-600, Status only* — Resolved badges, success toasts. Never as CTA.

- **Warning Amber** (#F59E0B) — *Amber-500, Status only* — Pending/escalated badges. Never as CTA.

**Banned Palette Patterns:**
- NO purple/blue neon (#7C3AED, #3B82F6 glow) — strictly forbidden. No gradient buttons, no outer glow shadows.
- NO oversaturated accent above 80% saturation at mid-lightness — #8B0000 is dark enough to pass, but #EF4444 as large fill is banned.
- NO pure black (#000000) — use #1E293B or #0F172A.
- NO warm/cool gray mixing — slate family only (no zinc-200 + slate-200 confusion). Stick to Slate.
- NO full-red page backgrounds — red appears only on buttons (max 3 per viewport) and small badges. Page stays 90% neutral.

---

## 3. Typography Rules

> Font loading: `Geist` (sans) + `Geist Mono` (mono) via Google Fonts. Already configured in `frontend/index.html:11`. Never load Inter. No serif in staff portal.

- **Display / Headlines — `Geist` (800–900 weight, tracking-tight)**
  - Landing Hero `H1`: `text-[clamp(2rem,5vw,2.75rem)] font-extrabold tracking-tight leading-[1.05] text-[#1E293B]`
  - Max 65ch. Hierarchy through weight + color, not size inflation. Never exceed 3xl on landing hero — restraint signals credibility.
  - `AC<span class="text-[#8B0000]">O</span>RS` wordmark: Geist 800, tight tracking, crimson "O" as sole color break.

- **Subheading / Eyebrow — `Geist` (600–700, uppercase small tracking)**
  - `"STAFF PORTAL"` badge: `text-[11px] font-bold tracking-[0.18em] uppercase`
  - Secondary: `text-sm leading-6 text-slate-500` for supporting copy. Relaxed leading (`leading-7`).

- **Body — `Geist` (400–500, leading-relaxed)**
  - Card descriptions: `text-[13px] leading-[1.7] text-[#64748B]`
  - Limit 65ch, `max-w-prose` centered for hero paragraph.
  - Never use sub-14px body except for legal footer (`text-[11px]`).

- **Mono — `Geist Mono` (400–700)**
  - Only for metadata: timestamps (`SYNCED 09:41 AM`), complaint IDs (`CMP-2026-001`), stats, badge counts.
  - High-density override: When data tables exceed 7 rows, ALL numbers switch to mono (`font-mono tabular-nums`).
  - Never use mono for hero or long descriptions.

- **Scale & Clamp:**
  - Hero H1 must use `clamp()` for fluid scaling: `clamp(1.875rem, 4vw + 1rem, 2.75rem)` — guarantees min 30px on mobile, max 44px on desktop. Body text minimum `14px / 0.875rem`.

- **Banned Typography:**
  - `Inter` — BANNED for premium/creative contexts (generic AI tell). Enforced.
  - Generic serifs (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`) — BANNED outright. If serif were needed editorially (not here), only `Fraunces`, `Gambarino`, `Editorial New`, `Instrument Serif` allowed. Staff portal is software UI: **Serif BANNED entirely — sans + mono only.**
  - No gradient text on H1 (solid charcoal only).
  - No fake letter-spacing exaggeration — tight (`-0.02em`) for display, normal for body.

---

## 4. Component Stylings

### Header (Staff Portal Top Bar)
- **Shape:** Full-width `h-16 sm:h-20`, sticky top, `bg-white/80 backdrop-blur-md border-b border-slate-200/70`. No shadow on scroll—border defines separation.
- **Layout:** Left: `ApplicationLogo` (h-10 w-auto) + wordmark stack. Center: minimal tagline on desktop (`Automated Community Operations & Response System` — `text-[11px] tracking-wide text-slate-400 hidden lg:block`). Right: `Staff Portal` badge — `rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-red-700`.
- **Behavior:** No hamburger menu. Minimal navigation on purpose. Optional right link "Resident? → Citizen Portal" as ghost text link (`text-xs font-semibold text-slate-400 hover:text-slate-700`). Never add search, notification bell, or extra nav to landing page.

### Hero Section (Centered)
- **Structure:** `max-w-3xl mx-auto text-center px-6 py-10 sm:py-14`. Vertically centered via `flex min-h-[calc(100dvh-...)] flex-col items-center justify-center` — but hero itself is `text-center`.
- **Eyebrow Badge:** `inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-slate-600` — optional live dot (`h-1.5 w-1.5 rounded-full bg-[#8B0000] animate-pulse`).
- **Title:** `"Welcome to ACORS"` — Geist 800, centered. No inline image decoration on this government hero (restrained variant). Creative inline-image typography is INTENTIONALLY SUPPRESSED here — trust over whimsy.
- **Subheading:** `"Select your portal to continue"` — `text-[15px] font-semibold text-slate-800 mt-3`
- **Supporting:** `"Access the tools..."` — `mt-3 text-sm leading-7 text-slate-500 max-w-xl mx-auto` — short, 1–2 lines, centered.
- **CTA Rule:** NO CTA in hero. The three cards ARE the CTA. Max restraint: hero pulls, cards convert.

### Portal Cards (Primary Component — The Core Interaction)
- **Count & Role:** Exactly three cards: Barangay, LGU (Department), Admin. Equal visual weight — no featured card.
- **Shape:** `bg-white rounded-[2rem] border border-slate-200/80 p-6 sm:p-7 text-left`
- **Shadow:** `shadow-[0_8px_24px_rgba(15,23,42,0.06)]` idle; tint shadow to background hue (slate), not black. Hover: `shadow-[0_16px_40px_rgba(15,23,42,0.10)]` + `border-red-200` + `translate-y-[-4px]`.
- **Transition:** `transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]` (spring-like, not linear).
- **Internal Anatomy (top → bottom, 20–24px gaps):**
  1. **Eyebrow Tier Label:** `text-[10px] font-extrabold tracking-[0.16em] uppercase text-slate-400` — e.g., `TIER 1 · BARANGAY` / `TIER 2 · LGU OFFICES` / `SYSTEM · ADMINISTRATION`
  2. **Icon Badge:** `h-14 w-14 rounded-2xl bg-[#FEF2F2] border border-red-100 flex items-center justify-center text-[#8B0000]` — Lucide icons size 22–24, stroke 1.8. No emoji. Icons: `Building2` (Barangay), `Landmark` (LGU), `Settings2` / `ShieldCheck` (Admin).
  3. **Title:** `text-[17px] font-extrabold tracking-tight text-[#1E293B]` — e.g., `Barangay Portal`
  4. **Description:** `mt-2 text-[13px] leading-[1.65] text-[#64748B] min-h-[42px]` — 1–2 sentences, sentence case, no jargon.
  5. **Action Button:** `mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8B0000] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(139,0,0,0.18)] transition hover:bg-[#6B0000] hover:shadow-[0_14px_28px_rgba(139,0,0,0.24)] active:translate-y-px` — Label `Enter Barangay Portal` + `ArrowRight` icon (16px, `group-hover:translate-x-1 transition-transform`). Arrow movement is 4px max, 240ms ease-out. No arrow rotation, no bounce.
  6. **Helper Link:** OPTIONAL micro link below button: `text-[11px] font-medium text-slate-400 text-center` — e.g., `5 demo barangays available` — ghost, non-essential.

- **Hover Behaviors:**
  - Card lifts 4px, border tints red-200, shadow deepens.
  - Arrow translates `4px` right via `group-hover:translate-x-1`.
  - Icon badge: subtle `scale-[1.04]` + `bg-red-50 → bg-red-100` shift (optional, not flashy).
  - NO neon glow, NO scale 105% card zoom, NO rotation, NO gradient sweep.

- **Focus/Active:**
  - Keyboard focus: `focus-visible:ring-4 focus-visible:ring-red-600/15 focus-visible:border-red-600`
  - Active press: button `translate-y-px` + `shadow-sm`.

### Buttons (Global)
- **Primary:** Solid Deep Crimson fill as above. Tactile `-1px` translate on active. No outer glow.
- **Secondary/Ghost:** `border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300`. Used only for auxiliary links (e.g., "Resident Portal" header link).
- **Banned Button Patterns:** Neon outer shadow, pill with gradient, custom mouse cursors, 3D extrusion.

### Cards vs. Alternatives
- Cards are JUSTIFIED here because elevation communicates choice hierarchy (choose your portal). High-density dashboard lists would replace cards with `border-t` dividers — but landing page is low-density chooser, so cards are correct.

### Inputs / Forms (Not on Landing, but System-Wide)
- Label above input (`text-sm font-semibold text-zinc-800`), helper optional, error below (`text-xs font-medium text-red-600`). `rounded-2xl border border-zinc-200 bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/10`. Standard `gap-4`. No floating labels.

### Loading / Empty / Error States
- **Loaders:** Skeletal shimmer matching card dimensions: `animate-pulse bg-slate-100 rounded-[2rem] h-64`. Never generic circular spinners on landing.
- **Empty:** N/A for landing (always 3 cards).
- **Error (on login targets, not landing):** Inline `rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700`. Role-guarded messages: `"Unauthorized Access — Your account is not authorized to access the Barangay Portal."` with `ShieldAlert` icon.

### Footer
- Minimal centered block: `border-t border-slate-200/70 bg-white py-10 text-center`
- Tagline: `text-sm font-bold tracking-tight text-slate-900` — `ACORS` + `Automated Community Operations & Response System` + `Community concerns. Local action. Better response.` (`text-xs italic text-slate-500`)
- Copyright: `© 2026 ACORS` — `text-[11px] tracking-wide text-slate-400`
- No sitemap columns, no newsletter signup, no social icons (government minimal).

---

## 5. Layout Principles

- **Grid-First, Never Flex-Hack:** Hero + Cards use CSS Grid. Never `calc()` percentage math. Desktop card row: `grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 max-w-[1120px] mx-auto`. Tablet maintains 3-col if ≥ 900px, otherwise 2+1 wrap; Mobile (`< 768px`) collapses strictly to single column, full-width with `mx-5`.

- **Containment:** All content contained via `max-w-[1120px] mx-auto px-6` (landing) or `max-w-[1280px]` for dashboards. No full-bleed text blocks.

- **Spacing Philosophy — Generous, Proportional, Clamped:**
  - Section vertical rhythm: `clamp(2.5rem, 6vw, 4.5rem)` between header → hero → cards → footer.
  - Card internal padding: `p-6 sm:p-7` (24–28px). Card gap: `gap-6`.
  - Mobile section gaps reduce via `clamp()` — never fixed `py-20` that breaks on 375px.

- **No Overlapping Elements:** Every element occupies its own spatial zone. No absolute-positioned text over images. Hero image (if ever used) is SEPARATE section, not backdrop behind headline. Landing page uses NO hero image — solid canvas keeps focus on choice.

- **Equal Card Mandate:** The generic "3 equal cards horizontally" is ALLOWED here — this is the intentional exception. The spec explicitly requires three identical portal cards. Elsewhere (feature grids, dashboard stats), 3-equal-cards would be BANNED in favor of 2-col zigzag or asymmetrical bento. Documenting this exception prevents mis-application.

- **Full-Height Rule:** Any full-viewport section must use `min-h-[100dvh]` — never `h-screen` (iOS Safari address-bar jump). Landing page wrapper: `min-h-[100dvh] flex flex-col`.

- **Responsive Collapse (< 768px):**
  - 3-col grid → 1-col stack.
  - Icon + title remain horizontal? No — stack vertically on card as well (icon above title) even on mobile — preserves hierarchy.
  - Buttons remain full-width, `py-3.5`, `min-h-[44px]` tap target.
  - Typography clamp scales down fluidly; no horizontal scroll.

---

## 6. Motion & Interaction

- **Spring Physics (default for interactive elements):** `stiffness: 100, damping: 20` — weighty, premium, not bouncy. CSS equivalent: `transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1)`. Use for card lift, border tint, arrow slide, button press. NO linear easing.

- **Entrance Orchestration (Stagger):**
  - Header: `animate-fade-up` (0ms)
  - Hero badge/title: `animate-fade-up` (80ms)
  - Hero supporting text: `animate-fade-up` (160ms)
  - Cards: cascade `delay: index * 90ms` (0ms, 90ms, 180ms) — waterfall reveal, not simultaneous pop.
  - Footer: `animate-fade-up` (320ms)
  - Keyframes defined in `src/index.css` (`fade-up: 0.8s cubic-bezier(...)`).

- **Perpetual Micro-Interactions (Subtle, One per View):**
  - Active portal card icon: *very subtle* float or pulse is ALLOWED but restrained — e.g., `animate-[float_6s_ease-in-out_infinite]` with `transform: translateY(±2px)` only. Alternate: live-dot pulse (`animate-ping` on 6px dot). Never both.
  - Never apply infinite loops to all three cards simultaneously — pick the hovered card only.

- **Hover Timings:** `duration-300` for card, `duration-200` for arrow. Child arrow inherits group hover — no independent delay.

- **Performance & Isolation:**
  - Animate exclusively via `transform` (`translateY`, `translateX`, `scale`) and `opacity`. Never animate `top`, `left`, `width`, `height`, `margin`.
  - `will-change: transform` implicitly via Tailwind’s transform utilities; no manual addition needed.
  - Grain/noise textures (if used) must be on `fixed` pseudo-element with `pointer-events: none`, not on scrolling content.

- **Reduced Motion:** Respect `prefers-reduced-motion` — via `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important } }` already in `index.css:52`. Motion degrades to simple opacity crossfade when reduced.

- **Interaction Affordance:** Cards have ZERO ambiguity — entire card is NOT clickable; only button navigates. This prevents accidental role confusion. Button has `cursor-pointer` + strong fill contrast. Card hover is decorative, not functional.

---

## 7. Anti-Patterns (Banned — NEVER DO)

These are load-bearing quality gates. Violating any of these regresses the interface to generic AI slop.

- **No emojis** anywhere (use Lucide `lucide-react` icons only — `Building2`, `Landmark`, `Settings2`, `ShieldAlert`, `ArrowRight`).
- **No `Inter` font** — enforced via `Geist` + `Geist Mono` stack only.
- **No generic serif fonts** (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`) — serif BANNED entirely in staff portal (sans + mono only).
- **No pure black** (`#000000`) — use `#1E293B` or `Zinc-950 (#09090B)`.
- **No neon / outer glow shadows** (`shadow-[0_0_20px_rgba(139,0,0,0.8)]` or purple glows) — shadows must be diffused slate tint.
- **No oversaturated accents** — no `#EF4444` large fills, no `#FF0000` text. Crimson limited to buttons + badges.
- **No excessive gradient text** on large headers — solid charcoal only.
- **No custom mouse cursors** (e.g., `cursor-none` with vinyl disc follower).
- **No overlapping elements** — clean spatial separation always; text never over image.
- **No bouncing chevrons / “Scroll to explore” / “Swipe down” filler** — content pulls naturally.
- **No 3-column equal card layouts generically** — EXCEPT the landing portal chooser (documented exception); elsewhere use zig-zag / asymmetry.
- **No generic names** (“John Doe”, “Acme Corp”, “Nexus”) — use realistic Philippine LGU context: `Barangay Casisang`, `City Engineering Office`, `Hon. Juan Dela Cruz`.
- **No fake round numbers** (`99.99%`, `50%` without source) — if stats appear, use plausible city data (`1,248 reports · 972 resolved`) tied to store.
- **No AI copywriting clichés** (“Elevate”, “Seamless”, “Unleash”, “Next-Gen”, “Empower”, “Cutting-Edge”) — use plain civic language: `Receive`, `Review`, `Manage`, `Resolve`.
- **No broken Unsplash links** — use `picsum.photos` or local `src/assets/*` or SVG avatars only. Landing page uses NO external images.
- **No centered Hero** generically for high-variance projects — ALLOWED here because Variance=3 (symmetry is intentional for institutional trust).
- **No full-card click target** — navigation only via explicit button (`Enter Portal →`) to reinforce auth boundary.
- **No excessive animation** — no marquee, no typewriter on hero, no card tilt-on-mouse-move.

---

## 8. Implementation Notes for Stitch Prompting

When prompting Stitch, use this invocation pattern with the tokens above:

> *Prompt Stitch:* “Generate a new ACORS Staff Portal landing screen (desktop + mobile) using the ACORS Design System defined in DESIGN.md. Atmosphere: civic authority, balanced density (4), symmetric variance (3), restrained motion (4). Palette: Slate-50 canvas #F8FAFC, white cards, charcoal ink #1E293B, muted steel #64748B, single Deep Crimson accent #8B0000. Typography: Geist sans + Geist Mono only. Layout: centered hero (Welcome to ACORS / Select your portal…) + 3 equal portal cards (Barangay / LGU / Admin) with red-wash icon badges and crimson solid buttons, max-width 1120px, single-column collapse <768px. Apply stagger entrance, 300ms spring hover, no emojis, no neon, no centered-hero ban (variance low), accessible 44px tap targets.”

Reuse `ApplicationLogo` (`src/Components/ApplicationLogo.jsx:1`), `lucide-react`, and Tailwind 4.x tokens. All routes must point to existing auth entries: `/barangay/login`, `/department/login`, `/admin/login`.

---

*Generated for ACORS Staff Portal Landing — preserves Resident mobile app, reuses existing dark-red identity, adds only the staff entry router and portal chooser.*
