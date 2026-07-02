document.addEventListener('DOMContentLoaded', () => {
  // 1. Gallery Filtering Logic
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('bg-primary', 'text-white', 'dark:bg-secondary'));
        filterBtns.forEach(b => b.classList.add('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300'));
        
        // Add active class to clicked button
        btn.classList.add('bg-primary', 'text-white', 'dark:bg-secondary');
        btn.classList.remove('bg-slate-100', 'text-slate-600', 'dark:bg-slate-800', 'dark:text-slate-300');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const categories = item.getAttribute('data-category').split(' ');
          if (filter === 'all' || categories.includes(filter)) {
            item.classList.remove('hidden');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }

  // 2. Lightbox Modal Logic
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  if (lightbox && galleryItems.length > 0) {
    let currentIndex = 0;
    const visibleImages = [];

    const updateLightboxImage = () => {
      if (visibleImages[currentIndex]) {
        const img = visibleImages[currentIndex].querySelector('img');
        const title = visibleImages[currentIndex].querySelector('h3')?.textContent || 'CleanPro Facility';
        const desc = visibleImages[currentIndex].querySelector('p')?.textContent || '';
        
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightboxCaption.innerHTML = `<span class="font-semibold block text-lg">${title}</span><span class="text-sm text-slate-400">${desc}</span>`;
        }
      }
    };

    galleryItems.forEach((item) => {
      // Find the clickable link/overlay inside the item
      const viewBtn = item.querySelector('.lightbox-trigger');
      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Re-populate visible images at click time based on active filters
          visibleImages.length = 0;
          galleryItems.forEach(gi => {
            if (!gi.classList.contains('hidden')) {
              visibleImages.push(gi);
            }
          });
          
          currentIndex = visibleImages.indexOf(item);
          updateLightboxImage();
          
          lightbox.classList.remove('hidden');
          lightbox.classList.add('flex');
          document.body.style.overflow = 'hidden'; // Stop page scrolling
        });
      }
    });

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on clicking outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });

    // Next & Prev functionality
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (visibleImages.length > 1) {
          currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
          updateLightboxImage();
        }
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (visibleImages.length > 1) {
          currentIndex = (currentIndex + 1) % visibleImages.length;
          updateLightboxImage();
        }
      });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        if (visibleImages.length > 1) {
          currentIndex = (currentIndex + 1) % visibleImages.length;
          updateLightboxImage();
        }
      } else if (e.key === 'ArrowLeft') {
        if (visibleImages.length > 1) {
          currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
          updateLightboxImage();
        }
      }
    });
  }
});
