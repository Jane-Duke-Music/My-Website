// WaveSurfer Initialization – Version avec playlist fonctionnelle

document.addEventListener('DOMContentLoaded', function () {
    // Création unique de WaveSurfer (un seul player partagé)
    const wavesurfer = WaveSurfer.create({
        container: '#audiowave',
        waveColor: '#6b0a0a',       // rouge sombre (comme ta pochette)
        progressColor: '#d40707',   // rouge vif pour le progrès
        cursorColor: '#d4af37',     // doré pour le curseur (thème noir/rouge/doré)
        cursorWidth: 2,
        barWidth: 3,
        barGap: 1,
        height: 110,
        barHeight: 0.5,
        backgroundColor: '#111111',
        normalize: true,            // waveform plus remplie et impactante
        cursor: true
    });

    // Fonction format temps (améliorée et réutilisable)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Mise à jour du temps courant
    wavesurfer.on('audioprocess', () => {
        const current = wavesurfer.getCurrentTime();
        document.getElementById('currentTime').textContent = formatTime(current);
    });

    // Quand la piste est prête (durée connue)
    wavesurfer.on('ready', () => {
        const duration = wavesurfer.getDuration();
        document.getElementById('clipTime').textContent = formatTime(duration);
        // Option : play auto au chargement d'une nouvelle piste → décommente si voulu
        // wavesurfer.play();
    });

    // Visuel play/pause (tu avais déjà ça)
    wavesurfer.on('play', () => {
        document.querySelector('.player-box')?.classList.add('playing');
    });

    wavesurfer.on('pause', () => {
        document.querySelector('.player-box')?.classList.remove('playing');
    });

    // Gestion des clics sur les tracks (la partie manquante !)
    const trackElements = document.querySelectorAll('[data-track-url]'); // ou '#playlist li', '.track-item', etc.

    trackElements.forEach(trackEl => {
        trackEl.addEventListener('click', function () {
            const url = this.dataset.trackUrl; // data-track-url="https://...mp3"
            if (!url) return;

            // Highlight le track sélectionné
            trackElements.forEach(el => el.classList.remove('active'));
            this.classList.add('active');

            // Charge la nouvelle piste
            wavesurfer.load(url);

            // Option : play automatiquement après chargement
            wavesurfer.once('ready', () => {
                wavesurfer.play();
            });
        });
    });

    // Load initial : première piste (comme avant)
    const initialTrack = document.querySelector('[data-track-url]');
    if (initialTrack) {
        initialTrack.classList.add('active');
        const initialUrl = initialTrack.dataset.trackUrl;
        wavesurfer.load(initialUrl);
    }

    // Bonus : passer automatiquement à la piste suivante à la fin
    wavesurfer.on('finish', () => {
        const active = document.querySelector('[data-track-url].active');
        if (!active) return;
        const next = active.nextElementSibling;
        if (next && next.dataset.trackUrl) {
            next.click(); // simule le clic → load + play
        }
    });
});