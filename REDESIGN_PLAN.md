# Portfolio Redesign Plan (branch `v2-redesign`)

Status snapshot as of 2026-11-21. Working branch is `v2-redesign`, pushed to
`origin/v2-redesign`. Not merged to `main`. Not deployed yet: the AI chat
needs the `avatarApiKey` environment variable set in Netlify.

```
(next)  Redesign v2: AI Omer avatar + RAG chat, title-card art, legal pages
(next)  Fix .gitignore encoding so .env files are actually ignored
f4c272b Redesign v2: section reorder, zoom from Technical Stack into Contact
0b67511 Redesign v2: Layer 7 — merge Resume into one Contact section
a47a1ef Redesign v2: Layer 6 Technical Stack — 3D logo ring
41a2b1e Redesign v2: Layer 4 Projects — featured cards and More projects index
976d149 Redesign v2: zoom transitions on mobile, Projects swipe row
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

## Scroll choreography — IMPLEMENTED, one placeholder remains (AI Hub)

The full page-scroll sequence agreed on in conversation. Four zoom
transitions are live. The AI Avatar scene is now real (AI Omer, see its
section below); the AI Hub is still a **temporary placeholder** that will be
swapped for the real design later without touching the transition code. The Projects sideways
scroll (`assets/js/projects.js`) is the pre-existing vanilla-JS mechanism
from before the redesign, now adjusted (see Step 2 below).

The sequence, top to bottom (**reordered** after a review of the section
order — see "Section order" below):

1. **Hero** (full screen) — eyebrow, headline, description. *(Built.)*
2. **↓ zoom transition** → **AI Omer** (`#avatar`): animated 3D avatar + RAG
   chat *(built — see "AI Omer" below)*.
