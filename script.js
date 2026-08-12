// ========================================
// MOBILE MENU FUNCTIONALITY
// ========================================

const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const body = document.body;
const externalLinks = document.querySelectorAll('a[href^="http"]');
const allImages = document.querySelectorAll('img');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

externalLinks.forEach(link => {
    if (link.hostname && link.hostname !== window.location.hostname) {
        link.target = '_blank';
     
    }
});

allImages.forEach(img => {
    const isPrimaryHeroImage = img.classList.contains('hero-banner-image');

    img.decoding = 'async';
    img.loading = isPrimaryHeroImage ? 'eager' : 'lazy';

    if (isPrimaryHeroImage) {
        img.fetchPriority = 'high';
    }
});

// Toggle mobile menu
function toggleMobileMenu() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

    hamburger.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('active');
    body.classList.toggle('menu-open');
}

// Close mobile menu
function closeMobileMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    body.classList.remove('menu-open');
}

// Event listeners
hamburger.addEventListener('click', toggleMobileMenu);

// Close menu when clicking on a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isClickInsideNav = mobileNav.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);

    if (!isClickInsideNav && !isClickOnHamburger && mobileNav.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ========================================
// SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
// ========================================

if (!prefersReducedMotion) {
    // Elements to animate on scroll
    const animateOnScroll = [
        '.why-different',
        '.explore-artwork',
        '.nft-card',
        '.partners',
    ];

    // Create observer options
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    // Callback function for observer
    const observerCallback = (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('fade-in', 'visible');
                }, index * 100);
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all target elements
    animateOnScroll.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    });

    // Special handling for NFT cards with stagger
    const nftCards = document.querySelectorAll('.nft-card');
    nftCards.forEach((card, index) => {
        // Cap stagger so lower cards don't become progressively slower.
        const staggerDelay = Math.min(index * 0.03, 0.24);
        card.style.transitionDelay = `${staggerDelay}s`;
    });
}

// ========================================
// COUNTDOWN TIMERS FOR NFT CARDS
// ========================================

function updateCountdown(timerElement) {
    const endTime = new Date(timerElement.getAttribute('data-end-time')).getTime();

    function update() {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            timerElement.textContent = '00 : 00 : 00';
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const formattedTime = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
        timerElement.textContent = formattedTime;
    }

    // Initial update
    update();

    // Update every second
    setInterval(update, 1000);
}

// Initialize all countdown timers
const timerElements = document.querySelectorAll('.timer-value');
timerElements.forEach(timer => {
    updateCountdown(timer);
});

// ========================================
// FILTER BUTTONS FUNCTIONALITY
// ========================================



// ========================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ========================================

const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// ENHANCED BUTTON INTERACTIONS
// ========================================

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function () {
        if (!prefersReducedMotion) {
            this.style.transform = 'scale(1.05)';
        }
    });

    button.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });

    button.addEventListener('mousedown', function () {
        if (!prefersReducedMotion) {
            this.style.transform = 'scale(0.98)';
        }
    });

    button.addEventListener('mouseup', function () {
        if (!prefersReducedMotion) {
            this.style.transform = 'scale(1.05)';
        }
    });
});

// ========================================
// NFT CARD HOVER GLOW EFFECT
// ========================================

const nftCards = document.querySelectorAll('.nft-card');

nftCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        if (!prefersReducedMotion) {
            this.style.transform = 'translateY(-10px)';
        }
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Lazy load images (if real images were used)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Focus trap for mobile menu when open
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    });
}

// Apply focus trap to mobile nav when it's active
const menuObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
            trapFocus(mobileNav);
        }
    });
});

menuObserver.observe(mobileNav, {
    attributes: true,
    attributeFilter: ['class']
});


const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");
city.addEventListener("click", toggleCont);
function toggleCont() {
    city.classList.toggle("active");
    Array.from(cont).forEach((el) => {
        el.style.display = el.style.display === "block" ? "none" : "block";
    });
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}


(function () {
    const filterSection = document.querySelector('.explore-artwork');
    if (!filterSection) return;

    const tabs = Array.from(filterSection.querySelectorAll('.filter-btn'));
    const cards = Array.from(filterSection.querySelectorAll('.nft-grid .nft-card'));
    if (!tabs.length || !cards.length) return;

    function setActive(tab) {
        tabs.forEach(t => t.classList.toggle('active', t === tab));
    }

    function applyFilter(filter) {
        const normalizedFilter = (filter || '').toLowerCase().trim();
        if (normalizedFilter === 'all') {
            cards.forEach(c => c.classList.remove('hidden'));
            return;
        }
        cards.forEach(c => {
            const cat = (c.dataset.category || '').toLowerCase();
            c.classList.toggle('hidden', cat !== normalizedFilter);
        });
    }

    tabs.forEach(tab => {
        let f = tab.dataset.filter;
        if (!f) {
            f = tab.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        }
        f = f.toLowerCase().trim();
        tab.dataset.filter = f;
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            setActive(tab);
            applyFilter(f);
        });
    });

    // initialize: apply active tab filter on load
    const active = tabs.find(t => t.classList.contains('active')) || tabs[0];
    if (active) applyFilter((active.dataset.filter || 'all').toLowerCase().trim());
})();


// Age verification modal
const ageModal = document.getElementById("ageModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

window.addEventListener("load", () => {
    if (localStorage.getItem("ageConfirmed") != "true") {
        ageModal.style.display = "flex";
    } else {
        ageModal.style.display = "none";
    }
});

yesBtn.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    ageModal.style.display = "none";
});

noBtn.addEventListener("click", () => {
    alert("Dostęp zabroniony. Strona tylko dla osób 18+");
    window.close();
    window.location.href = "https://www.google.pl";
});

// Hide the top warning when the page is scrolled
const warn = document.querySelector(".warn");
if (warn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            warn.style.display = "none";
        } else {
            warn.style.display = "";
        }
    });
}
// ========================================
// CONSOLE LOG FOR DEBUGGING
// ========================================

console.log('NFT Landing Page - JavaScript Loaded Successfully ✅');
console.log('Reduced Motion:', prefersReducedMotion ? 'Enabled' : 'Disabled');
console.log('Countdown timers initialized:', timerElements.length);
console.log('Scroll animation elements:', document.querySelectorAll('.fade-in').length);

