/* ─────────────────────────────────────────────────
   Arcane Portfolio – JavaScript
   - Particle canvas background
   - Smooth navbar scroll effect
   - Mobile hamburger menu
   ───────────────────────────────────────────────── */

(() => {
    'use strict';

    /* ── Particle Canvas ─────────────────────────── */
    const canvas = document.getElementById('particle-canvas');
    const ctx    = canvas.getContext('2d');

    let W, H, particles = [];

    const PARTICLE_COUNT = 80;
    const COLORS = ['#9b5de5', '#00f5d4', '#f72585', '#f8c537'];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x  = Math.random() * W;
            this.y  = initial ? Math.random() * H : H + 10;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.6 + 0.2);
            this.r  = Math.random() * 1.8 + 0.5;
            this.alpha = Math.random() * 0.6 + 0.2;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.0008;
            if (this.y < -10 || this.alpha <= 0) this.reset();
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.shadowBlur  = 8;
            ctx.shadowColor = this.color;
            ctx.fillStyle   = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => { resize(); });
    resize();
    initParticles();
    animateParticles();

    /* ── Navbar scroll effect ────────────────────── */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 16, 0.97)';
        } else {
            navbar.style.background = 'rgba(5, 5, 16, 0.85)';
        }
    });

    /* ── Mobile hamburger menu ───────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ── Smooth scroll for anchor links ─────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── Intersection Observer – reveal on scroll ── */
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity    = '1';
                    entry.target.style.transform  = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.arcane-card').forEach(card => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
})();