3. **↓ normal scroll** → full-screen **"Projects" title** card
   (`#projects-title`) with a 3D glass illustration *(see "Title cards with
   illustrations" below)*. It is the section's only heading.
4. **↓ zoom transition** → **Projects**, where sideways scroll moves between
   the featured cards. *(Built. Desktop: scrolling down drives the cards
   sideways. Mobile: a native swipe row instead — see "Mobile" below.)*
5. **↓ normal scroll** → **More projects** index *(built — Layer 4)*.
6. **↓ normal scroll** → full-screen **"AI" title** card (`#ai-title`) with
   a 3D brain illustration that has "AI" built in.
7. **↓ zoom transition** → **AI Hub** (`#ai-hub`). *(Transition built. Hub
   is a TEMPORARY "Coming soon" placeholder until Layer 5 is designed —
   reels / grid / hybrid is still an open decision.)*
8. **↓ normal scroll** → **About Me**. *(Built.)*
9. **↓ normal scroll** → **Technical Stack** — a 3D ring of logo cards
   *(built — Layer 6)*.
10. **↓ zoom transition** → **Contact** ("What's next") — one closing
    call-to-action section with Resume merged in *(built — Layer 7)*. Added
    at the user's request after the reorder; Technical Stack and Contact are
    both full-screen (`100svh`) with centered content for it. The skills ring
    keeps turning while the section zooms out (accepted).

**Section order (reviewed, approved).** Reviewed assuming every section is
filled with real content (placeholders ignored). Previous order was Hero →
Avatar → About → Projects → More projects → AI Hub → Stack → Contact.
Changes and why:
- **Projects moved up, About moved down.** Visitors (recruiters, clients)
  want proof first; About with its timeline reads better once they're
  convinced. The Avatar scene already introduces Omer personally, so About
  right after it repeated "meet me" twice. The Hero CTA "Explore My Work"
  now leads straight to the work.
- **About and Technical Stack are adjacent** — both answer "who are you and
  what do you work with".
- Rhythm: the first half holds three zoom transitions and the most
  impressive content (Avatar, Projects, AI Hub); the second half is calmer
  and informational (About, Stack), closing with a fourth zoom into Contact.
- Kept: Hero → Avatar (an AI chat as screen two is itself a live demo for the
  AI Solutions Engineer role), AI Hub right after the projects, Contact last.
- Nav order follows: Home, Projects, About, Skills, Contact.

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

## Layer 4 — Projects (done, approved)

Reviewed as its own layer and approved. No project was removed; the 14
projects are split into 6 featured + 8 "More projects".

**Featured** (the sideways-scroll track, large cards), in this order:
AIControlCenter, AI Automation Marketplace, WanderWise, TeacherAssistantAI,
Mortgage AI, Real Estate Platform (short display name for "Real Estate
Management & Content Platform").

**More projects** (index below the track), in this order: Family Vehicle
Manager, Netfilm, Coupon Marketplace, Argentina Travel Companion, Mika
Coffee, Pilates Studio, Guess The Country, Brick-Breaker (numbered 07–14).

Card format (data in `assets/js/projectsData.js`, templates in
`projectCard.js`, index in `moreProjects.js`):

- Every card keeps its type badge (Independent / Client / Academic) — the
  user asked for this explicitly. AI projects (all 6 featured) also get an
  **AI badge**: coral → violet gradient pill with a soft glow and a slow light
  sweep (off with `prefers-reduced-motion`).
- Featured card: one-sentence summary, 3 "Highlights" bullets, up to 5 tags,
  and explicit buttons — Live / Code / **Video** (the video used to be hidden
  behind a click on the image; the image click still works). The "LIVE DEMO"
  ribbon was removed. Image is the original 15.6rem tall, shrinking to
  11rem on short screens so content never overflows (letting it grow into
  all free space was tried and read as too big).
- All texts were rewritten from the existing descriptions only (no new
  claims) and approved per project; English only for now (Layer 8).
- Sideways track shortened for 6 cards: `.projects-section` 320vh → 200vh.

"More projects" — rejected first attempt and final design:

- A compact card grid (3–4 per row) was built and **rejected** ("didn't like
  it at all"): it read as a generic template and competed with the featured
  cards. Alternatives sketched: (A) one track with two card sizes, (B) an
  index list, (C) a "View all" card opening an overlay. B was chosen, with
  larger images.
- **Final (B):** desktop — a list of rows (number, name, short line, type
  badge) beside a large sticky preview (16:10 screenshot, project name on
  the image, ▶ play button when there's a video, full sentence on a white
  box, Live / Code / Video). The active project is the hovered row, or — when
  the pointer isn't over the list — the row nearest the middle of the screen,
  so the preview also changes while scrolling; swaps fade + zoom slightly.
  Mobile — rows with a thumbnail; tapping a row expands it (full-width image,
  sentence, buttons), one open at a time. Section heading "More projects" /
  "פרויקטים נוספים" (i18n `projects.more`).

Also in this layer: minimal position dots under the mobile swipe row of the
featured cards (indicator only).

Removed: three projects that were already commented out in the data file
(MyStocks, Mathy, TrueValueIL — never shown on the site; still in git
history), and the old compact-card code/styles.

Open, small: Mortgage AI's summary/highlights are generic because the source
description is short — can be strengthened if the user adds details.

Earlier polish from commit `7f3624e` (softer card background, visible card
numbers, tags vs buttons styling) still applies.

## Layer 6 — Technical Stack (done, approved)

The plan said "bowl-shaped carousel"; a curved 2D line and a 3D ring were
sketched and the user chose **3D**.

- **3D ring** (`assets/js/skillsRing.js`, replaces the old straight
  `carousel.js`, deleted): cards on a cylinder (`rotateY` + `translateZ`,
  radius computed from card width so cards don't overlap), tilted slightly
  from above. Turns on its own (7°/s — slowed from 10 on request), can be
  dragged with mouse or finger and keeps turning in the last drag direction.
  Cards toward the back fade and go grey; the front card is in full color.
  Pauses while off screen; no auto-rotation with `prefers-reduced-motion`;
  without JS the cards wrap as a plain grid. Mobile: smaller cards/stage,
  `touch-action: pan-y` so vertical swipes still scroll the page.
- **One ring, not per-category groups** (recommended and accepted): each card
  shows a small category label (Frontend / Backend / Data / Infrastructure /
  AI) instead of the old 5 separate groups.
- **Colored logos** (recommended and accepted) from Devicon, already on the
  site; Angular uses `angularjs-plain` (the `angular-plain` variant renders
  white). OpenAI, Groq and OpenRouter have no Devicon logo → Font Awesome icons
  in brand colors.
- **Final list — 25 cards**, reviewed against the projects:
  Frontend: React, Next.js, TypeScript, JavaScript, Angular, Tailwind CSS ·
  Backend: Node.js, Express, Python, Java (both kept by the user's choice) ·
  Data: PostgreSQL, MySQL, MongoDB, Supabase · Infrastructure: Git, Docker,
  GitHub Actions, Vercel, Netlify · AI: OpenAI API, Groq / Llama, OpenRouter,
  LLM Integration, Prompt Engineering, Workflow Automation (the last three are
  concepts, with Font Awesome icons in the AI-badge violet).
  Added because the projects use them: Angular, Tailwind CSS, Supabase, Groq,
  OpenRouter, Netlify. Dropped as implied by the tools: REST APIs, SQL,
  JWT Auth, CI/CD (a row of concept tags under the ring was tried and removed
  at the user's request).
- Only tools the user has actually used are listed. Suggested to learn next
  (free, relevant to the AI Solutions Engineer role), not on the site:
  n8n, RAG with pgvector on Supabase/PostgreSQL, Vercel AI SDK, a second LLM
  provider's API, MCP. A small project combining them could become a featured
  project and the first AI Hub content.
- `animations.js` no longer fades `.skill-card` (its transitions fought the
  ring's per-frame transforms).

## Layer 7 — Resume & Contact (done, approved)

The separate Resume section (heading + one sentence + a button) was too thin
to justify its own full section, and both sections answer the same "what do I
do next?" — so they were **merged into one closing section**, `#contact`
(recommended and accepted after a sketch).

- Eyebrow "What's next", headline "Let's build something together", one
  inviting sentence aimed at both recruiters and business owners (draft text,
  kept as is — the user can supply their own wording). EN + HE wired through
  i18n (`contact.*`).
- Buttons: **Get in touch** (primary, dark — opens an email), **Download
  resume** (secondary, white — downloads `Omer_Mandalaoui_CV.pdf`), **Book a
  call** (secondary — the user's Google Calendar appointment page,
  `https://calendar.app.google/BzQ4bsv9qHKrsKKb7`, new tab). Booking page set
  up by the user; advised: Google Meet instead of phone, a short description,
  a required "What would you like to talk about?" question, phone optional.
- Contact items: email (mailto), **WhatsApp** (wa.me link — replaces the
  displayed phone number), location. GitHub + LinkedIn round buttons.
- **Reserved, hidden slots:** Instagram and TikTok are in the markup with the
  `hidden` attribute and `href="#"`; to enable one, set the real link and
  remove `hidden`.
- Nav: "Resume" removed; "Contact" is the single item.
- Removed: the old download-button animation (progress ring + check mark),
  `resume.js`, and the old Resume/Contact styles. The new button is a plain
  download link (the animation can be brought back if wanted).

## AI Omer — animated avatar + RAG chat (built, not deployed yet)

Replaces the placeholder avatar scene (this was the original "Layer 2",
deferred to the end). Everything uses free tiers.

**Avatar** (`images/avatar/*.webp`, script `assets/js/avatarChat.js`)
- 3D-animated character generated by the user in Gemini from his photo; 7
  poses: idle, blink, talk, thinking, explain, explain-open, wave. Originals
  in `images/avatar/src/`. Backgrounds removed locally (flood fill from all
  image edges + soft edge alpha) into transparent WebP (~46KB each).
- "talk" is a composite: only the mouth/chin of the user's mouth-open image
  blended onto the idle pose (the source also raised the eyebrows, which made
  them jump while "talking").
- Behaviour: CSS breathing, blink every 2.5–6s, thinking while waiting,
  explain gesture then mouth frames alternating while the answer streams,
  "suspicious" (thinking pose + shake + orange glow) on manipulative
  requests, slight 3D tilt toward the mouse. Poses switch instantly with a
  short "pop" (a cross-fade showed a translucent "ghost" arm).
- **Wave rules** (user's spec): visibility = share of the figure on screen
  *below the fixed navbar* × section opacity. Arriving (either direction):
  wave from the first visible moment, held until fully visible + 0.9s.
  Leaving: wave as soon as visibility drops below 80% after having been fully
  visible. Never interrupts a chat answer.
- Note: `#mainNavbar` is a 0-height static wrapper; the fixed bar is its
  `<nav>`.

**Chat** (server `netlify/functions/chat.mjs` → `POST /api/chat`)
- Groq models (Llama 3.3 is no longer offered): `openai/gpt-oss-120b`
  answers, `openai/gpt-oss-20b` classifies, `meta-llama/llama-prompt-guard-2-86m`
  screens for prompt injection. Overridable with env vars.
- Pipeline: limits (500 chars/message, 6 history messages, 20 messages per IP
  per 10 min, in memory) → prompt-guard + classifier (language, intent,
  hiring interest, English search terms) → suspicious / restricted (salary,
  personal) / off-topic get fixed polite EN/HE replies → otherwise BM25
  keyword retrieval over the knowledge base → streamed, grounded answer.
  Retrieval is keyword-based (no embeddings service, no second key); Hebrew
  works because the classifier rewrites questions into English search terms.
- Knowledge base `netlify/chat/knowledge.mjs`: the user's questionnaire
  answers (availability: mainly freelance, part-time possible; hybrid,
  Petah Tikva area; Hebrew/English/basic Spanish; services; current role
  described without naming the employer), CV facts, stack, contact, AI tips,
  and all projects pulled straight from `assets/js/projectsData.js`.
- Voice: first person, warm, casual; answers in the visitor's language;
  never salary or personal details; a few AI starter tips aimed at leads.
- UI: suggested questions, streaming, "Based on" source chips that scroll to
  the matching section, Book a call / WhatsApp buttons on hiring interest,
  "How this chat works" explainer, and a footnote: AI-generated answers may
  contain errors, aren't a commitment or professional advice ("confirm with me
  directly" links to Contact), conversations are saved.
- **Logging (user's request: log everything):** every exchange (time,
  message, answer, language, intent, guard score, sources) goes to Netlify
  Blobs store `chat-logs` in production, `logs/chat-log.jsonl` locally
  (git-ignored). Needs `@netlify/blobs` (`package.json`, installed by Netlify).
- Secret: Groq key in env var `avatarApiKey` (`.env.local` locally; must be
  added in Netlify → Environment variables).
- Local dev: `npm run dev` → `scripts/dev-server.mjs` on http://localhost:5174
  (serves the site and runs the function; no dependencies).
- Security fix found on the way: `.gitignore` was saved as UTF-16, which git
  cannot read, so `.env.local` (the API key) was NOT ignored. Converted to
  UTF-8; `.env*` and `logs/` are now ignored.

## Title cards with illustrations (Projects, AI)

- Generic mechanism `assets/js/titleArt.js` for every `.title-art-scene`:
  the illustration floats behind the title, comes forward and settles its 3D
  tilt as the card scrolls in, then **title and illustration zoom toward the
  viewer together** (same scale curve) and **fade together early** (35–60% of
  the pinned range) while the next section zooms in from 40%. A faster glow
  layer adds parallax. Mobile: half tilt, less growth; reduced motion: static.
- `zoomTransition.js` got an `outEase` option; these cards use
  `scaleOut: 1, split: 0.9, overlap: 0.5, outEase: 'power4.in'`.
- Art was generated by the user (Gemini) on a blue gradient. It is separated
  locally by fitting the gradient as a smooth surface and deriving alpha from
  the difference (keeps the glass semi-transparent); the baked-in cursor dot
  (from a screenshot) is removed.
- **Projects:** English shows `projects-intro-en.webp` with "PROJECTS" built
  in (HTML title hidden visually); Hebrew shows the plain
  `projects-intro.webp` with the live "פרויקטים" title. A Hebrew version of
  the built-in-title art could replace that later.
- **AI:** `ai-intro.webp` has "AI" built in (same in both languages); the
  HTML title is hidden visually.
- Titles over art get a stronger layered dark shadow. Giant title font
  reduced to 15vw so "PROJECTS" fits at ~800px wide.

## Legal pages, footer, text shadow

- New pages `terms.html`, `privacy.html`, `accessibility.html` (EN + HE, open
  in the visitor's chosen language, language switch, own light stylesheet
  `assets/css/legal.css` + `assets/js/legal.js`). Content matches what the
  site actually does: chat logging, IP used only in memory for rate limits,
  language in localStorage, no analytics/cookies, providers (Netlify, Groq,
  Google Fonts and CDNs, Cloudinary), Israeli privacy law + GDPR rights,
  Israeli Standard 5568 / WCAG AA. **Drafts — to be reviewed by a lawyer.**
- Accessibility contact lists email + WhatsApp (a phone number may be
  expected by the regulations).
- Footer: links to the three pages, translated (EN/HE), full white, bolder
  copyright, stronger divider.
- **All white text directly on the sky** now shares one shadow token
  (`--on-sky-shadow`), replacing the previous mix of weak text-shadows,
  `filter: drop-shadow` and none (footer).

## Remaining layers (not started)

- **Layer 5 — AI Hub** *(deferred by the user until there is real content)*:
  a new section for AI-focused content (videos, presentations, articles),
  reels-style per earlier approved concept. Presentations should show their
  cover slide + an "Open deck ↗" link to an externally-hosted deck (Google
  Slides / Canva / a free-hosted PDF) rather than an embedded viewer, to keep
  the reel light and swipeable. Before merging to `main`, decide whether to
  hide the "AI" title card + "Coming soon" placeholder until then.
- **Layer 8 — Full translation**: wired through i18n so far: nav, Hero,
  About, the scroll scenes/title cards, the "More projects" heading, the
  Contact section, the footer, the chat UI and the legal pages. Still
  English-only: the project card texts (data in `projectsData.js`) and the
  Technical Stack heading/labels.
- **Layer 9 — Polish & QA pass**: mobile responsiveness sweep, accessibility
  (respect `prefers-reduced-motion` for the pipeline pulse/ring animations;
  the custom cursor hides the system cursor), performance check, and a final
  cross-browser look.

## Explicitly deferred / open items

- **AI Omer in production** — set `avatarApiKey` in Netlify, deploy, test
  the chat live (Netlify Blobs logging untested outside local dev).
- **Chat log retention** — the privacy policy promises deletion after 12
  months; no automatic cleanup exists yet.
- **Optional avatar pose** — a dedicated "suspicious" image (raised eyebrow,
  arms crossed); the suspicious state uses the thinking pose for now.
- **Resume content/PDF update** — left open since the role/timeline changed;
  not yet confirmed whether `Omer_Mandalaoui_CV.pdf` reflects the AI
  Solutions Engineer role.
- **AI Hub placeholder** (`#ai-hub`) — temporary until Layer 5; no nav link.

## Working agreement

- Work proceeds **one layer at a time**, each verified locally (desktop +
  mobile, English + Hebrew) before being presented for approval.
- Nothing gets committed without being asked for explicitly; nothing gets
  pushed to `origin` without being asked for explicitly.
