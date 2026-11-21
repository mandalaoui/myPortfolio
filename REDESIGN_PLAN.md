# Portfolio Redesign Plan (branch `v2-redesign`)

Status snapshot as of 2026-11-21. Working branch is `v2-redesign`, currently 5 commits
ahead of `origin/v2-redesign` (not pushed):

```
(next)  Redesign v2: zoom transitions on mobile, Projects swipe row
fa078a1 Redesign v2: zoom-forward scroll transitions
7f3624e Redesign v2: fix About/Projects contrast and polish colors
c390e1a Fix navbar: RTL order, logo, mobile menu opacity
9add4fd Redesign v2: light theme, Cool Sky background, bilingual nav scaffold
```

## Goals

- Full visual + content redesign of the portfolio, done in isolated layers with
  explicit approval between each layer (not all at once).
- Everything free — no paid services/APIs required for the base site.
- Reposition the site around the **AI Solutions Engineer** role (started
  November 2026), while keeping full-stack development work visible.
- Move from the old dark "cyberpunk" theme to a light theme.
- Bilingual: English (default) and Hebrew, with proper RTL mirroring.

## Background direction (long iteration, now final)

Rejected directions, in order, with the reason each was dropped:

1. Full saturated sky-blue background with a white grid/dot pattern —
   looked like a consumer/kids app next to the white project cards.
2. Plain flat white background — read as boring/generic.
3. Light-mode neural network / bokeh particle field — too much visual noise,
   fought with the content.
4. Faceted / low-poly geometric background — too static/flat once combined
   with real content.

**Final direction — "Cool Sky" gradient:**

- Colors: `#2980B9` → `#6DD5FA` → a near-white (`#CDECFA`-ish), diagonal.
- The gradient is **locked to real viewport height, not section height**,
  because section heights vary with content. A plain CSS `linear-gradient`
  cannot flip its own diagonal orientation within a repeating tile (its axis
  always spans the full background box), so the implementation is a small
  inline SVG (`background-image: url("data:image/svg+xml,...")`) containing
  two gradients — screen 1 runs top-left(blue) → bottom-right(light), screen 2
  mirrors it bottom-left(blue) → top-right(light) — tiled with
  `background-size: 100% 200vh; background-repeat: repeat-y;`. This repeats
  the alternating diagonal every two real viewport heights, however tall the
  page gets.
- **Since `fa078a1`:** the gradient no longer lives on `body`. It is on a
  fixed `.sky-bg` layer (300vh tall, i.e. one extra 200vh tile) that
  `zoomTransition.js` moves with `translateY` by the scroll distance *minus*
  the distance spent inside zoom transitions. Effect: the background follows
  normal scrolling but stands still during a zoom, so the zoom reads as moving
  forward instead of scrolling down. `body` keeps only a flat `#6dd5fa`
  fallback color.
- Text color strategy: most on-page text is white, with a multi-directional
  dark `text-shadow` (an "outline" effect) so it stays legible whether it
  lands on the dark or the light part of the gradient. Cards (project cards,
  timeline cards, skill cards, contact items) are solid white with normal dark
  text inside them — no special handling needed there.
- Old dark-theme decorative grid/particle background (`techBg.js`,
  `.tech-background`) was removed entirely; no grid/particles in the final
  design, just the gradient.

## Scroll choreography — IMPLEMENTED (desktop `fa078a1`, mobile in the following commit), placeholders remain

The full page-scroll sequence agreed on in conversation. All three zoom
transitions are live on the site; two of them zoom into **temporary
placeholder scenes** (AI Avatar, AI Hub) that will be swapped for the real
designs later without touching the transition code. The Projects sideways
scroll (`assets/js/projects.js`) is the pre-existing vanilla-JS mechanism
from before the redesign, now adjusted (see Step 2 below).

The sequence, top to bottom:

1. **Hero** (full screen) — eyebrow, headline, description. *(Built.)*
2. **↓ zoom transition** → **AI Avatar scene** (`#avatar`). *(Transition
   built. Scene is a TEMPORARY placeholder: the real photo + AI-core rings,
   an "Online now" chip, a "Chat with AI Omer" heading and the placeholder
   chat chip. The real avatar + chat scene is still deferred to the end.)*
3. **↓ normal scroll** → **About Me**. *(Built.)*
4. **↓ normal scroll** → giant full-screen **"Projects" title** card
   (`#projects-title`). *(Built, EN/HE. It is now the section's only heading;
   the old in-section `<h2 class="section-title">Projects</h2>` was removed.)*
