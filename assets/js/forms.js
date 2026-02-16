// Form-related behavior (placeholder for future forms).
// Currently passive to keep existing behavior the same.

(function () {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Basic example hook; intentionally minimal to avoid altering UX.
        const formData = new FormData(contactForm);
        const name = formData.get('name') || 'There';

        if (window.Toast && typeof window.Toast.show === 'function') {
            window.Toast.show(`Thanks for reaching out, ${name}!`);
        }

        contactForm.reset();
    });
})();
