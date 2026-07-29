document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const navigation = document.getElementById('primary-navigation');
    const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const setMenuState = (open, { returnFocus = false } = {}) => {
        if (!header || !navToggle) return;

        header.classList.toggle('menu-open', open);
        document.body.classList.toggle('nav-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');

        if (returnFocus) navToggle.focus();
    };

    if (header && navToggle && navigation) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            setMenuState(!isOpen);
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
                setMenuState(false, { returnFocus: true });
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 780) setMenuState(false);
        });
    }

    const updateHeader = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const revealElements = document.querySelectorAll('.reveal');

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -48px 0px'
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    if ('IntersectionObserver' in window && navLinks.length) {
        const sections = navLinks
            .map((link) => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        const sectionObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visible) return;

            navLinks.forEach((link) => {
                const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
                if (isCurrent) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }, {
            rootMargin: '-25% 0px -62% 0px',
            threshold: [0, 0.1, 0.5]
        });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());
});
