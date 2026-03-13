// scroller.js

window.addEventListener("load", () => {
  const scroller = document.getElementById("scroll-box");
  const cards = Array.from(document.querySelectorAll(".card"));
  const progressBar = document.getElementById("progress-overlay");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  const totalCards = cards.length;
  let currentIndex = 0;
  let autoSlideTimeout;
  const autoSlideDelay = 2777;
  let userInteracting = false;
  let animationFrame = null;

  function getCardWidth() {
    return cards[0].offsetWidth;
  }

  // --- Smooth scroll to target index ---
  function smoothScrollTo(targetIndex, duration = 400) {
    cancelAnimationFrame(animationFrame);
    const cardWidth = getCardWidth();
    const start = scroller.scrollLeft;
    const end = cardWidth * targetIndex;
    const distance = end - start;
    const startTime = performance.now();

    function step(time) {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      scroller.scrollLeft = start + distance * easeInOutQuad(t);
      updateProgressBar();
      if (t < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        currentIndex = targetIndex;
      }
    }
    animationFrame = requestAnimationFrame(step);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // --- Progress bar ---
  function updateProgressBar() {
    const scroll = scroller.scrollLeft;
    const maxScroll = getCardWidth() * (totalCards - 1);
    let progress = Math.min(Math.max((scroll / maxScroll) * 100, 0), 100);
    if (currentIndex >= totalCards - 1) progress = 100;
    progressBar.style.width = progress + "%";
  }

  // --- Slide navigation ---
  function goToSlide(index) {
    smoothScrollTo(index);
    pauseAndResetAutoSlide();
  }

  function nextSlide() {
    let newIndex = (currentIndex + 1) % totalCards;
    goToSlide(newIndex);
  }

  function prevSlide() {
    let newIndex = (currentIndex - 1 + totalCards) % totalCards;
    goToSlide(newIndex);
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // --- Auto-slide control ---
  function startAutoSlide() {
    clearTimeout(autoSlideTimeout);
    if (!userInteracting) {
      autoSlideTimeout = setTimeout(nextSlide, autoSlideDelay);
    }
  }

  function pauseAndResetAutoSlide() {
    userInteracting = true;
    clearTimeout(autoSlideTimeout);
    setTimeout(() => {
      userInteracting = false;
      startAutoSlide();
    }, 1000); // restart after 1s of inactivity
  }

  // --- Manual scroll / swipe ---
  let isDragging = false;
  scroller.addEventListener("mousedown", () => {
    isDragging = true;
    pauseAndResetAutoSlide();
  });
  scroller.addEventListener("touchstart", () => {
    isDragging = true;
    pauseAndResetAutoSlide();
  });
  scroller.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      pauseAndResetAutoSlide();
    }
  });
  scroller.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false;
      pauseAndResetAutoSlide();
    }
  });

  scroller.addEventListener("scroll", () => {
    const cardWidth = getCardWidth();
    currentIndex = Math.round(scroller.scrollLeft / cardWidth);
    updateProgressBar();
    pauseAndResetAutoSlide();
  });

  // --- Window resize ---
  window.addEventListener("resize", () => smoothScrollTo(currentIndex, 0));

  // --- Initialize ---
  smoothScrollTo(0, 0);
  startAutoSlide();
});
