// scroller.js

window.addEventListener("load", () => {
  const scroller = document.getElementById("scroll-box");
  const cards = Array.from(document.querySelectorAll(".card"));
  const progressBar = document.getElementById("progress-overlay");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  const totalCards = cards.length;
  let currentIndex = 0;

  // --- Clone first and last cards for seamless looping ---
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[totalCards - 1].cloneNode(true);

  scroller.appendChild(firstClone);
  scroller.insertBefore(lastClone, scroller.firstChild);

  function getCardWidth() {
    return cards[0].offsetWidth;
  }

  // Throttle progress bar
  let lastProgress = -1;
  function updateProgress() {
    const progress = ((currentIndex + 1) / totalCards) * 100;
    if (Math.abs(progress - lastProgress) >= 0.5) {
      progressBar.style.width = progress + "%";
      lastProgress = progress;
    }
  }

  // Scroll to a card using manual animation
  function animateScroll(targetIndex, duration = 500) {
    const cardWidth = getCardWidth();
    const start = scroller.scrollLeft;
    const end = cardWidth * (targetIndex + 1); // +1 because of clone
    const distance = end - start;
    const startTime = performance.now();

    function step(time) {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      scroller.scrollLeft = start + distance * easeInOutQuad(t);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        currentIndex = targetIndex;
        updateProgress();
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
      updateProgress();
    }
  }

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

  let autoSlideInterval;
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 2777);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Handle infinite loop
  function checkInfiniteLoop() {
    const cardWidth = getCardWidth();
    if (scroller.scrollLeft >= cardWidth * (totalCards + 1)) {
      scroller.scrollLeft = cardWidth;
    } else if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft = cardWidth * totalCards;
    }
  }

  // Manual scroll handling
  let ticking = false;
  scroller.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const cardWidth = getCardWidth();
        currentIndex = Math.round(scroller.scrollLeft / cardWidth - 1);
        if (currentIndex < 0) currentIndex = totalCards - 1;
        if (currentIndex >= totalCards) currentIndex = 0;
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener("resize", () => {
    scrollToCard(currentIndex, false);
  });

  // Initialize
  scrollToCard(0, false);
  startAutoSlide();
});
