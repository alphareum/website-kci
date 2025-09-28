// DOM Elements
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTop = document.getElementById('scrollTop');
const themeToggle = document.getElementById('themeToggle');
const apiBase = document.documentElement.getAttribute('data-api-base') || '/api';

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

// ===== CMS DATA RENDERING =====

const jakartaDateFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta'
});
const jakartaDayFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeZone: 'Asia/Jakarta'
});
const jakartaTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta'
});
const jakartaKeyFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta'
});

function fetchJson(path) {
    return fetch(`${apiBase}${path}`, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
    });
}

function setHidden(element, hidden) {
    if (!element) return;
    if (hidden) {
        element.setAttribute('hidden', '');
    } else {
        element.removeAttribute('hidden');
    }
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (typeof text === 'string' && text.length > 0) {
        element.textContent = text;
    }
    return element;
}

function formatEventDateRange(startsAt, endsAt) {
    if (!startsAt) return '';
    const startDate = new Date(startsAt);
    if (!endsAt) {
        return jakartaDateFormatter.format(startDate);
    }
    const endDate = new Date(endsAt);
    const startKey = jakartaKeyFormatter.format(startDate);
    const endKey = jakartaKeyFormatter.format(endDate);

    if (startKey === endKey) {
        const dateLabel = jakartaDayFormatter.format(startDate);
        const startTime = jakartaTimeFormatter.format(startDate);
        const endTime = jakartaTimeFormatter.format(endDate);
        return `${dateLabel} • ${startTime} - ${endTime} WIB`;
    }

    return `${jakartaDateFormatter.format(startDate)} - ${jakartaDateFormatter.format(endDate)}`;
}

function buildEventCard(event) {
    const card = createElement('article', 'dynamic-card dynamic-card--event');

    if (event.hero_image_url) {
        const media = createElement('div', 'dynamic-card__media');
        const img = document.createElement('img');
        img.src = event.hero_image_url;
        img.alt = event.title || 'Acara KCI';
        img.loading = 'lazy';
        media.appendChild(img);
        card.appendChild(media);
    }

    const body = createElement('div', 'dynamic-card__body');
    const meta = createElement('div', 'dynamic-card__meta');
    const dateLabel = formatEventDateRange(event.starts_at, event.ends_at);
    if (dateLabel) {
        meta.appendChild(createElement('span', 'dynamic-card__date', dateLabel));
    }
    if (event.location) {
        meta.appendChild(createElement('span', 'dynamic-card__location', event.location));
    }
    if (meta.childElementCount > 0) {
        body.appendChild(meta);
    }

    body.appendChild(createElement('h3', 'dynamic-card__title', event.title || 'Acara Komunitas'));
    if (event.summary || event.description) {
        body.appendChild(createElement('p', 'dynamic-card__text', event.summary || event.description));
    }

    const cta = createElement('a', 'dynamic-card__link', 'Detail acara');
    cta.href = `#/acara/${event.slug || ''}`;
    body.appendChild(cta);

    card.appendChild(body);
    return card;
}

function buildTestimonialCard(item) {
    const card = createElement('article', 'dynamic-card dynamic-card--testimonial');

    if (item.asset_url) {
        const avatar = createElement('div', 'dynamic-card__avatar');
        const img = document.createElement('img');
        img.src = item.asset_url;
        img.alt = item.title || 'Anggota KCI';
        img.loading = 'lazy';
        avatar.appendChild(img);
        card.appendChild(avatar);
    }

    const body = createElement('div', 'dynamic-card__body');
    const quoteText = item.description || 'Terima kasih telah menjadi bagian dari Komunitas Chinese Indonesia.';
    body.appendChild(createElement('p', 'dynamic-card__quote', `“${quoteText}”`));

    const author = createElement('div', 'dynamic-card__author');
    author.appendChild(createElement('span', 'dynamic-card__name', item.title || 'Anggota Komunitas'));
    const testimonialMeta = item.metadata || {};
    if (testimonialMeta.role || testimonialMeta.subtitle) {
        author.appendChild(createElement('span', 'dynamic-card__meta', testimonialMeta.role || testimonialMeta.subtitle));
    }
    body.appendChild(author);

    card.appendChild(body);
    return card;
}

function buildPartnerCard(partner) {
    const card = createElement('article', 'dynamic-card dynamic-card--partner');

    if (partner.asset_url) {
        const logo = createElement('div', 'dynamic-card__media');
        const img = document.createElement('img');
        img.src = partner.asset_url;
        const partnerMeta = partner.metadata || {};
        img.alt = partnerMeta.alt || partner.title || 'Partner KCI';
        img.loading = 'lazy';
        logo.appendChild(img);
        card.appendChild(logo);
    }

    const body = createElement('div', 'dynamic-card__body');
    body.appendChild(createElement('h3', 'dynamic-card__title', partner.title || 'Partner KCI'));
    if (partner.description) {
        body.appendChild(createElement('p', 'dynamic-card__text', partner.description));
    }
    card.appendChild(body);

    return card;
}

