// scroller.js

window.addEventListener("load", () => {
  const scroller = document.getElementById("scroll-box");
  const cards = Array.from(document.querySelectorAll(".card"));
  const progressBar = document.getElementById("progress-overlay");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  const totalCards = cards.length;
  let currentIndex = 0;

  // --- Clone first and last cards for infinite seamless loop ---
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[totalCards - 1].cloneNode(true);
  scroller.appendChild(firstClone);
  scroller.insertBefore(lastClone, scroller.firstChild);

  function getCardWidth() {
    return cards[0].offsetWidth;
  }

  // --- Smooth progress bar ---
  let targetProgress = 0;
  let currentProgress = 0;
  const progressSpeed = 0.2; // faster animation

  function updateTargetProgress() {
    const cardWidth = getCardWidth();
    const scroll = scroller.scrollLeft - cardWidth;
    const rawProgress = scroll / (cardWidth * (totalCards - 1));
    targetProgress = Math.min(Math.max(rawProgress * 100, 0), 100);
    // Ensure final slide shows 100%
    if (currentIndex === totalCards - 1) targetProgress = 100;
  }

  function animateProgressBar() {
    currentProgress += (targetProgress - currentProgress) * progressSpeed;
    progressBar.style.width = currentProgress + "%";
    requestAnimationFrame(animateProgressBar);
  }
  animateProgressBar();

  // --- Smooth scroll to card ---
  function animateScroll(targetIndex, duration = 500) {
    const cardWidth = getCardWidth();
    const start = scroller.scrollLeft;
    const end = cardWidth * (targetIndex + 1);
    const distance = end - start;
    const startTime = performance.now();

    function step(time) {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      scroller.scrollLeft = start + distance * easeInOutQuad(t);
      updateTargetProgress();
      if (t < 1) requestAnimationFrame(step);
      else {
        currentIndex = targetIndex;
        checkInfiniteLoop();
      }
    }
    requestAnimationFrame(step);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function scrollToCard(index, smooth = true) {
    if (smooth) animateScroll(index);
    else {
      const cardWidth = getCardWidth();
      scroller.scrollLeft = cardWidth * (index + 1);
      currentIndex = index;
      updateTargetProgress();
    }
  }

  // --- Infinite loop handling ---
  function checkInfiniteLoop() {
    const cardWidth = getCardWidth();
    if (scroller.scrollLeft >= cardWidth * (totalCards + 1)) {
      scroller.scrollLeft = cardWidth;
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft = cardWidth * totalCards;
    }
    updateTargetProgress();
  }

  // --- Slide navigation ---
  function prevSlide() {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = totalCards - 1;
    scrollToCard(newIndex);
    pauseAndResetAutoSlide();
  }

  function nextSlide() {
    let newIndex = currentIndex + 1;
    if (newIndex >= totalCards) newIndex = 0;
    scrollToCard(newIndex);
    pauseAndResetAutoSlide();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // --- Auto-slide ---
  let autoSlideInterval;
  const autoSlideDelay = 2777;
  let autoSlideTimeout;

  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, autoSlideDelay);
  }

  function pauseAndResetAutoSlide() {
    clearInterval(autoSlideInterval);
    clearTimeout(autoSlideTimeout);

    autoSlideTimeout = setTimeout(() => {
      startAutoSlide();
    }, 1000); // delay after interaction
  }

  // --- Manual scroll handling ---
  let ticking = false;
  scroller.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const cardWidth = getCardWidth();
        currentIndex = Math.round((scroller.scrollLeft / cardWidth) - 1);
        if (currentIndex < 0) currentIndex = totalCards - 1;
        if (currentIndex >= totalCards) currentIndex = 0;
        updateTargetProgress();
        ticking = false;
      });
      ticking = true;
    }
    // Any scroll interaction resets auto-slide
    pauseAndResetAutoSlide();
  });

  // --- Reset auto-slide on drag / swipe ---
  let isDragging = false;
  scroller.addEventListener("mousedown", () => { isDragging = true; pauseAndResetAutoSlide(); });
  scroller.addEventListener("touchstart", () => { isDragging = true; pauseAndResetAutoSlide(); });
  scroller.addEventListener("mouseup", () => { if (isDragging) { isDragging = false; pauseAndResetAutoSlide(); } });
  scroller.addEventListener("touchend", () => { if (isDragging) { isDragging = false; pauseAndResetAutoSlide(); } });

  // --- Window resize ---
  window.addEventListener("resize", () => {
    scrollToCard(currentIndex, false);
  });

  // --- Initialize ---
  scrollToCard(0, false);
  startAutoSlide();
}