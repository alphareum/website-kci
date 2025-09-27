// DOM Elements
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTop = document.getElementById('scrollTop');
const themeToggle = document.getElementById('themeToggle');

// Hide loader when page loads
if (loader) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });
}

// Mobile Menu Toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Header scroll effect
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.transform = currentScrollY > lastScrollY ? 'translateY(-100%)' : 'translateY(0)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
    
    // Show/hide scroll to top button
    if (currentScrollY > 500) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

// Scroll to top functionality
if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Dark Mode Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Change emoji based on theme
        themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
}

// Intersection Observer for animations
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

// Observe elements with animations
document.querySelectorAll('.vm-card, .contact-card, .social-link').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ===== SPONSOR CAROUSEL FUNCTIONALITY =====

// Business Partners Carousel
const businessCarousel = document.getElementById('businessCarousel');
const businessLeftBtn = document.getElementById('businessLeft');
const businessRightBtn = document.getElementById('businessRight');

if (businessCarousel && businessLeftBtn && businessRightBtn) {
    const scrollAmount = 280; // Card width + gap

    businessLeftBtn.addEventListener('click', () => {
        businessCarousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    businessRightBtn.addEventListener('click', () => {
        businessCarousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Update button visibility based on scroll position
    const updateBusinessButtons = () => {
        const maxScroll = businessCarousel.scrollWidth - businessCarousel.clientWidth;
        
        if (businessCarousel.scrollLeft <= 0) {
            businessLeftBtn.style.opacity = '0.5';
            businessLeftBtn.style.cursor = 'not-allowed';
        } else {
            businessLeftBtn.style.opacity = '1';
            businessLeftBtn.style.cursor = 'pointer';
        }
        
        if (businessCarousel.scrollLeft >= maxScroll - 5) {
            businessRightBtn.style.opacity = '0.5';
            businessRightBtn.style.cursor = 'not-allowed';
        } else {
            businessRightBtn.style.opacity = '1';
            businessRightBtn.style.cursor = 'pointer';
        }
    };

    businessCarousel.addEventListener('scroll', updateBusinessButtons);
    window.addEventListener('resize', updateBusinessButtons);
    updateBusinessButtons();
}

// Community Partners Carousel
const communityCarousel = document.getElementById('communityCarousel');
const communityLeftBtn = document.getElementById('communityLeft');
const communityRightBtn = document.getElementById('communityRight');

if (communityCarousel && communityLeftBtn && communityRightBtn) {
    const scrollAmount = 280; // Card width + gap

    communityLeftBtn.addEventListener('click', () => {
        communityCarousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    communityRightBtn.addEventListener('click', () => {
        communityCarousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Update button visibility based on scroll position
    const updateCommunityButtons = () => {
        const maxScroll = communityCarousel.scrollWidth - communityCarousel.clientWidth;
        
        if (communityCarousel.scrollLeft <= 0) {
            communityLeftBtn.style.opacity = '0.5';
            communityLeftBtn.style.cursor = 'not-allowed';
        } else {
            communityLeftBtn.style.opacity = '1';
            communityLeftBtn.style.cursor = 'pointer';
        }
        
        if (communityCarousel.scrollLeft >= maxScroll - 5) {
            communityRightBtn.style.opacity = '0.5';
            communityRightBtn.style.cursor = 'not-allowed';
        } else {
            communityRightBtn.style.opacity = '1';
            communityRightBtn.style.cursor = 'pointer';
        }
    };

    communityCarousel.addEventListener('scroll', updateCommunityButtons);
    window.addEventListener('resize', updateCommunityButtons);
    updateCommunityButtons();
}

// Mouse wheel horizontal scroll for desktop
document.querySelectorAll('.sponsor-carousel').forEach(carousel => {
    carousel.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            carousel.scrollLeft += e.deltaY;
        }
    });
});

// Touch scroll support for mobile
let isDown = false;
let startX;
let scrollLeft;

document.querySelectorAll('.sponsor-carousel').forEach(carousel => {
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
});