window.addEventListener("load", () => {
  const scroller = document.getElementById("scroll-box");
  const cardWidth = document.querySelector(".card").offsetWidth;
  const maxScroll = scroller.scrollWidth - scroller.clientWidth;

  const progressBar = document.getElementById("progress-overlay");
  const cards = document.querySelectorAll(".card");
  let currentProgress = 1;
  const progressFrac = 100 / cards.length;

  const totalSlides = maxScroll / cardWidth + 1;

  progressBar.style.width = progressFrac + "%";

  let autoSlide = setInterval(nextSlide, 2777);

  function prevSlide() {
    if (scroller.scrollLeft <= 0) {
      scroller.scrollLeft = maxScroll;
      currentProgress = totalSlides;
    } else {
      scroller.scrollBy(-cardWidth, 0);
      currentProgress--;
    }
    progressBar.style.width = (currentProgress / cards.length) * 100 + "%";

    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 2777);
  }

  function nextSlide() {
    if (scroller.scrollLeft + cardWidth > maxScroll) {
      scroller.scrollLeft = 0;
      currentProgress = 1;
    } else {
      scroller.scrollBy(cardWidth, 0);
      currentProgress++;
    }
    progressBar.style.width = (currentProgress / cards.length) * 100 + "%";

    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 2777);
  }
});
