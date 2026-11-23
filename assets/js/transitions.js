// Zoom-forward scroll transitions (REDESIGN_PLAN.md, "Scroll choreography").
// Kept in a file (not an inline <script>) so the Content-Security-Policy in
// _headers can forbid inline scripts.
// Chat: fully opaque before it stops moving, plus a short still stretch, so it
// never sits in place while still faded (user's request).
ZoomTransition.create({ outgoing: '#home', incoming: '#avatar', inFade: 0.7, settle: 0.1 });
ZoomTransition.create({ outgoing: '#projects-title', incoming: '#projects', scaleOut: 1, split: 0.9, overlap: 0.5, outEase: 'power4.in' });
ZoomTransition.create({ outgoing: '#ai-title', incoming: '#ai-hub', scaleOut: 1, split: 0.9, overlap: 0.5, outEase: 'power4.in' });
ZoomTransition.create({ outgoing: '#skills', incoming: '#contact' });
