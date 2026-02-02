// ===== MODERN VANILLA JAVASCRIPT =====
'use strict';

// ===== DOM ELEMENTS =====
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const contactForm = document.querySelector('.contact-form');
const statNumbers = document.querySelectorAll('[data-target]');

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
};

// ===== MOBILE MENU =====
class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        if (menuToggle && navbar) {
            menuToggle.addEventListener('click', () => this.toggle());
            
            // Close menu when clicking on nav links
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
                    this.close();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        navbar.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        navbar.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// ===== HEADER SCROLL EFFECT =====
class HeaderScrollEffect {
    constructor() {
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        const throttledScroll = throttle(() => this.handleScroll(), 16);
        window.addEventListener('scroll', throttledScroll);
        this.handleScroll();
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }
}

// ===== PARALLAX EFFECT =====
class ParallaxEffect {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.init();
    }

    init() {
        if (this.heroSection) {
            const throttledScroll = throttle(() => this.handleParallax(), 16);
            window.addEventListener('scroll', throttledScroll);
        }
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = this.heroSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Only apply parallax if hero section is visible
        if (scrolled < heroHeight + windowHeight) {
            const rate = scrolled * -0.5;
            this.heroSection.style.transform = `translateY(${rate}px)`;
        }
    }
}

// ===== ACTIVE NAVIGATION =====
class ActiveNavigation {
    constructor() {
        this.init();
    }

    init() {
        const handleScroll = throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 10);

        window.addEventListener('scroll', handleScroll);
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Handle other smooth scroll links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
    constructor() {
        this.animated = new Set();
        this.init();
    }

    init() {
        const handleScroll = throttle(() => {
            statNumbers.forEach(stat => {
                if (this.animated.has(stat)) return;
                
                if (this.isInViewport(stat)) {
                    this.animateCounter(stat);
                    this.animated.add(stat);
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll);
        // Check initially
        handleScroll();
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

// ===== SCROLL TO TOP BUTTON =====
class ScrollToTop {
    constructor() {
        this.button = this.createButton();
        this.init();
    }

    createButton() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.setAttribute('aria-label', 'Voltar ao topo');
        document.body.appendChild(button);
        return button;
    }

    init() {
        const handleScroll = throttle(() => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== FORM VALIDATION =====
class FormValidation {
    constructor() {
        this.form = contactForm;
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const isValid = this.validateForm();
        
        if (isValid) {
            this.submitForm();
        } else {
            this.showFormError('Por favor, corrija os erros antes de enviar.');
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll('[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup?.querySelector('.form-error');

        // Clear previous error
        this.clearFieldError(fieldGroup, errorElement);

        // Required validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(fieldGroup, errorElement, 'Este campo é obrigatório.');
            return false;
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(fieldGroup, errorElement, 'Por favor, insira um e-mail válido.');
                return false;
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(fieldGroup, errorElement, 'Por favor, insira um telefone válido.');
                return false;
            }
        }

        return true;
    }

    showFieldError(fieldGroup, errorElement, message) {
        if (fieldGroup) fieldGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearFieldError(fieldGroup, errorElement) {
        if (fieldGroup) fieldGroup.classList.remove('error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    clearError(field) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup?.querySelector('.form-error');
        this.clearFieldError(fieldGroup, errorElement);
    }

    showFormError(message) {
        // Create or show form-level error message
        let errorDiv = this.form.querySelector('.form-error-general');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-general';
            errorDiv.style.cssText = 'color: var(--primary); text-align: center; margin-bottom: 1rem; font-size: 1.4rem;';
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        errorDiv.textContent = message;
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showSuccessMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.form.reset();
            
        } catch (error) {
            this.showFormError('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = 'background: rgba(76, 175, 80, 0.1); color: #4CAF50; padding: 1rem; border-radius: 0.5rem; margin-bottom: 2rem; text-align: center; border: 1px solid #4CAF50;';
        successDiv.textContent = message;
        
        this.form.insertBefore(successDiv, this.form.firstChild);
        
        setTimeout(() => successDiv.remove(), 5000);
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        const animateElements = document.querySelectorAll('.service-card, .team-card, .pricing-card, .stat-card');
        animateElements.forEach(el => observer.observe(el));
    }
}

// ===== PRELOADER =====
class Preloader {
    constructor() {
        this.init();
    }

    init() {
        // Create preloader
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(preloader);

        // Hide preloader when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => preloader.remove(), 300);
            }, 500);
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class Performance {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Prefetch important links
        this.prefetchLinks();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src || img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    prefetchLinks() {
        const importantLinks = document.querySelectorAll('a[href^="#"]');
        importantLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        // Trigger any lazy content loading
                        targetSection.classList.add('prefetched');
                    }
                }
            }, { once: true });
        });
    }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Preloader();
    new MobileMenu();
    new HeaderScrollEffect();
    new ActiveNavigation();
    new SmoothScroll();
    new CounterAnimation();
    new ScrollToTop();
    new FormValidation();
    new ScrollAnimations();
    new Performance();

    // Add loaded class to body
    document.body.classList.add('loaded');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.warn('JavaScript error caught:', e.error);
});

// ===== SERVICE WORKER REGISTRATION (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('SW registered'))
            .catch(() => console.log('SW registration failed'));
    });
}