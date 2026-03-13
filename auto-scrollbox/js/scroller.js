// scroller.js

// Wait for window + all images to load
window.addEventListener("load", () => {
  const images = document.querySelectorAll(".card img");
  let loadedCount = 0;

  if (images.length === 0) {
    initCarousel(); // no images, just init
  } else {
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener("load", () => {
          loadedCount++;
          if (loadedCount === images.length) initCarousel();
        });
      }
    });
    if (loadedCount === images.length) initCarousel();
  }
});

function initCarousel() {
  const scroller = document.getElementById("scroll-box");
  const cards = Array.from(document.querySelectorAll(".card"));
  const progressBar = document.getElementById("progress-overlay");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  const totalCards = cards.length;
  let currentIndex = 0;

  // --- Clone first and last cards for seamless infinite loop ---
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
  const progressSpeed = 0.15;

  function updateTargetProgress() {
    const cardWidth = getCardWidth();
    const scroll = scroller.scrollLeft - cardWidth;
    targetProgress = (scroll / (cardWidth * totalCards)) * 100;
    targetProgress = Math.max(0, Math.min(targetProgress, 100));
  }

  function animateProgressBar() {
    currentProgress += (targetProgress - currentProgress) * progressSpeed;
    progressBar.style.width = currentProgress + "%";
    requestAnimationFrame(animateProgressBar);
  }
  animateProgressBar();

  // --- Scroll to card with animation ---
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

  // --- Arrow navigation ---
  function prevSlide() {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = totalCards - 1;
    scrollToCard(newIndex);
    resetAutoSlide();
  }

  function nextSlide() {
    let newIndex = currentIndex + 1;
    if (newIndex >= totalCards) newIndex = 0;
    scrollToCard(newIndex);
    resetAutoSlide();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // --- Auto-slide ---
  let autoSlideInterval;
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 2777);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
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

  // --- Manual scroll handling ---
  let ticking = false;
  scroller.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const cardWidth = getCardWidth();
        currentIndex = Math.round(scroller.scrollLeft / cardWidth - 1);
        if (currentIndex < 0) currentIndex = totalCards - 1;
        if (currentIndex >= totalCards) currentIndex = 0;
        updateTargetProgress();
        ticking = false;
      });
      ticking = true;
    }

    // Pause auto-slide while user interacts
    clearTimeout(autoSlideInterval);
    setTimeout(() => resetAutoSlide(), 200);
  });

  // --- Handle window resize ---
  window.addEventListener("resize", () => {
    scrollToCard(currentIndex, false);
  });

  // --- Initialize carousel ---
  scrollToCard(0, false);
  startAutoSlide();
}
