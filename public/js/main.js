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
  if (window.particlesJS) {
    const particleConfig = {
      "particles": {
        "number": {
          "value": 15, // さらに5個減らしてよりスッキリ上品に
          "density": { "enable": false } 
        },
        "color": { "value": "#ffffff" },
        "shape": {
          "type": "circle",
          "stroke": { "width": 0, "color": "#000000" }
        },
        "opacity": {
          "value": 0.3,
          "random": false
        },
        "size": {
          "value": 2,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 110, // 150から110に減らし、近づいた時だけ線が繋がるようにして線の総数を減らす
          "color": "#ffffff",
          "opacity": 0.3,
          "width": 2 // 線を1px太くして2pxに
        },
        "move": {
          "enable": true,
          "speed": 0.8,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "bounce", // 枠から出ずに跳ね返る（塊を維持する）
          "bounce": true
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": false },
          "onclick": { "enable": false },
          "resize": true
        }
      },
      "retina_detect": true
    };

    ['particles-top', 'particles-mid', 'particles-bot'].forEach(id => {
      if (document.getElementById(id)) {
        particlesJS(id, particleConfig);
      }
    });
  }
});

// === 3D Tetrahedrons Canvas Animation ===
document.addEventListener('componentsReady', function () {
  const canvas = document.getElementById('hero-3d-shapes');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  
  // 3D vertices of a regular tetrahedron (4 points)
  const vertices = [
    { x: 0, y: -1, z: 0 },
    { x: 0.94, y: 0.33, z: -0.54 },
    { x: -0.47, y: 0.33, z: 0.81 },
    { x: -0.47, y: 0.33, z: -0.81 }
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [2, 3], [3, 1]
  ];

  // 4 Tasteful floating tetrahedrons at different vertical clusters
  const tetrahedrons = [
    { x: 0.3, y: 0.20, size: 12, rx: 0.2, ry: 0.5, rz: 0.1, speedX: 0.002, speedY: 0.003, speedZ: 0.001, speedFloating: 0.0006, phase: 0 },
    { x: 0.7, y: 0.40, size: 16, rx: 0.8, ry: 0.1, rz: 0.4, speedX: -0.003, speedY: 0.002, speedZ: 0.004, speedFloating: 0.0005, phase: 2 },
    { x: 0.2, y: 0.65, size: 14, rx: 0.5, ry: 0.4, rz: 0.8, speedX: 0.001, speedY: -0.003, speedZ: 0.002, speedFloating: 0.0007, phase: 4 },
    { x: 0.8, y: 0.80, size: 10, rx: 0.1, ry: 0.7, rz: 0.3, speedX: 0.004, speedY: 0.001, speedZ: -0.003, speedFloating: 0.0008, phase: 6 }
  ];

  function rotateX(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos
    };
  }

  function rotateY(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos + point.z * sin,
      y: point.y,
      z: -point.x * sin + point.z * cos
    };
  }

  function rotateZ(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos,
      z: point.z
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    tetrahedrons.forEach(t => {
      // Rotation angles update
      t.rx += t.speedX;
      t.ry += t.speedY;
      t.rz += t.speedZ;

      // Slow floating offset calculation
      t.phase += t.speedFloating;
      const floatY = Math.sin(t.phase) * 12; // Vertical floating range (px)
      const floatX = Math.cos(t.phase * 0.8) * 6; // Horizontal floating range (px)

      const cx = t.x * width + floatX;
      const cy = t.y * height + floatY;

      // Rotate and project vertices
      const projected = vertices.map(v => {
        let r = rotateX(v, t.rx);
        r = rotateY(r, t.ry);
        r = rotateZ(r, t.rz);
        
        // Orthographic projection
        return {
          x: cx + r.x * t.size,
          y: cy + r.y * t.size
        };
      });

      // Draw wireframe edges (thin lines)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'; // Faint white lines for subtle depth
      ctx.lineWidth = 1;
      edges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(projected[edge[0]].x, projected[edge[0]].y);
        ctx.lineTo(projected[edge[1]].x, projected[edge[1]].y);
        ctx.stroke();
      });

      // Draw vertices (4 small dots)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; // Semi-transparent white dots
      projected.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    requestAnimationFrame(draw);
  }

  // Initial draw
  draw();
});
