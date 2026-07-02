document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Dark Mode Toggle Logic
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      updateThemeToggles(true);
    } else {
      document.documentElement.classList.remove('dark');
      updateThemeToggles(false);
    }
  };

  const updateThemeToggles = (isDark) => {
    const themeIcons = document.querySelectorAll('.theme-toggle-icon');
    themeIcons.forEach(icon => {
      if (isDark) {
        icon.setAttribute('data-lucide', 'sun');
      } else {
        icon.setAttribute('data-lucide', 'moon');
      }
    });
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'dark-none'); // Using distinct negative value
    updateThemeToggles(isDark);
  };

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  initTheme();

  // 3. LTR/RTL Toggle Logic
  const initDirection = () => {
    const savedDir = localStorage.getItem('dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirectionToggles(savedDir);
  };

  const updateDirectionToggles = (direction) => {
    const dirTexts = document.querySelectorAll('.dir-toggle-text');
    dirTexts.forEach(text => {
      text.textContent = direction === 'ltr' ? 'LTR' : 'RTL';
    });
  };

  const toggleDirection = () => {
    const currentDir = document.documentElement.getAttribute('dir');
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('dir', newDir);
    updateDirectionToggles(newDir);
    // Reload icons because structure flips
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  const dirToggleBtns = document.querySelectorAll('.dir-toggle-btn');
  dirToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleDirection);
  });

  initDirection();

  // 4. Sticky Header
  const header = document.querySelector('header');
  const handleScrollHeader = () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('bg-white/95', 'dark:bg-slate-900/95', 'shadow-md', 'backdrop-blur-md', 'border-b', 'border-slate-100', 'dark:border-slate-800');
        header.classList.remove('bg-transparent');
      } else {
        header.classList.remove('bg-white/95', 'dark:bg-slate-900/95', 'shadow-md', 'backdrop-blur-md', 'border-b', 'border-slate-100', 'dark:border-slate-800');
        header.classList.add('bg-transparent');
      }
    }
  };
  window.addEventListener('scroll', handleScrollHeader);
  handleScrollHeader();

  // 5. Mobile Hamburger Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        if (mobileMenuIcon) mobileMenuIcon.setAttribute('data-lucide', 'menu');
      } else {
        mobileMenu.classList.remove('hidden');
        if (mobileMenuIcon) mobileMenuIcon.setAttribute('data-lucide', 'x');
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  // 6. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('text-primary', 'dark:text-secondary', 'font-semibold');
      link.classList.remove('text-slate-600', 'dark:text-slate-300');
    } else {
      link.classList.remove('text-primary', 'dark:text-secondary', 'font-semibold');
      link.classList.add('text-slate-600', 'dark:text-slate-300');
    }
  });

  // 7. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .zoom-in');
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. FAQ Accordion Logic
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const activeHeader = document.querySelector('.accordion-header.active-faq');
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');

      if (activeHeader && activeHeader !== header) {
        activeHeader.classList.remove('active-faq');
        activeHeader.nextElementSibling.classList.add('max-h-0', 'opacity-0');
        activeHeader.nextElementSibling.classList.remove('py-4');
        const activeIcon = activeHeader.querySelector('.accordion-icon');
        if (activeIcon) {
          activeIcon.style.transform = 'rotate(0deg)';
        }
      }

      header.classList.toggle('active-faq');
      if (header.classList.contains('active-faq')) {
        content.classList.remove('max-h-0', 'opacity-0');
        content.classList.add('py-4');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('max-h-0', 'opacity-0');
        content.classList.remove('py-4');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  // 10. Interactive Before/After Slider
  const comparisonContainer = document.querySelector('.comparison-container');
  if (comparisonContainer) {
    const handle = comparisonContainer.querySelector('.comparison-handle');
    const afterImg = comparisonContainer.querySelector('.comparison-after');

    const moveSlider = (clientX) => {
      const rect = comparisonContainer.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      handle.style.left = `${percentage}%`;
      afterImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    let isDragging = false;

    // Mouse Events
    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Touch Events
    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        moveSlider(e.touches[0].clientX);
      }
    });
  }
});
