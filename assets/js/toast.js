// Toast notifications utility.
// Note: Not used yet to avoid changing current behavior.

(function () {
    const containerId = 'toastContainer';

    function ensureContainer() {
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function createToastElement(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        return toast;
    }

    function showToast(message, options = {}) {
        const { duration = 3000 } = options;
        const container = ensureContainer();
        const toast = createToastElement(message);

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
            if (!container.hasChildNodes()) {
                container.remove();
            }
        }, duration);
    }

    // Expose utility on the window for optional use.
    window.Toast = {
        show: showToast
    };
})();
