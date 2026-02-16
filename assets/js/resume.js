/**
 * Resume button animation — exact event order via transitionend.
 * 1. Click → fade text, move icon to center
 * 2. Icon transitionend → show ring, start stroke
 * 3. Stroke transitionend → hide icon+ring, show checkmark
 * 4. Checkmark transitionend → reset to initial state
 */

(function () {
    const btn = document.getElementById("resumeBtn");
    if (!btn) return;

    const btnText = btn.querySelector(".btn-text");
    const btnIcon = btn.querySelector(".btn-icon");
    const progressRing = btn.querySelector(".progress-ring");
    const progressFill = btn.querySelector(".progress-ring-fill");
    const successCheck = btn.querySelector(".success-check");

    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    progressFill.style.strokeDasharray = circumference;
    progressFill.style.strokeDashoffset = circumference;

    function getCenter(el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function once(el, eventName, predicate, callback) {
        const handler = (e) => {
            if (predicate && !predicate(e)) return;
            el.removeEventListener(eventName, handler);
            callback(e);
        };
        el.addEventListener(eventName, handler);
    }

    function reset() {
        btn.disabled = false;
        btn.classList.remove("loading");

        // Instant hide
        successCheck.style.transition = "none";
        successCheck.style.opacity = "0";
        progressRing.style.transition = "none";
        progressRing.style.opacity = "0";
        progressFill.style.transition = "";
        progressFill.style.strokeDashoffset = circumference;

        // Animate back
        btnIcon.style.opacity = "1";
        btnIcon.style.transition = "transform 0.38s cubic-bezier(.53,1.35,.55,1)";
        btnIcon.style.transform = "";
        btnIcon.style.willChange = "";

        btnText.style.transition = "opacity 0.3s ease";
        btnText.style.opacity = "1";
    }

    btn.addEventListener("click", () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.classList.add("loading");

        // 1. Immediately fade out text
        btnText.style.transition = "opacity 0.2s ease";
        btnText.style.opacity = "0";

        // 2. Move icon to center
        const iconCenter = getCenter(btnIcon);
        const btnCenter = getCenter(btn);
        const dx = btnCenter.x - iconCenter.x;
        const dy = btnCenter.y - iconCenter.y;

        btnIcon.style.transition = "transform 0.4s cubic-bezier(.51,1.03,.64,1)";
        btnIcon.style.willChange = "transform";
        btnIcon.style.zIndex = "10";

        requestAnimationFrame(() => {
            btnIcon.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        // 3. When icon reaches center → show ring, start stroke
        once(btnIcon, "transitionend", (e) => e.propertyName === "transform", () => {
            progressRing.style.transition = "opacity 0.2s ease";
            progressRing.style.opacity = "1";

            requestAnimationFrame(() => {
                progressFill.style.transition = "stroke-dashoffset 0.8s cubic-bezier(.53,1.2,.33,1)";
                progressFill.style.strokeDashoffset = "0";
            });

            // 4. When stroke finishes → hide icon+ring, show checkmark
            once(progressFill, "transitionend", (e) => e.propertyName === "stroke-dashoffset", () => {
                btnIcon.style.transition = "opacity 0.65s cubic-bezier(.53,1.2,.33,1)";
                btnIcon.style.opacity = "0";

                progressRing.style.transition = "opacity 0.65s cubic-bezier(.53,1.2,.33,1)";
                progressRing.style.opacity = "0";

                successCheck.style.transition = "opacity 0.65s cubic-bezier(.53,1.2,.33,1)";
                successCheck.style.opacity = "1";

                const a = document.createElement("a");
                a.href = "Omer_Mandalaoui_CV.pdf";
                a.download = "";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // 5. When checkmark finishes → reset
                once(successCheck, "transitionend", (e) => e.propertyName === "opacity", reset);
            });
        });
    });
})();
