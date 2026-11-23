// Loads model-viewer (the floating 3D laptop, #laptopFloat) only after the page
// has finished loading, so its ~280KB script and the ~450KB laptop.glb don't
// compete with the first paint (Lighthouse: LCP / critical request chain).
// Until then <model-viewer> is an empty element; it upgrades and loads its
// model as soon as the script arrives. A file, not inline code, for the CSP.

(function () {
    if (!document.querySelector('model-viewer')) return;

    function load() {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@google/model-viewer@4.4.0/dist/model-viewer.min.js';
        script.integrity = 'sha384-wjsPzEO+lXOf7d9csIDfAQpPt2OKuUU3m0K9qsdKIuzX4N8czSF6hdh23eAbZa3p';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    }

    function whenIdle() {
        if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 2000 });
        else setTimeout(load, 300);
    }

    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
})();
