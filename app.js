// === Scroll animations ===
(function () {
    'use strict';
    var animatedElements = document.querySelectorAll('.fade-up');
    if (!animatedElements.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animatedElements.forEach(function (el) { el.classList.add('visible'); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animatedElements.forEach(function (el) { observer.observe(el); });
})();

// === Mobile burger menu ===
(function () {
    'use strict';
    var nav = document.querySelector('.nav');
    var burger = document.getElementById('nav-burger');
    var menu = document.getElementById('nav-links-menu');
    if (!nav || !burger || !menu) return;

    function closeMenu() {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
        if (window.innerWidth > 700) return;
        if (!nav.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 700) closeMenu();
    });
})();

// === Global background transition ===
(function () {
    'use strict';

    var backdrop = document.querySelector('.site-background');
    if (!backdrop) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        backdrop.style.setProperty('--bg-mountains-opacity', '0');
        backdrop.style.setProperty('--bg-sea-opacity', '0');
        backdrop.style.setProperty('--bg-beach-opacity', '1');
        return;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function smoothstep(edge0, edge1, x) {
        var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }

    function mix(from, to, progress) {
        return from + (to - from) * progress;
    }

    var ticking = false;

    function updateBackground() {
        var scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        var progress = clamp(window.scrollY / scrollable, 0, 1);

        // 1/4 montagne, 1/2 mer, 1/4 plage with smooth transitions at the boundaries.
        var blend = 0.12;
        var mountainOpacity = 1 - smoothstep(0.25 - blend, 0.25 + blend, progress);
        var seaIn = smoothstep(0.25 - blend, 0.25 + blend, progress);
        var seaOut = 1 - smoothstep(0.75 - blend, 0.75 + blend, progress);
        var seaOpacity = clamp(Math.min(seaIn, seaOut), 0, 1);
        var beachOpacity = smoothstep(0.75 - blend, 0.75 + blend, progress);

        backdrop.style.setProperty('--bg-mountains-opacity', mountainOpacity.toFixed(4));
        backdrop.style.setProperty('--bg-sea-opacity', seaOpacity.toFixed(4));
        backdrop.style.setProperty('--bg-beach-opacity', beachOpacity.toFixed(4));

        ticking = false;
    }

    function onScrollOrResize() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateBackground);
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    updateBackground();
})();

// === Translations ===
(function () {
    'use strict';
    var STORAGE_KEY = 'wedding-language';
    var RSVP_FORM_FR = 'https://forms.gle/Nprychy3yCCdcuF78';
    var RSVP_FORM_INTL = 'https://forms.gle/4tUC8mPCWoZgWtvT6';
    var isGuestsPage = document.body && document.body.getAttribute('data-page') === 'guests';
    var selector = document.getElementById('lang-switcher');
    var flagButtons = document.querySelectorAll('.nav-flag-btn[data-lang]');
    var rsvpButton = document.querySelector('.rsvp-btn');
    if (!selector) return;

    var dictionary = null;
    var translations = null;

    // Define translate function before using it
    function translate(lang) {
        if (!dictionary) return;
        var strings = dictionary[lang] || dictionary.fr;
        var metaDesc = document.querySelector('meta[name="description"]');

        document.title = strings.title;
        if (metaDesc) metaDesc.setAttribute('content', strings.description);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar-EG' ? 'rtl' : 'ltr';
        document.body.classList.toggle('lang-ar', lang === 'ar-EG');

        if (rsvpButton) {
            rsvpButton.setAttribute('href', lang === 'fr' ? RSVP_FORM_FR : RSVP_FORM_INTL);
        }

        if (isGuestsPage) {
            var vinDhonneurTime = document.querySelector('[data-i18n="program.item2.time"]');
            var endTimeByLang = {
                'fr': '19h',
                'en': '7:00 PM',
                'ar-EG': '19h'
            };

            if (vinDhonneurTime) {
                var baseTime = strings['program.item2.time'] || vinDhonneurTime.textContent;
                vinDhonneurTime.textContent = baseTime + ' - ' + (endTimeByLang[lang] || '19h');
            }
        }

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (strings[key]) el.textContent = strings[key];
        });

        // Apply guests-specific modifications AFTER translations
        if (isGuestsPage) {
            var vinDhonneurTime = document.querySelector('[data-i18n="program.item2.time"]');
            var endTimeByLang = {
                'fr': '19h',
                'en': '7:00 PM',
                'ar-EG': '19h'
            };

            if (vinDhonneurTime) {
                var baseTime = strings['program.item2.time'] || vinDhonneurTime.textContent;
                vinDhonneurTime.textContent = baseTime + ' - ' + (endTimeByLang[lang] || '19h');
            }
        }

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (strings[key]) el.innerHTML = strings[key];
        });

        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            var mapping = el.getAttribute('data-i18n-attr');
            mapping.split(',').forEach(function (pair) {
                var parts = pair.trim().split(':');
                var attr = parts[0].trim();
                var key = parts[1].trim();
                if (strings[key]) el.setAttribute(attr, strings[key]);
            });
        });

        console.log('[i18n] ✓ Translated to:', lang);
    }

    function initializeLanguage() {
        if (!dictionary) return;

        function syncFlagState(lang) {
            flagButtons.forEach(function (btn) {
                btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
            });
        }

        var stored = localStorage.getItem(STORAGE_KEY);
        var param = new URLSearchParams(location.search).get('lang');
        var browser = navigator.language.split('-')[0];
        var initial = param || stored || (browser === 'ar' ? 'ar-EG' : browser === 'en' ? 'en' : 'fr');

        if (dictionary[initial]) {
            translate(initial);
            selector.value = initial;
            syncFlagState(initial);
        }

        selector.addEventListener('change', function () {
            var lang = this.value;
            translate(lang);
            syncFlagState(lang);
            localStorage.setItem(STORAGE_KEY, lang);
            var url = new URL(location);
            url.searchParams.set('lang', lang);
            history.replaceState(null, '', url);
        });

        flagButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var lang = btn.getAttribute('data-lang');
                if (!dictionary[lang]) return;
                selector.value = lang;
                selector.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }

    // Load translations from external JSON file
    var translationsUrl = '/translations.json';

    fetch(translationsUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Failed to load translations.json');
            return response.json();
        })
        .then(function (data) {
            translations = data;
            // Convert from array structure to dictionary by language
            dictionary = {
                'en': {},
                'fr': {},
                'ar-EG': {}
            };

            Object.keys(translations).forEach(function (key) {
                var items = translations[key];
                items.forEach(function (item) {
                    dictionary[item.lang][key] = item.text;
                });
            });

            // Initialize with stored language preference
            initializeLanguage();
        })
        .catch(function (error) {
            console.error('[i18n] Failed to load translations.json:', error);
        });
})();
