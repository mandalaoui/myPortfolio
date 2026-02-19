const modal = document.getElementById("videoModal");
const video = document.getElementById("videoPlayer");
const closeBtn = document.querySelector(".modal .close");
const source = document.getElementById("videoSource");

function openVideoModal(videoUrl) {
    source.src = videoUrl;
    video.load();

    modal.style.display = "block";
    video.play();

}

closeBtn.onclick = () => {
    video.pause();
    video.currentTime = 0;
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        video.pause();
        video.currentTime = 0;
        modal.style.display = "none";
    }
};

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        video.pause();
        video.currentTime = 0;
        modal.style.display = "none";
    }
});



function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? 'crimson' : getComputedStyle(document.documentElement).getPropertyValue('--primary');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function scrollProjects(direction) {
  const carousel = document.getElementById('projectsCarousel');
  const scrollAmount = window.innerWidth * 0.4;
  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}