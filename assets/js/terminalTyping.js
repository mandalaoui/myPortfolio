document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminalBody");
  const scrollInd = document.querySelector('.scroll-indicator');

  const lines = [
    { type: "command", text: "run Omer_Mandalaoui_Portfolio.sh" },
    { type: "output", text: "[Parsing ideas…]" },
    { type: "output", text: "[Structuring systems…]" },
    { type: "output", text: "[Optimizing execution…]" },
    { type: "output", text: "[Shipping results…]" },
    { type: "space" },
    { type: "success", text: "System ready." },
    { type: "muted", text: "Scroll to continue." },
    { type: "cursor" }
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let activeElement = null;
  let typingActive = true;

  const charSpeed = 25;
  const linePause = 25;

  // Skip terminalTyping if user already scrolled
  if (window.scrollY > 50) {
    document.body.classList.add('skip-terminalTyping');
  }

  function updateScrollIndicator() {
    if (scrollInd) {
      // When typing, hide; else, show
      scrollInd.style.opacity = typingActive ? "0" : "1";
    }
  }

  function freezeScroll(freeze) {
    if (!document.body.classList.contains('skip-terminalTyping')) {
      // Set scroll freeze
      if (freeze) {        
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
    updateScrollIndicator();
  }

  function typeLine() {
    // Freeze scroll only while typing (also triggers scroll indicator update)
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
      terminal.appendChild(div);
      // Typing ends after showing cursor
      typingActive = false;
      freezeScroll(false);
      return;
    }

    // When a new line starts, create containers appropriately and set activeElement
    if (charIndex === 0) {
      if (line.type === "command") {
        // Command line: ❯ + typing span
        const container = document.createElement("div");
        container.className = "t-line";

        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "❯";

        const typingSpan = document.createElement("span");
        typingSpan.className = "typing";

        container.appendChild(prompt);
        container.appendChild(typingSpan);
        terminal.appendChild(container);

        activeElement = typingSpan;
      } else {
        // Output & other lines: simple colored div
        const container = document.createElement("div");
        container.className = "out typing";
        container.style.color =
          line.type === "success" ? "#00f5ff" :
          line.type === "muted" ? "#8892a4" :
          "#a4ff80";

        terminal.appendChild(container);

        activeElement = container;
      }
    }

    // Append next character
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
});