5. **↓ zoom transition** → **Projects**, where sideways scroll moves between
   project cards. *(Built. Desktop: scrolling down drives the cards sideways.
   Mobile: a native swipe row instead — see "Mobile" below.)*
6. **↓ normal scroll** → giant full-screen **"AI" title** card (`#ai-title`).
   *(Built.)*
7. **↓ zoom transition** → **AI Hub** (`#ai-hub`). *(Transition built. Hub
   is a TEMPORARY "Coming soon" placeholder until Layer 5 is designed —
   reels / grid / hybrid is still an open decision.)*
8. **↓ normal scroll** → **Technical Stack** (bowl-shaped carousel still to
   do — Layer 6).
9. **↓ normal scroll** → **Resume** and **Contact**, unchanged.

**Why the zoom-forward technique was chosen:** early in the background
discussion, a reference site (superplay.co) was looked at for a scroll style
that feels like moving forward into the screen rather than scrolling down or
sideways. The mechanism is GSAP ScrollTrigger pinning a section
(`pin: true`) while scaling/fading content based on scroll progress through
that pinned range, giving the sensation of zooming into the next scene. It
was deliberately scoped to a **few key transition points only** (the ones
listed above), not the whole site, since pinning every section hurts SEO,
accessibility, and mobile scroll feel (iOS Safari in particular).

## Implementation steps — scroll transitions (zoom-forward)

**Status: Steps 1 and 2 done (desktop `fa078a1`, mobile in the following
commit). QA (item 9) is being done by the user.** The original plan is kept below for reference; the "As built"
notes record where the implementation differs from it and why.

### As built — `assets/js/zoomTransition.js`

- API: `ZoomTransition.create({ outgoing, incoming, length = 1.2, split = 0.5,
  overlap = 0.1, scaleOut = 1.35, scaleIn = 0.75 })`, plus `refresh()` and
  `scrollTargetFor(el)`. Called from an inline script at the end of
  `index.html` for the three transitions.
- Recipe: over a pinned range of `length` viewport heights, the outgoing
  section scales 1 → 1.35 and fades out (first half); the incoming section
  scales 0.75 → 1 and fades in (second half, 0.1 crossfade). Transform origin
  is the viewport center.
- **Outgoing** section: GSAP ScrollTrigger pin with `pinSpacing: true` (its
  spacer provides the extra scroll distance).
- **Incoming** section: *not* a GSAP pin. It is pulled up by the outgoing
  section's height (negative margin) so its top lands at the viewport top
  exactly when the range ends, and during the range it is held with plain
  `position: fixed` (an empty placeholder keeps its height in the flow).
  Why, after two failed attempts:
  1. Counter-scrolling it with `translateY` jittered (JS transform lags one
     frame behind native scrolling — very visible on the Projects cards).
  2. A GSAP pin left the section offset by a leftover `transform` after the
     pin ended, which broke `position: sticky` inside it (Projects cards
     drifted down while scrolling sideways).
- `scrub: true` (no smoothing). A smoothed scrub (0.5) lagged behind the
  scrollbar, so scrolling back up showed half-faded / still-scaled content
  moving with normal scroll.
- Runs on desktop **and mobile**; disabled (plain scroll + existing
  fade-ups) only with `prefers-reduced-motion`, via `gsap.matchMedia()`. The
  original plan turned it off below `37.5rem`; that was reversed by the
  user's decision — see "Mobile" below.
- Outgoing sections taller than the screen (the Hero on a phone) are pinned
  when their *bottom* reaches the bottom of the screen (`'bottom bottom'`),
  so all their content is seen before the zoom; the overlap, transform
  origin and nav landing point account for that.
- Navigation: `navigation.js` asks `ZoomTransition.scrollTargetFor()` for
  sections inside a transition (outgoing → start of range, incoming → end of
  range). Deep links (`/#projects`) are corrected once after load + fonts.
- Re-measures on `langchange` (EN/HE text lengths change heights) and after
  `projectsRenderer.js` renders the cards.
- Also drives the `.sky-bg` background layer (see "Background direction").

### Mobile (follow-up commit after `fa078a1`)

- Zoom transitions enabled on phones. `ScrollTrigger.config({
  ignoreMobileResize: true })` so the address bar showing/hiding doesn't
  re-measure everything. Hero and scenes use `min-height: 100svh` (stable
  height that ignores the address bar).
- `ScrollTrigger.normalizeScroll(true)` was tried and **removed** — kept off
  deliberately (it was the risky part, and initially looked like the cause of
  the next bug). If pins feel jumpy on a real phone, it can be retried in
  `setupTouch()` in `zoomTransition.js`.
