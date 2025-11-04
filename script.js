// Always start at top on first load (prevents auto-restore / embed jumps)
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

// Intersection Observer for reveal-on-scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
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
document.querySelectorAll('.event-card, .instagram-embed').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});



// dots

// Subtle moving dots background
// Subtle moving dots background with colour
const canvas = document.getElementById("dots-bg");
const ctx = canvas.getContext("2d");

let dots = [];
const numDots = 80;
const colors = [
  "rgba(206,17,38,0.8)",   // red (Palestine flag red)
  // "rgba(0,122,61,1)",    // green
  "rgba(3, 161, 82, 1)",    // green
  "rgba(255,255,255,0.5)"  // white
];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < numDots; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  });
}

function animateDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = dot.color;
    ctx.fill();

    dot.x += dot.dx;
    dot.y += dot.dy;

    if (dot.x < 0 || dot.x > canvas.width) dot.dx *= -1;
    if (dot.y < 0 || dot.y > canvas.height) dot.dy *= -1;
  }
  requestAnimationFrame(animateDots);
}
animateDots();
