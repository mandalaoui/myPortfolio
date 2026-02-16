// Theme configuration and helpers.
// Note: No theme toggle is applied yet to keep behavior unchanged.

(function () {
    const THEME = {
        primary: '#6366f1',
        primaryDark: '#4f46e5',
        dark: '#0f172a',
        light: '#f8fafc',
        gray: '#64748b',
        white: '#ffffff'
    };

    function getTheme() {
        return { ...THEME };
    }

    // Expose a small, passive API without side effects.
    window.Theme = {
        getTheme
    };
})();