function loadEvents() {
    const list = document.querySelector('[data-events-list]');
    if (!list) return;
    const empty = document.querySelector('[data-events-empty]');
    const errorBox = document.querySelector('[data-events-error]');

    fetchJson('/events')
        .then(data => {
            setHidden(errorBox, true);
            list.innerHTML = '';
            const events = data && Array.isArray(data.events) ? data.events : [];
            if (events.length === 0) {
                setHidden(list, true);
                setHidden(empty, false);
                return;
            }

            events.forEach(eventItem => {
                list.appendChild(buildEventCard(eventItem));
            });
            setHidden(list, false);
            setHidden(empty, true);
        })
        .catch(() => {
            setHidden(list, true);
            setHidden(empty, true);
            if (errorBox) {
                errorBox.textContent = 'Gagal memuat data acara.';
                setHidden(errorBox, false);
            }
        });
}

function loadTestimonials() {
    const list = document.querySelector('[data-testimonials-list]');
    if (!list) return;
    const empty = document.querySelector('[data-testimonials-empty]');
    const errorBox = document.querySelector('[data-testimonials-error]');

    fetchJson('/media/testimonial')
        .then(data => {
            setHidden(errorBox, true);
            list.innerHTML = '';
            const items = data && Array.isArray(data.items) ? data.items : [];
            if (items.length === 0) {
                setHidden(list, true);
                setHidden(empty, false);
                return;
            }

            items.forEach(item => {
                list.appendChild(buildTestimonialCard(item));
            });
            setHidden(list, false);
            setHidden(empty, true);
        })
        .catch(() => {
            setHidden(list, true);
            setHidden(empty, true);
            if (errorBox) {
                errorBox.textContent = 'Gagal memuat testimoni.';
                setHidden(errorBox, false);
            }
        });
}

function loadPartners() {
    const list = document.querySelector('[data-partners-list]');
    if (!list) return;
    const empty = document.querySelector('[data-partners-empty]');
    const errorBox = document.querySelector('[data-partners-error]');

    fetchJson('/media/partner')
        .then(data => {
            setHidden(errorBox, true);
            list.innerHTML = '';
            const items = data && Array.isArray(data.items) ? data.items : [];
            if (items.length === 0) {
                setHidden(list, true);
                setHidden(empty, false);
                return;
            }

            items.forEach(partner => {
                list.appendChild(buildPartnerCard(partner));
            });
            setHidden(list, false);
            setHidden(empty, true);
        })
        .catch(() => {
            setHidden(list, true);
            setHidden(empty, true);
            if (errorBox) {
                errorBox.textContent = 'Gagal memuat mitra.';
                setHidden(errorBox, false);
            }
        });
}

function getSocialIconMarkup(url) {
    const lower = url.toLowerCase();
    if (lower.includes('instagram')) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" stroke-width="2"></path><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"></circle></svg>';
    }
    if (lower.includes('tiktok')) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.5 0h3.1c.21 1.79 1.39 3.4 3 4.35 1.02.6 2.17.93 3.4.93V8c-1.9 0-3.72-.55-5.23-1.6v8.33A7.73 7.73 0 1 1 9.38 8.3V11.5a4.48 4.48 0 1 0 3.12 4.2V0z"></path></svg>';
    }
    if (lower.includes('youtube')) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21.6 6.2a2.7 2.7 0 0 0-1.9-1.9C17.8 4 12 4 12 4s-5.8 0-7.7.3A2.7 2.7 0 0 0 2.4 6.2 28.9 28.9 0 0 0 2 12a28.9 28.9 0 0 0 .4 5.8 2.7 2.7 0 0 0 1.9 1.9C6.2 19.9 12 19.9 12 19.9s5.8 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9 28.9 28.9 0 0 0 .4-5.8 28.9 28.9 0 0 0-.4-5.7zM10 15.5v-7l6 3.5-6 3.5z"></path></svg>';
    }
    if (lower.includes('facebook')) {
        return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2V11h2zm0-6h-2V8h2z"></path></svg>';
}

function loadSocialLinks() {
    const container = document.querySelector('[data-social-links]');
    if (!container) return;
    const errorBox = document.querySelector('[data-social-error]');

    fetchJson('/links')
        .then(data => {
            const links = data && Array.isArray(data.links) ? data.links : [];
            const socials = links.filter(link => link.category === 'social' && link.is_active);
            if (socials.length === 0) {
                return;
            }

            container.innerHTML = '';
            socials.forEach(link => {
                const anchor = document.createElement('a');
                anchor.className = 'social-link';
                anchor.href = link.url;
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
                anchor.setAttribute('aria-label', link.label);
                anchor.innerHTML = `${getSocialIconMarkup(link.url)}<span class="sr-only">${link.label}</span>`;
                container.appendChild(anchor);
            });
            setHidden(errorBox, true);
        })
        .catch(() => {
            if (errorBox) {
                errorBox.textContent = 'Tidak dapat memuat tautan sosial.';
                setHidden(errorBox, false);
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    loadTestimonials();
    loadPartners();
    loadSocialLinks();
});

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