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

// === Translations ===
(function () {
    'use strict';
    var STORAGE_KEY = 'wedding-language';
    var selector = document.getElementById('lang-switcher');
    if (!selector) return;

    var dictionary = {
        fr: {
            'nav.aria': 'Navigation principale',
            'nav.details': 'Détails',
            'nav.program': 'Programme',
            'nav.location': 'Lieu',
            'nav.rsvp': 'RSVP',
            'lang.aria': 'Changer la langue',
            'lang.label': 'Langue',
            'hero.eyebrow': 'Vous êtes cordialement invités au mariage de',
            'hero.date': 'Le 20 juin 2026',
            'hero.place': 'Château des Comtes de Challes · Challes-les-Eaux · Savoie',
            'hero.cta': 'Découvrir',
            'hero.scrollAria': 'Défiler vers les détails',
            'intro.aria': 'Introduction',
            'intro.eyebrow': 'Notre histoire',
            'intro.title': 'Deux univers, une seule promesse',
            'intro.text': 'Entre les sommets enneigés qui veillent sur la Savoie et l\'appel du large qui nous a toujours réunis, nous avons choisi de célébrer notre amour là où la montagne rencontre le ciel — et d\'y inviter les personnes qui nous sont les plus chères.',
            'details.eyebrow': 'Informations',
            'details.title': 'La journée en un coup d\'œil',
            'details.date.title': 'Date',
            'details.date.value': '20 juin 2026',
            'details.date.sub': 'Samedi',
            'details.time.title': 'Heure',
            'details.time.value': '15h00',
            'details.time.sub': 'Cérémonie laïque',
            'details.place.title': 'Lieu',
            'details.place.value': 'Château<br>des Comtes',
            'details.place.sub': 'Challes-les-Eaux, Savoie',
            'details.dress.title': 'Tenue',
            'details.dress.value': 'Élégante',
            'details.dress.sub': 'Cocktail chic',
            'program.eyebrow': 'Déroulement',
            'program.title': 'Le programme du jour',
            'program.item1.time': '15h00',
            'program.item1.label': 'Cérémonie laïque',
            'program.item1.desc': 'Échanges des vœux face aux sommets du Granier et du Nivollet.',
            'program.item2.time': '16h30',
            'program.item2.label': 'Vin d\'honneur',
            'program.item2.desc': 'Cocktail dans les jardins du château, avec vue panoramique.',
            'program.item3.time': '19h30',
            'program.item3.label': 'Dîner de gala',
            'program.item3.desc': 'Repas gastronomique dans la grande salle du château.',
            'program.item4.time': '22h00',
            'program.item4.label': 'Soirée dansante',
            'program.item4.desc': 'La fête continue jusqu\'au bout de la nuit.',
            'location.eyebrow': 'Le lieu',
            'location.title': 'Château des Comtes<br>de Challes',
            'location.address': '247 Montée du Château<br>73190 Challes-les-Eaux<br>Savoie, France',
            'location.desc': 'Niché sur les hauteurs de Challes-les-Eaux, ce château du XIXe siècle offre une vue imprenable sur le massif du Granier et le Nivollet. Un cadre d\'exception où l\'élégance de la pierre se marie à la majesté des Alpes.',
            'location.mapAria': 'Carte du lieu',
            'location.mapText': 'Challes-les-Eaux · Savoie',
            'location.mapLink': 'Ouvrir dans Google Maps ↗',
            'rsvp.eyebrow': 'Confirmez votre présence',
            'rsvp.title': 'Rejoignez-nous !',
            'rsvp.intro': 'Votre présence nous comblerait de joie. Merci de confirmer votre participation avant le <strong>31 mars 2026</strong> en remplissant le formulaire ci-dessous.',
            'rsvp.deadline': 'Date limite de réponse · 31 mars 2026',
            'rsvp.button': 'Confirmer ma présence',
            'rsvp.buttonAria': 'Confirmer ma présence via le formulaire en ligne',
            'footer.line': '20 juin 2026 · Challes-les-Eaux · Savoie',
            title: 'Salma & Maël · 20 juin 2026',
            description: 'Salma & Maël — Mariage le 20 juin 2026 au Château des Comtes de Challes, Challes-les-Eaux, Savoie.'
        },
        en: {
            'nav.aria': 'Main navigation',
            'nav.details': 'Details',
            'nav.program': 'Schedule',
            'nav.location': 'Location',
            'nav.rsvp': 'RSVP',
            'lang.aria': 'Change language',
            'lang.label': 'Language',
            'hero.eyebrow': 'You are warmly invited to the wedding of',
            'hero.date': 'June 20, 2026',
            'hero.place': 'Château des Comtes de Challes · Challes-les-Eaux · Savoie',
            'hero.cta': 'Discover',
            'hero.scrollAria': 'Scroll to details',
            'intro.aria': 'Introduction',
            'intro.eyebrow': 'Our story',
            'intro.title': 'Two worlds, one promise',
            'intro.text': 'Between the snowy peaks overlooking Savoie and the call of the sea that has always brought us together, we chose to celebrate our love where the mountains meet the sky — and to share this day with the people we hold most dear.',
            'details.eyebrow': 'Information',
            'details.title': 'The day at a glance',
            'details.date.title': 'Date',
            'details.date.value': 'June 20, 2026',
            'details.date.sub': 'Saturday',
            'details.time.title': 'Time',
            'details.time.value': '3:00 PM',
            'details.time.sub': 'Outdoor ceremony',
            'details.place.title': 'Venue',
            'details.place.value': 'Château<br>des Comtes',
            'details.place.sub': 'Challes-les-Eaux, Savoie',
            'details.dress.title': 'Dress code',
            'details.dress.value': 'Elegant',
            'details.dress.sub': 'Chic cocktail',
            'program.eyebrow': 'Timeline',
            'program.title': 'Wedding day schedule',
            'program.item1.time': '3:00 PM',
            'program.item1.label': 'Outdoor ceremony',
            'program.item1.desc': 'Exchange of vows with views of the Granier and Nivollet peaks.',
            'program.item2.time': '4:30 PM',
            'program.item2.label': 'Cocktail hour',
            'program.item2.desc': 'Reception in the château gardens with panoramic views.',
            'program.item3.time': '7:30 PM',
            'program.item3.label': 'Gala dinner',
            'program.item3.desc': 'Gourmet dinner in the château\'s grand hall.',
            'program.item4.time': '10:00 PM',
            'program.item4.label': 'Dancing party',
            'program.item4.desc': 'The celebration continues into the night.',
            'location.eyebrow': 'The venue',
            'location.title': 'Château des Comtes<br>de Challes',
            'location.address': '247 Montée du Château<br>73190 Challes-les-Eaux<br>Savoie, France',
            'location.desc': 'Nestled above Challes-les-Eaux, this 19th-century château offers breathtaking views of the Granier and Nivollet mountain ranges. A remarkable setting where timeless stone elegance meets the majesty of the Alps.',
            'location.mapAria': 'Venue map',
            'location.mapText': 'Challes-les-Eaux · Savoie',
            'location.mapLink': 'Open in Google Maps ↗',
            'rsvp.eyebrow': 'Confirm your attendance',
            'rsvp.title': 'Join us!',
            'rsvp.intro': 'Your presence would mean so much to us. Please confirm your attendance before <strong>March 31, 2026</strong> by filling out the form below.',
            'rsvp.deadline': 'RSVP deadline · March 31, 2026',
            'rsvp.button': 'Confirm my attendance',
            'rsvp.buttonAria': 'Confirm my attendance through the online form',
            'footer.line': 'June 20, 2026 · Challes-les-Eaux · Savoie',
            title: 'Salma & Maël · June 20, 2026',
            description: 'Salma & Maël — Wedding on June 20, 2026 at Château des Comtes de Challes, Challes-les-Eaux, Savoie.'
        },
        'ar-EG': {
            'nav.aria': 'التنقل الرئيسي',
            'nav.details': 'التفاصيل',
            'nav.program': 'البرنامج',
            'nav.location': 'المكان',
            'nav.rsvp': 'تأكيد الحضور',
            'lang.aria': 'تغيير اللغة',
            'lang.label': 'اللغة',
            'hero.eyebrow': 'يسعدنا دعوتكم لحضور زفاف',
            'hero.date': '٢٠ يونيو ٢٠٢٦',
            'hero.place': 'Château des Comtes de Challes · شال ليزو · سافوا',
            'hero.cta': 'اكتشفوا',
            'hero.scrollAria': 'الانتقال إلى التفاصيل',
            'intro.aria': 'مقدمة',
            'intro.eyebrow': 'قصتنا',
            'intro.title': 'عالمان ووعد واحد',
            'intro.text': 'بين القمم الثلجية التي تحرس سافوا ونداء البحر الذي جمعنا دائمًا، اخترنا أن نحتفل بحبنا حيث تلتقي الجبال بالسماء — وأن نشارك هذا اليوم مع أغلى الناس على قلوبنا.',
            'details.eyebrow': 'معلومات',
            'details.title': 'اليوم في لمحة',
            'details.date.title': 'التاريخ',
            'details.date.value': '٢٠ يونيو ٢٠٢٦',
            'details.date.sub': 'السبت',
            'details.time.title': 'الوقت',
            'details.time.value': '٣:٠٠ مساءً',
            'details.time.sub': 'مراسم رمزية',
            'details.place.title': 'المكان',
            'details.place.value': 'قصر<br>دي كومت',
            'details.place.sub': 'شال ليزو، سافوا',
            'details.dress.title': 'الزي',
            'details.dress.value': 'أنيق',
            'details.dress.sub': 'كوكتيل شيك',
            'program.eyebrow': 'سير اليوم',
            'program.title': 'برنامج يوم الزفاف',
            'program.item1.time': '٣:٠٠ مساءً',
            'program.item1.label': 'المراسم',
            'program.item1.desc': 'تبادل العهود مع إطلالة على قمم غرانييه ونيفوليه.',
            'program.item2.time': '٤:٣٠ مساءً',
            'program.item2.label': 'الاستقبال',
            'program.item2.desc': 'كوكتيل في حدائق القصر مع منظر بانورامي.',
            'program.item3.time': '٧:٣٠ مساءً',
            'program.item3.label': 'العشاء',
            'program.item3.desc': 'عشاء فاخر في القاعة الكبرى بالقصر.',
            'program.item4.time': '١٠:٠٠ مساءً',
            'program.item4.label': 'السهرة',
            'program.item4.desc': 'الاحتفال مستمر حتى آخر الليل.',
            'location.eyebrow': 'المكان',
            'location.title': 'Château des Comtes<br>de Challes',
            'location.address': '247 Montée du Château<br>73190 Challes-les-Eaux<br>Savoie, France',
            'location.desc': 'يقع هذا القصر من القرن التاسع عشر على مرتفعات شال ليزو، ويوفر إطلالة ساحرة على جبال غرانييه ونيفوليه. مكان استثنائي يجمع بين أناقة الحجر وعظمة جبال الألب.',
            'location.mapAria': 'خريطة المكان',
            'location.mapText': 'شال ليزو · سافوا',
            'location.mapLink': 'افتح في خرائط جوجل ↗',
            'rsvp.eyebrow': 'أكدوا حضوركم',
            'rsvp.title': 'ننتظركم!',
            'rsvp.intro': 'وجودكم يسعدنا جدًا. من فضلكم أكدوا حضوركم قبل <strong>٣١ مارس ٢٠٢٦</strong> من خلال تعبئة النموذج التالي.',
            'rsvp.deadline': 'آخر موعد للتأكيد · ٣١ مارس ٢٠٢٦',
            'rsvp.button': 'تأكيد الحضور',
            'rsvp.buttonAria': 'تأكيد الحضور عبر النموذج الإلكتروني',
            'footer.line': '٢٠ يونيو ٢٠٢٦ · شال ليزو · سافوا',
            title: 'سلمى و مائل · ٢٠ يونيو ٢٠٢٦',
            description: 'سلمى و مائل — حفل الزفاف يوم ٢٠ يونيو ٢٠٢٦'
        }
    };

    function translate(lang) {
        var strings = dictionary[lang] || dictionary.fr;
        var metaDesc = document.querySelector('meta[name="description"]');

        document.title = strings.title;
        if (metaDesc) metaDesc.setAttribute('content', strings.description);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar-EG' ? 'rtl' : 'ltr';
        document.body.classList.toggle('lang-ar', lang === 'ar-EG');

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (strings[key]) el.textContent = strings[key];
        });

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

    var stored = localStorage.getItem(STORAGE_KEY);
    var param = new URLSearchParams(location.search).get('lang');
    var browser = navigator.language.split('-')[0];
    var initial = param || stored || (browser === 'ar' ? 'ar-EG' : browser === 'en' ? 'en' : 'fr');

    if (dictionary[initial]) {
        translate(initial);
        selector.value = initial;
    }

    selector.addEventListener('change', function () {
        var lang = this.value;
        translate(lang);
        localStorage.setItem(STORAGE_KEY, lang);
        var url = new URL(location);
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url);
    });
})();
