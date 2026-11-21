// Giant title cards with a 3D illustration (Projects, AI): scroll-driven motion.
//
// Applies to every `.title-art-scene` section. Each one is the outgoing side of
// a zoom transition (index.html) that pins the card for ZOOM_LENGTH screens,
// keeps it at its own size (scaleOut: 1) and fades it out only near the end of
// the range (outEase: 'power4.in') while the next section zooms in.
//
//   Phase 1  idle:      illustration behind the title, slightly smaller, floating (CSS).
//   Phase 2  entrance:  while the card scrolls into view, the illustration comes
//                       forward, scales up and settles its 3D tilt.
//   Phase 3  immersion: during the pinned range the title and the illustration zoom
//                       toward the viewer together, as one scene (moving "into" it),
//                       the glow behind them moving faster for depth.
//   Phase 4  hand-off:  both keep growing out of the frame and fade together as the
//                       next section zooms in (zoom transition).
//
// The illustrations are flat images of 3D objects: depth comes from perspective
// transforms and the separate glow layer, not real geometry.
// Mobile: smaller scale and rotation. prefers-reduced-motion: static composition.

(function () {
    if (!window.gsap || !window.ScrollTrigger) return;

    const ZOOM_LENGTH = 1.2;   // must match the zoom transitions' `length` (default 1.2)

    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.title-art-scene').forEach((section) => {
        // One image, or an English + Hebrew pair (only one is displayed).
        const img = Array.from(section.querySelectorAll('.title-art-img'));
        const glow = section.querySelector('.title-art-glow');
        const title = section.querySelector('.scene-title-text');
        if (!img.length || !glow || !title) return;

        gsap.set(img, { transformPerspective: 1400 });

        gsap.matchMedia().add({
            desktop: '(min-width: 37.5625rem) and (prefers-reduced-motion: no-preference)',
            mobile: '(max-width: 37.5rem) and (prefers-reduced-motion: no-preference)'
        }, (ctx) => {
            const { mobile } = ctx.conditions;
            const tilt = mobile ? 0.5 : 1;          // mobile: half the rotation
            const grow = mobile ? 1.9 : 2.7;        // final scale during the immersion

            // Phase 2: entrance, while the card scrolls up into view.
            gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true }
            })
                .fromTo(img,
                    { scale: mobile ? 0.86 : 0.78, rotationX: 22 * tilt, rotationY: -14 * tilt, yPercent: 8, opacity: 0.55 },
                    { scale: 1, rotationX: 9 * tilt, rotationY: -5 * tilt, yPercent: 0, opacity: 1, ease: 'power1.out' }, 0)
                .fromTo(glow, { scale: 0.8, opacity: 0.3 }, { scale: 1, opacity: 0.85 }, 0);

            // Phases 3-4: immersion and hand-off, across the pinned zoom range.
            gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * ZOOM_LENGTH}`,
                    scrub: true,
                    invalidateOnRefresh: true
                }
            })
                // Title and illustration move as one: the same zoom toward the
                // viewer (same scale curve) and the same fade-out window, so the
                // whole card reads as a single scene you fly into.
                .to([title, ...img], { scale: grow, ease: 'power1.inOut', duration: 1 }, 0)
                .to(img, { rotationX: 2 * tilt, rotationY: 4 * tilt, ease: 'power1.inOut', duration: 1 }, 0)
                // Glow moves faster than the object: parallax depth.
                .to(glow, { scale: mobile ? 2.4 : 3.4, opacity: 0, ease: 'power1.in', duration: 0.6 }, 0)
                // Phase 4: both leave the frame together as the next section arrives.
                .to([title, ...img], { opacity: 0, ease: 'power1.in', duration: 0.25 }, 0.35);

            return () => gsap.set([...img, glow, title], { clearProps: 'transform,opacity' });
        });
    });
})();
