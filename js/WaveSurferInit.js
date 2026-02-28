// js/WaveSurferInit.js  (ou remplace le contenu)

import playlist from './playlists.js';   // ← ton fichier playlist.js que je t’ai donné

let wavesurfer = null;
let currentTrackIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    wavesurfer = WaveSurfer.create({
        container: '#audiowave',
        waveColor: '#999',           // adapte à ton style
        progressColor: '#ff5500',
        cursorColor: '#ffaa00',
        height: 80,
        responsive: true,
        normalize: true,
        backend: 'MediaElement'      // ou WebAudio selon tes besoins
    });

    // Génère la liste des morceaux dans #playlist
function renderPlaylist() {
    const playlistEl = document.getElementById('playlist');
    
    playlistEl.innerHTML = playlist.map((track, index) => `
        <div class="playlist-item ${index === currentTrackIndex ? 'active' : ''}" 
             data-index="${index}">
            <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
            <span class="track-title">${track.title}</span>
        </div>
    `).join('');

    // Ajoute le clic pour jouer la piste
    playlistEl.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            loadTrack(idx);
        });
    });
}

// Appelle cette fonction une fois au démarrage
renderPlaylist();

// Et aussi à chaque changement de piste (dans loadTrack)
function loadTrack(index) {
    // ... ton code existant ...
    document.querySelector('.tarck-thumb img').src = track.cover || 'music/Jane_Duke/The-Origin-Of-Evil-MP3-Edition/Album-Cover.png';
    // Met à jour la classe "active" dans la playlist
    document.querySelectorAll('.playlist-item').forEach(el => {
        el.classList.remove('active');
        if (parseInt(el.dataset.index) === index) {
            el.classList.add('active');
            // Bonus : scroll vers l'élément actif
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

    // Mise à jour du temps en live
    wavesurfer.on('audioprocess', () => {
        const current = wavesurfer.getCurrentTime();
        document.getElementById('currentTime').textContent = formatTime(current);
    });

    wavesurfer.on('ready', () => {
        const duration = wavesurfer.getDuration();
        document.getElementById('clipTime').textContent = formatTime(duration);
    });

    // Passer à la piste suivante quand fini
    wavesurfer.on('finish', () => {
        nextTrack();
    });

    loadTrack(currentTrackIndex);
});

// Fonction pour charger une piste
function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;

    currentTrackIndex = index;
    const track = playlist[index];

    wavesurfer.load(track.url);

    // Mise à jour affichage
    document.getElementById('current-album').textContent = "The Origin Of Evil";
    document.getElementById('current-track').textContent = track.title;
    document.getElementById('current-track-title').textContent = track.title;

    // Optionnel : scroll vers le haut ou highlight dans une liste si tu en ajoutes une
}

// Contrôles next / prev (remplace les onclick du HTML ou garde-les)
window.prevTrack = function() {
    let newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1; // boucle
    loadTrack(newIndex);
};

window.nextTrack = function() {
    let newIndex = currentTrackIndex + 1;
    if (newIndex >= playlist.length) newIndex = 0; // boucle
    loadTrack(newIndex);
};

// Helper pour afficher le temps mm:ss
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Si tu veux exposer play/pause globalement (déjà utilisé dans ton HTML)
window.wavesurfer = wavesurfer;   // ← permet d’accéder à wavesurfer.playPause() depuis onclick