- Bug fixed: the zoomed-out (invisible, scaled ×1.35) outgoing section kept
  sticking out sideways, making the page wider than the phone; the mobile
  browser zoomed out and the footer could not be reached. Fixed with
  `overflow-x: clip` on `main` (`clip`, not `hidden`, so `main` doesn't
  become a scroll container and Projects' `position: sticky` keeps working).
- Hero on mobile: full screen (`100svh`) with content centered vertically
  (was `min-height: auto`, stuck to the top).
- **Projects on mobile:** instead of the old vertical list of 14 cards, one
  swipeable row — native horizontal scroll with `scroll-snap` (each card 85vw,
  snaps to center, next card peeks in), scrollbar hidden, direction flips
  automatically in Hebrew. The section is full screen with the row centered
  vertically, top padding clearing the fixed header. `projects.js` skips the
  scroll-driven sideways movement when the container is itself a scroller.
  Desktop unchanged. Optional position dots were offered, not built.

### Step 1 — Build the scroll-transition mechanism (generic, reusable) — DONE

1. Define the exact visual recipe: outgoing section scales up + fades out while
   the incoming section scales from small → 100% and fades in, tied to scroll
   progress through a pinned range. Decide the split of the pin's scroll
   distance between "outgoing" and "incoming" halves.
2. Build one reusable module, `assets/js/zoomTransition.js`, wrapping GSAP
   `ScrollTrigger` with `pin: true`. Parameters: outgoing section selector,
   incoming section selector, pin length, scale amount — so every transition
   point below calls this one function instead of duplicating ScrollTrigger
   setup.
3. Define a mobile fallback: below a chosen breakpoint, skip the pin/scale
   entirely (pinning hurts scroll feel on iOS Safari in particular) and fall
   back to the existing plain fade-up (`animations.js`). *(Built, then
   reversed: zoom now runs on mobile too — see "Mobile" above.)*
4. Respect `prefers-reduced-motion`: skip the pin/scale and use plain scroll
   when the user has that preference set.
5. Validate the mechanism in isolation first, on a pair of placeholder `<div>`
   sections, before wiring it to real content — confirm the zoom feel, a
   reasonable scroll distance, and that it doesn't break normal scrolling,
   anchor-link navigation, or the existing `scrollRestoration` handling in
   `assets/js/opener.js`.

### Step 2 — Apply it at the relevant transition points — DONE

All three are wired; 6 and 8 use the temporary placeholders described below.
Projects changes made along the way (`projects.js` / `styles.css`):

- Sideways progress is clamped to 0–1 instead of ignored outside that range,
  so jumping past the section never leaves the cards mid-way.
- Direction follows the page direction: EN moves the cards left (first card
  starts on the left), HE mirrors it (first card starts on the right). The
  first/last card spacing uses `margin-inline-start/end`.
- Slowed down: `.projects-section` height 256vh → 320vh (~3.5 → ~2.5px
  sideways per 1px scrolled at 14 cards).

Original plan:

6. **Hero → AI Avatar scene** (sequence step 2) — **blocked**: the full-screen
   avatar + chat scene doesn't exist yet, and is separate from the
   real-photo AI-core treatment already on the live Hero. Cannot be wired
   until that scene is built.
   - *Temporary placeholder, until the real avatar scene is designed:* a
     plain full-screen section with a centered static avatar image
     (reuse the existing profile photo + AI-core ring treatment from Hero),
     a heading ("Chat with AI Omer" / Hebrew equivalent), and the existing
     placeholder chat chip — just enough markup to have a real second
     section to zoom into and validate the transition end-to-end, swapped
     for the real scene later without touching the transition code.
7. **Projects title → Projects (sideways scroll)** (sequence steps 4+5) —
   **buildable now**:
   - Build a full-screen "Projects" title card.
   - Wire `zoomTransition.js` between the title card and the existing
     Projects section, so the pre-existing sideways-scroll mechanism
     (`assets/js/projects.js`) takes over unchanged once the zoom completes.
8. **AI title → AI Hub** (sequence steps 6+7) — **blocked**: the whole AI Hub
   section (Layer 5) doesn't exist yet, and how to present it (reels-style,
   grid, or hybrid) is still an open decision.
   - *Temporary placeholder, until Layer 5 is designed:* a full-screen "AI"
     title card leading into a minimal placeholder section (e.g. a short
     "Coming soon" note or a simple grid of any AI-related links/videos
     already available), just so the transition has a real target to zoom
     into; replaced wholesale once Layer 5 is actually designed.
