document.addEventListener('DOMContentLoaded', function () {
    // Floating particles
    const techBg = document.getElementById('techBg');
    if (techBg) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = (Math.random() * 100) + '%';
            particle.style.setProperty('--x-move', ((Math.random() - 0.5) * 200) + 'px');
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            techBg.appendChild(particle);
        }
    }

    // Tech lines
    const techLines = document.getElementById('techLines');
    if (techLines) {
        for (let i = 0; i < 8; i++) {
            const line = document.createElement('div');
            line.className = 'tech-line';
            line.style.top = (Math.random() * 100) + '%';
            line.style.width = (Math.random() * 30 + 20) + '%';
            line.style.animationDuration = (Math.random() * 3 + 2) + 's';
            line.style.animationDelay = (Math.random() * 3) + 's';
            techLines.appendChild(line);
        }
    }
});
