// Video modal behavior.
// Note: No triggers are wired yet to preserve current behavior.

(function () {
    const modal = document.getElementById('videoModal');
    if (!modal) {
        return;
    }

    const closeButton = modal.querySelector('[data-modal-close]');
    const iframe = modal.querySelector('iframe');

    function closeModal() {
        modal.classList.remove('is-open');
        if (iframe) {
            // Stop video playback by resetting the src
            const src = iframe.getAttribute('src');
            iframe.setAttribute('src', src || '');
        }
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Expose a passive API for potential future use without changing behavior now.
    window.VideoModal = {
        open(src) {
            if (!modal || !iframe) {
                return;
            }
            if (src) {
                iframe.setAttribute('src', src);
            }
            modal.classList.add('is-open');
        },
        close: closeModal
    };
})();