9. QA pass on each transition point that gets implemented: desktop + mobile
   (including the no-pin fallback), English + Hebrew, and with/without
   `prefers-reduced-motion`. **In progress — done by the user.** Not checked
   by Claude: `prefers-reduced-motion` and live window resizing (the built-in
   browser can't emulate either), and the feel on a real phone (iPhone +
   Android): pins while scrolling, the address bar showing/hiding, and the
   Projects swipe row.

**Suggested order:** do Step 1 first (no dependencies). In Step 2, build
and verify transition 7 (Projects) first since it needs no placeholder
content — it's the cleanest proof of the mechanism on the real site. Then
add the temporary placeholder scenes for transitions 6 and 8 so all three
transition points can be reviewed together, with the understanding that the
placeholders get replaced once the AI Avatar scene and AI Hub (Layer 5) are
actually designed.

## Layer 0 — Infrastructure (done, committed)

- Removed the old terminal-typing + 3D laptop intro sequence (it didn't work
  well on mobile and added load time for no real benefit).
- Loaded GSAP + ScrollTrigger (now used by the zoom-forward transitions,
  `assets/js/zoomTransition.js`).
- Built a minimal EN/HE i18n system (`assets/js/i18n.js`): a dictionary keyed
  by `data-i18n="namespace.key"` attributes, a language toggle button in the
  nav, `localStorage` persistence, and a `langchange` custom event other
  scripts (like the hero word-cycler) can listen to.
- Fixed an RTL bug where `.nav-links { flex-direction: row-reverse }`
  double-reversed against the `direction: rtl` already inherited from
  `dir="rtl"` on `<html>`, which cancelled itself out and also pushed the
  language-toggle button out of its visible position.
- Fixed a related RTL+mobile bug: `.hero-content` has responsive rules that
  switch it to `flex-direction: column` on narrow screens, but the RTL
  `row-reverse` override had higher CSS specificity and was winning even on
  mobile, breaking the stacked layout. Fixed with a targeted `!important` on
  the two responsive breakpoints.
- Replaced the "Portfolio" logo placeholder with the real name, localized via
  i18n ("Omer Mandalaoui" / "עומר מנדלאוי").
- Fixed the mobile nav dropdown background (was 98% opacity white, letting
  hero content faintly ghost through); now fully opaque.
- **Real root-cause fix found along the way:** `'Inter'` was referenced
  everywhere in the CSS as the primary font but was never actually linked via
  Google Fonts, so the whole site had been silently rendering in a fallback
  system font. Fixed by adding a proper `<link>` for Inter (400–800) and
  Space Grotesk (600–700, used for headings) to `index.html`.

## Layer 1 — Hero (done except the AI avatar, committed)

- New headline with a cycling highlighted word, driven by
  `assets/js/heroCycle.js`: *"Turning **ideas / workflows / spreadsheets /
  bottlenecks / businesses** into intelligent systems"* (Hebrew equivalent
  wired the same way). Word list and all strings come from `i18n.js` and
  update on language change.
- New, punchier description copy emphasizing smart web systems, AI-powered
  automations, and full-stack products that ship — not just "cleaning up
  manual processes."
- **Transformation pipeline** — an animated 5-stage visual: Business →
  Software → AI → Guidance → Impact. Each stage is a white circular node with
  a colorful emoji icon (🏢 💻 🤖 🎓 📈, matching a reference image the user
  supplied), a bold title, and a smaller two-line subtitle underneath. A
  glowing "pulse" travels continuously along the connecting line between
  nodes, and each node gets a brief glow/scale pulse as the traveling light
  passes it.
- **AI-core treatment around the real profile photo** (not a separate
  generated avatar): two concentric rotating rings around the photo (one
  slow/solid, one faster/dashed and reversed), a green-dot "Online now" chip,
  and a "💬 Chat with AI Omer" chip. The chat button is a placeholder link
  only — no real AI is wired behind it yet.
- A stats row (14+ Shipped Projects / 6 AI-Integrated Builds / 100% Production
  Deployed) was added and then **removed** after discussion — it was judged
  redundant with the pipeline (both are "credibility/proof" elements
  competing for the same spot) and the pipeline is the more differentiated,
  informative of the two.
