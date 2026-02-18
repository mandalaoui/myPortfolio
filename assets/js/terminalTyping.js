document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminalBody");
  const scrollInd = document.querySelector('.scroll-indicator');

  // Helper: detect isMobile via screen size or user agent (broad catch)
  function isMobile() {
    return (
      window.matchMedia &&
      window.matchMedia("(max-width: 600px)").matches
    ) || /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }

  // Typing parameters, adjusted for mobile UX
  const charSpeed = isMobile() ? 7 : 25;
  const linePause = isMobile() ? 10 : 25;

  // Terminal lines (shared)
  const lines = [
    { type: "command", text: "run Omer_Mandalaoui_Portfolio.sh" },
    { type: "output", text: "[Parsing ideas…]" },
    { type: "output", text: "[Structuring systems…]" },
    { type: "output", text: "[Optimizing execution…]" },
    { type: "output", text: "[Shipping results…]" },
    { type: "space" },
    { type: "success", text: "System ready." },
    { type: "muted", text: isMobile() ? "Swipe down to continue." : "Scroll to continue." },
    { type: "cursor" }
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let activeElement = null;
  let typingActive = true;

  // If user already scrolled, skip terminal typing
  if (window.scrollY > 50) {
    document.body.classList.add('skip-terminalTyping');
  }

  // Adjust terminal text size on mobile for smaller font
  function adjustTerminalFontSize() {
    if (isMobile() && terminal) {
      terminal.style.fontSize = "12px";
    }
  }
  adjustTerminalFontSize();

  // On resize, continuously ensure small text for mobile
  window.addEventListener("resize", adjustTerminalFontSize);

  function updateScrollIndicator() {
    if (scrollInd) {
      // Hide on typing, show after
      scrollInd.style.opacity = typingActive ? "0" : "1";
      // Add mobile hint if on mobile
      if (isMobile()) {
        const scrollText = scrollInd.querySelector('.scroll-text');
        if (scrollText) {
          scrollText.textContent = typingActive ? '' : "Swipe";
        }
      }
    }
  }

  function freezeScroll(freeze) {
    if (!document.body.classList.contains('skip-terminalTyping')) {
      // For mobile, also disable touch scroll
      if (freeze) {
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      } else {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    }
    updateScrollIndicator();
  }

  function typeLine() {
    freezeScroll(typingActive);

    if (lineIndex >= lines.length) {
      typingActive = false;
      freezeScroll(false);
      return;
    }
    
    const line = lines[lineIndex];

    if (line.type === "space") {
      terminal.appendChild(document.createElement("br"));
      lineIndex++;
      setTimeout(typeLine, linePause);
      return;
    }

    if (line.type === "cursor") {
      const div = document.createElement("div");
      div.className = "t-line";
      div.innerHTML = `<span class="prompt">❯</span><span class="cursor-blink"></span>`;
      if (isMobile()) {
        div.style.fontSize = "12px";
      }
      terminal.appendChild(div);
      typingActive = false;
      freezeScroll(false);
      return;
    }

    // When a new line starts, create containers appropriately and set activeElement
    if (charIndex === 0) {
      if (line.type === "command") {
        const container = document.createElement("div");
        container.className = "t-line";
        if (isMobile()) {
          container.style.fontSize = "12px";
        }

        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "❯";

        const typingSpan = document.createElement("span");
        typingSpan.className = "typing";
        if (isMobile()) {
          typingSpan.style.fontSize = "12px";
        }

        container.appendChild(prompt);
        container.appendChild(typingSpan);
        terminal.appendChild(container);

        activeElement = typingSpan;
      } else {
        const container = document.createElement("div");
        container.className = "out typing";
        container.style.color =
          line.type === "success" ? "#00f5ff" :
          line.type === "muted" ? "#8892a4" :
          "#a4ff80";
        if (isMobile()) {
          container.style.fontSize = "12px";
        }
        terminal.appendChild(container);

        activeElement = container;
      }
    }

    if (activeElement && line.text) {
      activeElement.textContent += line.text.charAt(charIndex);
    }

    charIndex++;

    if (charIndex < (line.text ? line.text.length : 0)) {
      setTimeout(typeLine, charSpeed);
    } else {
      charIndex = 0;
      lineIndex++;
      setTimeout(typeLine, linePause);
    }
  }

  typingActive = true;
  freezeScroll(true);
  typeLine();

  // Optionally, if on mobile: allow user to tap/scroll to skip animation fast
  if (isMobile()) {
    let skipped = false;
    function skipTyping() {
      if (!skipped && typingActive) {
        skipped = true;
        typingActive = false;
        // Clear terminal and show all lines instantly, at smaller font
        terminal.innerHTML = "";
        lines.forEach(line => {
          if (line.type === "space") {
            terminal.appendChild(document.createElement("br"));
          } else if (line.type === "cursor") {
            const div = document.createElement("div");
            div.className = "t-line";
            div.innerHTML = `<span class="prompt">❯</span><span class="cursor-blink"></span>`;
            div.style.fontSize = "12px";
            terminal.appendChild(div);
          } else if (line.type === "command") {
            const container = document.createElement("div");
            container.className = "t-line";
            container.style.fontSize = "12px";
            const prompt = document.createElement("span");
            prompt.className = "prompt";
            prompt.textContent = "❯";
            const typingSpan = document.createElement("span");
            typingSpan.className = "typing";
            typingSpan.textContent = line.text;
            typingSpan.style.fontSize = "12px";
            container.appendChild(prompt);
            container.appendChild(typingSpan);
            terminal.appendChild(container);
          } else {
            const container = document.createElement("div");
            container.className = "out typing";
            container.style.color =
              line.type === "success" ? "#00f5ff" :
              line.type === "muted" ? "#8892a4" :
              "#a4ff80";
            container.textContent = line.text;
            container.style.fontSize = "12px";
            terminal.appendChild(container);
          }
        });
        freezeScroll(false);
      }
    }
    // Allow tap anywhere or quick swipe to skip
    document.addEventListener("touchstart", skipTyping, { passive: true });
    document.addEventListener("mousedown", skipTyping, { passive: true });
  }
});