document.addEventListener('DOMContentLoaded', function() {
  // Select all the slides
  const slides = document.querySelectorAll('.slides > div');
  const navLinks = document.querySelectorAll('.slider > a');

  // Create an IntersectionObserver to track when a slide comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the slide is in view, highlight the corresponding link
      if (entry.isIntersecting) {
        // Get the slide ID and map it to the corresponding navigation link
        const slideId = entry.target.id;
        const navLink = document.querySelector(`#nav-${slideId}`);
        
        // Add a class to the nav link to mimic the hover state
        navLinks.forEach(link => link.classList.remove('hovered'));
        navLink.classList.add('hovered');
      }
    });
  }, { threshold: 0.5 }); // Adjust the threshold as needed

  // Observe each slide
  slides.forEach(slide => observer.observe(slide));
});

document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slides > div');
  
  // Set up the IntersectionObserver to detect when a slide is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the slide is in view, add 'in-view' class and remove 'out-of-view' class
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.classList.remove('out-of-view');
      } else {
        // If the slide is not in view, add 'out-of-view' class and remove 'in-view'
        entry.target.classList.add('out-of-view');
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.5 }); // Adjust the threshold based on how much of the slide should be visible

  // Observe each slide
  slides.forEach(slide => observer.observe(slide));
});