- Visual iteration on a few elements based on feedback:
  - CTA button: went through a purple-on-blue version, then white-on-white
    (looked like the badge, not a button) before landing on the current solid
    dark-navy pill with white text.
  - Badge ("FULL-STACK & AI DEVELOPER"): now a solid white pill for contrast
    (was a low-contrast pastel pill before).
  - Cycling word color: started pale yellow (`#ffe9a8`, rejected as "yellow"),
    tried amber (`#ffb100`, still read as yellow), settled on coral-pink
    (`#ff5f7e`), which is also now used as a recurring "accent of note" color
    (e.g. the About section's "New" badge).
- **Deferred to the very end of the project, by explicit decision:** a real,
  separately generated/styled AI avatar character (distinct from the real
  photo). Current state is the real photo with the AI-core ring/chip
  treatment described above; a proper generated-avatar version is parked
  until the rest of the site is further along.

## Layer 3 — About (done, committed)

> Note: there is no formally-completed "Layer 2" — Layer 2 was originally
> meant for the full AI-avatar build, which is the item deferred to the end,
> so the numbering has a deliberate gap.

- Added the timeline entry that had been missing since it was first discussed:
  **AI Solutions Engineer, 11.2026 — Present**, with a coral "New" badge and
  a coral accent color for its timeline dot/card top-bar (the other three
  existing entries' accent colors shifted down by one position to make room).
- Upgraded section headings (eyebrow-style "WHO I AM" / "EDUCATION &
  EXPERIENCE" labels, and the bio title) to Space Grotesk with uppercase
  letter-spacing on the small labels, plus the same contrast text-shadow
  treatment used in the Hero.
- Fixed a white-on-white contrast bug that had crept into the About card
  background/text during the broader light-theme pass.

## Layer 4 — Projects (started informally, not yet reviewed as its own layer)

Per commit `7f3624e`, some Projects-section fixes already landed alongside the
About work:

- Softened the project card background so it blends better with the sky
  gradient instead of looking stark.
- Made the large decorative project numbers (01, 02, …) visible again.
- Differentiated the tech-tag chips (neutral styling) from the action buttons
  (GitHub/Visit Site — indigo styling), which had looked too similar.
- Softened the separation around the project description box.

This was a contrast/polish pass carried over from the global light-theme
change, not a deliberate, reviewed "Layer 4" redesign the way Hero and About
got. **Next step when work resumes is to go through Projects properly as its
own layer** (structure, content per project, category tabs if still wanted,
etc.) and get explicit sign-off like the earlier layers.

## Remaining layers (not started)

- **Layer 5 — AI Hub**: a new section for AI-focused content (videos,
  presentations, articles), reels-style per earlier approved concept.
  Presentations should show their cover slide + an "Open deck ↗" link to an
  externally-hosted deck (Google Slides / Canva / a free-hosted PDF) rather
  than an embedded viewer, to keep the reel light and swipeable.
- **Layer 6 — Technical Stack**: redesign the current skills carousel into an
  arc/"bowl" shaped auto-scrolling carousel (earlier attempt didn't read as a
  real arc, needs a proper fix).
- **Layer 7 — Resume & Contact**: light-theme polish to match the rest of the
  site; add (currently hidden/placeholder) slots for Instagram, TikTok, and a
  "book a call" action, to be enabled once there's real content/need for them.
- **Layer 8 — Full translation**: currently only the nav, Hero, and About
  sections are wired through i18n. Projects, Skills, Resume, Contact, and the
  footer are still English-only and need the same `data-i18n` treatment.
- **Layer 9 — Polish & QA pass**: mobile responsiveness sweep, accessibility
  (respect `prefers-reduced-motion` for the pipeline pulse/ring animations),
  performance check, and a final cross-browser look.

## Explicitly deferred / open items

- **Full AI avatar character** (a separately generated/styled image or
  animation, distinct from the real photo) — deferred to the end of the
  project by the user's own decision.
- **Real AI behind "Chat with AI Omer"** — currently a static placeholder
  link/chip. Wiring it to an actual LLM (e.g. Groq's free tier) is future
  work, not started.
- **Resume content/PDF update** — left open since the role/timeline changed;
  not yet revisited.
- **Placeholder scenes behind the zoom transitions** — the AI Avatar scene
  (`#avatar`) and AI Hub (`#ai-hub`) are temporary; replace them when the
  real avatar scene and Layer 5 are designed (transition code stays as is).
  Neither has a nav-menu link yet.

## Working agreement

- Work proceeds **one layer at a time**, each verified locally (desktop +
  mobile, English + Hebrew) before being presented for approval.
- Nothing gets committed without being asked for explicitly; nothing gets
  pushed to `origin` without being asked for explicitly.
