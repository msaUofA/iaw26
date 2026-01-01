/* script.js */

// --- SCROLL MANAGEMENT ---
// Always start at top on first load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

// Smooth scroll when clicking the down arrow
document.getElementById('scrollIndicator')?.addEventListener('click', () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  });
});

// --- INTERSECTION OBSERVER (Fade-in animations) ---
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Prepare and observe cards
document.querySelectorAll('.event-card, .instagram-embed, .donation-section').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(card);
});

// --- BUBBLE ANIMATION SYSTEM ---
const canvas = document.getElementById("dots-bg");
const ctx = canvas.getContext("2d");

let bubbles = [];
const numBubbles = 60; // Clean, not too crowded

// Ocean Theme Colors for Bubbles
const colors = [
  "rgba(224, 251, 252, 0.3)",   // Foam White
  "rgba(10, 147, 150, 0.3)",    // Teal
  "rgba(72, 202, 228, 0.2)"     // Light Cyan
];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Bubble {
  constructor() {
    this.reset();
    // Initialize scattered across height so screen isn't empty on load
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100; // Start just below screen
    this.r = Math.random() * 3 + 1; // Radius
    this.speed = Math.random() * 1 + 0.5; // Upward speed
    this.sway = Math.random() * 0.5 + 0.2; // Sway amplitude
    this.frequency = Math.random() * 0.02 + 0.01; // Sway speed
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.time = Math.random() * 100; // Random starting phase for sway
  }

  update() {
    // Move Up
    this.y -= this.speed;
    
    // Sway side to side (Sine wave motion)
    this.time++;
    this.x += Math.sin(this.time * this.frequency) * this.sway;

    // Reset if it goes off top
    if (this.y < -10) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Initialize Bubbles
for (let i = 0; i < numBubbles; i++) {
  bubbles.push(new Bubble());
}

function animateBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let bubble of bubbles) {
    bubble.update();
    bubble.draw();
  }
  
  requestAnimationFrame(animateBubbles);
}

// Start Animation
animateBubbles();
