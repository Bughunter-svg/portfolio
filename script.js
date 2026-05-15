// ===== Reduced motion =====
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = motionQuery.matches;

// ===== Matrix Rain Background =====
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
const fontSize = 14;
let columns = 0;
let drops = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = fontSize + 'px JetBrains Mono';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

function matrixLoop() {
    if (!prefersReducedMotion && document.visibilityState === 'visible') {
        drawMatrix();
    }
    requestAnimationFrame(matrixLoop);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
requestAnimationFrame(matrixLoop);

// ===== Cursor Glow (lerp) =====
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0;
let mouseY = 0;
let glowX = 0;
let glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function updateGlow() {
    const t = prefersReducedMotion ? 1 : 0.12;
    glowX = lerp(glowX, mouseX, t);
    glowY = lerp(glowY, mouseY, t);
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    cursorGlow.style.opacity = prefersReducedMotion ? '0.35' : '1';
    requestAnimationFrame(updateGlow);
}
updateGlow();

// ===== Navbar =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const sections = document.querySelectorAll('.section, #hero');
const navLinksAll = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach((section) => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinksAll.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}
window.addEventListener('scroll', updateActiveNav);

// ===== Typing Effect =====
function typeText(elementId, text, speed = 60) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let i = 0;
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

setTimeout(() => typeText('typed-name', 'Harshith N'), 300);
setTimeout(() => typeText('typed-role', 'B.E. ECE Student · Ethical Hacking · Penetration Testing'), 1000);

// ===== Rotating hero line =====
const heroRotating = document.getElementById('hero-rotating');
const rotatingPhrases = [
    'CTF competitor · Enumeration · Privilege escalation',
    'Home lab · Virtualized attack ranges · Tooling',
    'Web exploitation · Binary analysis · Reverse engineering',
    'Break it · Understand it · Rebuild it stronger',
];
let rotateIndex = 0;

function setHeroRotating() {
    if (!heroRotating) return;
    heroRotating.textContent = rotatingPhrases[rotateIndex % rotatingPhrases.length];
    rotateIndex += 1;
}

setHeroRotating();

let rotateIntervalId = null;
function startRotateInterval() {
    if (rotateIntervalId) clearInterval(rotateIntervalId);
    if (prefersReducedMotion || !heroRotating) return;
    rotateIntervalId = setInterval(setHeroRotating, 4200);
}

function stopRotateInterval() {
    if (rotateIntervalId) {
        clearInterval(rotateIntervalId);
        rotateIntervalId = null;
    }
}

startRotateInterval();

motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
        stopRotateInterval();
        if (heroRotating) heroRotating.textContent = rotatingPhrases[0];
    } else {
        startRotateInterval();
    }
});

// ===== Counter Animation =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll(
    '.glass-card, .section-title, .timeline-item, .education-timeline, .platforms-inner'
);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.querySelectorAll('.skill-progress').forEach((bar) => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

revealElements.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
});

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    counterObserver.observe(heroStats);
}

// ===== Smooth scroll for in-page anchors =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id.length <= 1) return;
        e.preventDefault();
        const target = document.querySelector(id);
        if (target) {
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
});

// ===== Back to top =====
const backToTop = document.getElementById('back-to-top');
const heroEl = document.getElementById('hero');

if (backToTop && heroEl) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
        heroEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

// ===== Staggered animation for cards =====
document.querySelectorAll('[data-delay]').forEach((el) => {
    const delay = parseInt(el.getAttribute('data-delay'), 10) * 100;
    el.style.transitionDelay = delay + 'ms';
});
