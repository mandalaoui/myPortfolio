// Cycles the highlighted word in the hero headline through a short list of
// business-pain words, re-reading the list from I18n whenever the language changes.
(function () {
    const el = document.getElementById('cycleWord');
    if (!el) return;

    let words = [];
    let i = 0;
    let timer = null;

    function wordsFor() {
        return (window.I18n && window.I18n.cycleWords()) || [el.textContent];
    }

    function tick() {
        i = (i + 1) % words.length;
        el.style.opacity = '0';
        setTimeout(() => {
            el.textContent = words[i];
            el.style.opacity = '1';
        }, 220);
    }

    function restart() {
        words = wordsFor();
        i = 0;
        if (words.length) el.textContent = words[0];
        if (timer) clearInterval(timer);
        if (words.length > 1) timer = setInterval(tick, 2200);
    }

    document.addEventListener('langchange', restart);
    restart();
})();
