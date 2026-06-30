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

// === Particles.js Initialization for Hero Section ===
document.addEventListener('componentsReady', function () {
  if (document.getElementById('particles-js') && window.particlesJS) {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 30, // 動作を軽くするため少なめに設定
          "density": { "enable": true, "value_area": 800 }
        },
        "color": { "value": "#ffffff" },
        "shape": {
          "type": "circle",
          "stroke": { "width": 0, "color": "#000000" }
        },
        "opacity": {
          "value": 0.05, // 不透明度5%
          "random": false
        },
        "size": {
          "value": 2,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.05, // 線の不透明度5%
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 0.8, // ゆっくり浮遊させる
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": false }, // パフォーマンス重視のためマウスホバー無効
          "onclick": { "enable": false },
          "resize": true
        }
      },
      "retina_detect": true
    });
  }
});
