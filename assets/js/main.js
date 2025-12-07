document.addEventListener('DOMContentLoaded', function () {
  console.log('Main JS loaded');

  // === Gallery Infinite Scroll ===
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    const viewport = gallery.querySelector('.gallery__viewport');
    const seed = gallery.querySelector('.gallery__seed');
    
    // Clone the list for infinite scroll effect
    const clone = seed.cloneNode(true);
    clone.classList.remove('gallery__seed');
    clone.classList.add('gallery__clone');
    clone.setAttribute('aria-hidden', 'true');
    
    const mover = gallery.querySelector('.gallery__mover');
    mover.appendChild(clone);

    // Animation Logic
    let startX = 0;
    let offsetX = 0;
    let isDragging = false;
    let rafId = null;

    function calcStep() {
      const speedSec = parseFloat(gallery.getAttribute('data-speed')) || 60;
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const pxPerSec = vw / speedSec;
      return pxPerSec / 60;
    }

    let step = calcStep();

    function seedWidth() {
      return seed.scrollWidth;
    }

    function tick() {
      offsetX -= step;
      const w = seedWidth();
      if (-offsetX >= w) {
        offsetX += w;
      }
      mover.style.transform = `translateX(${offsetX}px)`;
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      stop();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      rafId = requestAnimationFrame(tick);
    }

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // Initialize
    start();

    // Event Listeners
    window.addEventListener('resize', () => {
      step = calcStep();
    });

    // Pause on hover/focus
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('mouseleave', start);
    viewport.addEventListener('focusout', start);
  }
});
