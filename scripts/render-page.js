(function () {
    'use strict';

    var root = document.getElementById('shared-page-root');
    if (!root) return;

    var pageName = (document.body && document.body.getAttribute('data-page')) === 'guests' ? 'guests' : 'main';

    function loadAppScript() {
        if (document.querySelector('script[data-shared-app="true"]')) return;
        var script = document.createElement('script');
        script.src = '/app.js';
        script.setAttribute('data-shared-app', 'true');
        document.body.appendChild(script);
    }

    function showError() {
        root.innerHTML = '<section class="section"><p class="intro-text">Impossible de charger la page pour le moment.</p></section>';
    }

    Promise.all([
        fetch('/partials/shared-content.fragment'),
        fetch('/partials/program-' + pageName + '.fragment')
    ])
        .then(function (responses) {
            if (!responses[0].ok || !responses[1].ok) {
                throw new Error('Failed to load shared HTML fragments');
            }
            return Promise.all([responses[0].text(), responses[1].text()]);
        })
        .then(function (parts) {
            var shared = parts[0];
            var program = parts[1];
            root.innerHTML = shared.replace('{{PROGRAM_SECTION}}', program);
            loadAppScript();
        })
        .catch(function (error) {
            console.error('[shared-html] Failed to render page:', error);
            showError();
        });
})();
