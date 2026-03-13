// scroller.js

window.addEventListener("load", () => {
  const scroller = document.getElementById("scroll-box");
  const cards = document.querySelectorAll(".card");
  const progressBar = document.getElementById("progress-overlay");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentProgress = 1;

  // Update progress bar based on scroll
  function updateProgress() {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const scrollFraction = scroller.scrollLeft / maxScroll;
    progressBar.style.width = scrollFraction * 100 + "%";
  }

  // Initial progress
  updateProgress();

  // Auto-slide interval
  let autoSlide = setInterval(nextSlide, 2777);

  function prevSlide() {
    const cardWidth = cards[0].offsetWidth;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;

    if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft = maxScroll;
      currentProgress = cards.length;
    } else {
      scroller.scrollBy(-cardWidth, 0);
      currentProgress--;
    }

    updateProgress();

    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 2777);
  }

  function nextSlide() {
    const cardWidth = cards[0].offsetWidth;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;

    if (scroller.scrollLeft + cardWidth > maxScroll) {
      scroller.scrollLeft = 0;
      currentProgress = 1;
    } else {
      scroller.scrollBy(cardWidth, 0);
      currentProgress++;
    }

    updateProgress();

    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 2777);
  }

  // Attach button event listeners
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Update progress on manual scroll
  scroller.addEventListener("scroll", updateProgress);

  // Keep progress correct on window resize
  window.addEventListener("resize", updateProgress);
});
