// scroller.js

window.addEventListener("load", () => {
  const scroller = document.getElementById("scroll-box");
  const cards = Array.from(document.querySelectorAll(".card"));
  const progressBar = document.getElementById("progress-overlay");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  const totalCards = cards.length;
  let currentIndex = 0;
  let autoSlideInterval;
  const autoSlideDelay = 2777;

  function getCardWidth() {
    return cards[0].offsetWidth;
  }

  // --- Update progress bar ---
  function updateProgressBar() {
    const cardWidth = getCardWidth();
    const scroll = scroller.scrollLeft;
    const rawProgress = scroll / (cardWidth * (totalCards - 1));
    let progress = Math.min(Math.max(rawProgress * 100, 0), 100);
    if (currentIndex === totalCards - 1) progress = 100; // final slide full
    progressBar.style.width = progress + "%";
  }

  // --- Scroll to slide ---
  function scrollToIndex(index, smooth = true) {
    const cardWidth = getCardWidth();
    scroller.scrollTo({
      left: cardWidth * index,
      behavior: smooth ? "smooth" : "auto",
    });
    currentIndex = index;
    updateProgressBar();
  }

  // --- Next / Prev slides ---
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    scrollToIndex(currentIndex);
    resetAutoSlide();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    scrollToIndex(currentIndex);
    resetAutoSlide();
  }

  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // --- Auto-slide ---
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // --- Handle manual scroll / swipe ---
  let isDragging = false;

  scroller.addEventListener("mousedown", () => {
    isDragging = true;
    resetAutoSlide();
  });
  scroller.addEventListener("touchstart", () => {
    isDragging = true;
    resetAutoSlide();
  });
  scroller.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      resetAutoSlide();
    }
  });
  scroller.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false;
      resetAutoSlide();
    }
  });
  scroller.addEventListener("scroll", () => {
    const cardWidth = getCardWidth();
    currentIndex = Math.round(scroller.scrollLeft / cardWidth);
    updateProgressBar();
    resetAutoSlide();
  });

  // --- Window resize ---
  window.addEventListener("resize", () => scrollToIndex(currentIndex, false));

  // --- Initialize ---
  scrollToIndex(0, false);
  startAutoSlide();
});
