const modal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const closeBtn = document.querySelector(".modal .close");

function openVideoModal(videoUrl) {
    videoFrame.src = videoUrl;
    modal.style.display = "block";
}

closeBtn.onclick = () => {
    videoFrame.src = ""; // Stop video
    videoFrame.muted = true; 
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        videoFrame.src = "";
        modal.style.display = "none";
    }
};

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