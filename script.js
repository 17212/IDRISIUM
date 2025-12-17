// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
    });

    // Navbar Scroll Effect with Parallax
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');
    const heroCanvas = document.getElementById('hero-canvas');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const comingSoonOverlay = document.getElementById('coming-soon-overlay');
    const enterSiteBtn = document.getElementById('enter-site-btn');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar
        if (scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }

        // Parallax Hero Effects
        if (heroCanvas && scrollY < window.innerHeight) {
            heroCanvas.style.transform = `translateY(${scrollY * 0.5}px)`;
        }

        // Fade out hero content on scroll
        if (heroContent && scrollY < window.innerHeight) {
            const opacity = 1 - (scrollY / (window.innerHeight * 0.6));
            heroContent.style.opacity = Math.max(opacity, 0);
        }

        // Scale down title slightly on scroll
        if (heroTitle && scrollY < window.innerHeight) {
            const scale = 1 - (scrollY / (window.innerHeight * 2));
            heroTitle.style.transform = `scale(${Math.max(scale, 0.95)})`;
        }
    });

    if (enterSiteBtn && comingSoonOverlay) {
        enterSiteBtn.addEventListener('click', () => {
            comingSoonOverlay.classList.add('overlay-hidden');
            document.body.style.overflow = '';
        });
    }

    // Magnetic Hover Effect for Navigation Links
    const magneticLinks = document.querySelectorAll('.magnetic-link');
    magneticLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            link.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0, 0)';
        });
    });

    // Ripple Effect for CTA Buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Mobile Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.add('menu-open');
            document.body.style.overflow = 'hidden';

            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            mobileMenu.classList.remove('menu-open');
            document.body.style.overflow = '';

            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.transform = 'none';
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Particle System
    initParticles();

    // Stagger Animation Observer
    initStaggerAnimations();
});

function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor(width * height / 25000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#39FF14';

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.globalAlpha = (1 - dist / 150) * 0.15;
                    ctx.strokeStyle = '#39FF14';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    resize();
    createParticles();
    draw();
}

// Stagger Animations for Product Cards
function initStaggerAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('stagger-item');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe future module cards
    const moduleCards = document.querySelectorAll('#products .grid > div');
    moduleCards.forEach((card, index) => {
        card.style.setProperty('--stagger-index', index);
        observer.observe(card);
    });
}

// IDRIVIA 3D Carousel Logic
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    if (!track) return;

    const images = [
        "idrivia_shots/Screenshot_1763998692.png",
        "idrivia_shots/Screenshot_1763998764.png",
        "idrivia_shots/Screenshot_1763998888.png",
        "idrivia_shots/Screenshot_1763998929.png",
        "idrivia_shots/Screenshot_1763999057.png"
    ];

    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'carousel-item';
        img.alt = `Screen ${index + 1}`;
        img.loading = 'lazy'; // Lazy loading
        track.appendChild(img);
    });

    const items = Array.from(track.querySelectorAll('.carousel-item'));
    let currentIndex = 0;
    let autoRotateInterval;

    function updateCarousel() {
        items.forEach((item, index) => {
            item.className = 'carousel-item';

            let diff = (index - currentIndex) % items.length;
            if (diff < 0) diff += items.length;

            if (diff > items.length / 2) diff -= items.length;

            if (diff === 0) {
                item.classList.add('active');
            } else if (diff === 1) {
                item.classList.add('next');
            } else if (diff === -1) {
                item.classList.add('prev');
            } else if (diff > 1) {
                item.classList.add('hidden-right');
            } else {
                item.classList.add('hidden-left');
            }
        });
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }, 2000); // Changed from 3000ms to 2000ms
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    // Initial State
    updateCarousel();
    startAutoRotate();

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoRotate);
    track.addEventListener('mouseleave', startAutoRotate);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
            stopAutoRotate();
            setTimeout(startAutoRotate, 5000);
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
            stopAutoRotate();
            setTimeout(startAutoRotate, 5000);
        }
    });
});
