// Scroll management
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

document.getElementById('scrollIndicator')?.addEventListener('click', () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  });
});

// Intersection Observer
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

document.querySelectorAll('.event-card, .instagram-embed, .donation-section').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(card);
});

// Ocean wave physics simulation
const oceanCanvas = document.getElementById('ocean-canvas');
const oceanCtx = oceanCanvas.getContext('2d');

let w, h;
const waves = [];
const numWaves = 6;
const foam = [];

function resizeOcean() {
  w = oceanCanvas.width = window.innerWidth;
  h = oceanCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeOcean);
resizeOcean();

for (let i = 0; i < numWaves; i++) {
  waves.push({
    amplitude: 35 + i * 22,
    frequency: 0.0016 - i * 0.00018,
    speed: 0.025 + i * 0.008,
    offset: (i * Math.PI) / 2.8,
    y: h * 0.28 + i * 65,
    opacity: 0.25 - i * 0.025,
    color: i % 2 === 0 ? [0, 147, 150] : [0, 95, 115]
  });
}

let time = 0;

function drawWave(wave, t) {
  oceanCtx.beginPath();
  oceanCtx.moveTo(0, h);
  
  const points = [];
  
  for (let x = 0; x <= w; x += 3) {
    const y = wave.y + 
      Math.sin(x * wave.frequency + t + wave.offset) * wave.amplitude +
      Math.sin(x * wave.frequency * 2.2 + t * 1.7) * (wave.amplitude * 0.38) +
      Math.sin(x * wave.frequency * 0.65 + t * 0.52) * (wave.amplitude * 0.58) +
      Math.cos(x * wave.frequency * 1.15 + t * 1.15) * (wave.amplitude * 0.23);
    
    points.push({ x, y });
    oceanCtx.lineTo(x, y);
  }
  
  oceanCtx.lineTo(w, h);
  oceanCtx.closePath();
  
  const gradient = oceanCtx.createLinearGradient(0, wave.y - 140, 0, h);
  gradient.addColorStop(0, `rgba(${wave.color[0]}, ${wave.color[1]}, ${wave.color[2]}, ${wave.opacity})`);
  gradient.addColorStop(0.35, `rgba(${wave.color[0] - 15}, ${wave.color[1] - 25}, ${wave.color[2] - 25}, ${wave.opacity * 0.88})`);
  gradient.addColorStop(0.75, `rgba(0, 70, 100, ${wave.opacity * 0.65})`);
  gradient.addColorStop(1, `rgba(0, 35, 70, ${wave.opacity * 0.35})`);
  
  oceanCtx.fillStyle = gradient;
  oceanCtx.fill();
  
  oceanCtx.strokeStyle = `rgba(224, 251, 252, ${wave.opacity * 0.5})`;
  oceanCtx.lineWidth = 1.5;
  oceanCtx.beginPath();
  
  points.forEach((point, i) => {
    if (i === 0) {
      oceanCtx.moveTo(point.x, point.y);
    } else {
      oceanCtx.lineTo(point.x, point.y);
    }
  });
  oceanCtx.stroke();
  
  return points;
}

function createFoam(x, y, wave) {
  if (Math.random() > 0.996) {
    foam.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 1.8,
      vy: -Math.random() * 2.8 - 0.8,
      life: 1,
      size: Math.random() * 3.5 + 1.8,
      opacity: wave.opacity
    });
  }
}

function updateFoam() {
  for (let i = foam.length - 1; i >= 0; i--) {
    const f = foam[i];
    f.x += f.vx;
    f.y += f.vy;
    f.vy += 0.09;
    f.life -= 0.018;
    
    if (f.life <= 0) {
      foam.splice(i, 1);
    } else {
      oceanCtx.fillStyle = `rgba(224, 251, 252, ${f.life * f.opacity * 0.7})`;
      oceanCtx.beginPath();
      oceanCtx.arc(f.x, f.y, f.size * f.life, 0, Math.PI * 2);
      oceanCtx.fill();
    }
  }
}

function animateOcean() {
  oceanCtx.clearRect(0, 0, w, h);
  
  time += 0.013;
  
  waves.forEach((wave) => {
    const points = drawWave(wave, time * wave.speed);
    
    points.forEach((point, j) => {
      if (j > 0 && j < points.length - 1) {
        const prevY = points[j - 1].y;
        const nextY = points[j + 1].y;
        
        if (point.y < prevY && point.y < nextY && point.y < wave.y) {
          createFoam(point.x, point.y, wave);
        }
      }
    });
  });
  
  updateFoam();
  
  requestAnimationFrame(animateOcean);
}

animateOcean();

// Bubble animation system
const bubbleCanvas = document.getElementById("dots-bg");
const bubbleCtx = bubbleCanvas.getContext("2d");

let bubbles = [];
const numBubbles = 55;

const colors = [
  "rgba(224, 251, 252, 0.3)",
  "rgba(10, 147, 150, 0.3)",
  "rgba(72, 202, 228, 0.2)"
];

function resizeBubbles() {
  bubbleCanvas.width = window.innerWidth;
  bubbleCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBubbles);
resizeBubbles();

class Bubble {
  constructor() {
    this.reset();
    this.y = Math.random() * bubbleCanvas.height;
  }

  reset() {
    this.x = Math.random() * bubbleCanvas.width;
    this.y = bubbleCanvas.height + Math.random() * 100;
    this.r = Math.random() * 3 + 1;
    this.speed = Math.random() * 1 + 0.5;
    this.sway = Math.random() * 0.5 + 0.2;
    this.frequency = Math.random() * 0.02 + 0.01;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.time = Math.random() * 100;
  }

  update() {
    this.y -= this.speed;
    this.time++;
    this.x += Math.sin(this.time * this.frequency) * this.sway;

    if (this.y < -10) {
      this.reset();
    }
  }

  draw() {
    bubbleCtx.beginPath();
    bubbleCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    bubbleCtx.fillStyle = this.color;
    bubbleCtx.fill();
  }
}

for (let i = 0; i < numBubbles; i++) {
  bubbles.push(new Bubble());
}

function animateBubbles() {
  bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);
  
  for (let bubble of bubbles) {
    bubble.update();
    bubble.draw();
  }
  
  requestAnimationFrame(animateBubbles);
}

animateBubbles();

// Countdown Timer Logic
function updateCountdown() {
  // Target Date: Jan 5, 2026, 12:00:00 MST (GMT-0700)
  const targetDate = new Date("2026-01-06T17:00:00-07:00").getTime();
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    // Optional: Handle what happens when timer ends
    document.getElementById("countdown").innerHTML = "<div class='time-block'><span>EVENT STARTED</span></div>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Helper to add leading zero
  const formatTime = (time) => time < 10 ? `0${time}` : time;

  const dElem = document.getElementById("days");
  const hElem = document.getElementById("hours");
  const mElem = document.getElementById("minutes");
  const sElem = document.getElementById("seconds");

  if(dElem) dElem.innerText = formatTime(days);
  if(hElem) hElem.innerText = formatTime(hours);
  if(mElem) mElem.innerText = formatTime(minutes);
  if(sElem) sElem.innerText = formatTime(seconds);
}

// Update immediately then every second
updateCountdown();
setInterval(updateCountdown, 1000);
