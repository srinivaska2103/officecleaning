document.addEventListener('DOMContentLoaded', () => {
  const counterElements = document.querySelectorAll('.counter-val');
  
  const startCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 2000; // Animation duration in ms
    const stepTime = Math.max(Math.floor(duration / target), 15);
    let current = 0;
    
    // For large numbers, step increments must be larger to keep time constant
    const increment = Math.ceil(target / (duration / stepTime));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        el.textContent = current.toLocaleString() + (el.getAttribute('data-suffix') || '');
      }
    }, stepTime);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counterElements.forEach(el => {
    counterObserver.observe(el);
  });
});
