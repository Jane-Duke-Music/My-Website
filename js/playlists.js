// === Playlist dynamique depuis HTML (pas besoin de hardcoder) ===
document.addEventListener('DOMContentLoaded', function () {
    const playlistItems = document.querySelectorAll('#playlist > div');
    const playlist = [];

    playlistItems.forEach(item => {
        playlist.push({
            src: item.getAttribute('data-src'),
            title: item.getAttribute('data-title'),
            album: item.getAttribute('data-album') || 'Jane Duke'
        });
    });

    if (playlist.length === 0) return; // pas de tracks → on sort

    // Charge le premier track
    wavesurfer.load(playlist[0].src);

    // Affiche le titre et l'album du track courant
    const currentTitleEl = document.getElementById('current-track-title');
    const currentAlbumEl = document.getElementById('current-album');

    if (currentTitleEl) currentTitleEl.textContent = playlist[0].title;
    if (currentAlbumEl) currentAlbumEl.textContent = playlist[0].album;

    // Quand un track finit → passe au suivant
    // === Auto next track quand un morceau finit ===
wavesurfer.on('finish', function() {
    // Trouve l'index du track courant
    const currentSrc = wavesurfer.backend.media.src;
    const currentIndex = playlist.findIndex(track => track.src === currentSrc);

    // S'il y a un track suivant, charge-le
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
        const nextTrack = playlist[currentIndex + 1];
        wavesurfer.load(nextTrack.src);

        // Optionnel : mettre à jour le titre et l'album affichés
        document.getElementById('current-track-title').textContent = nextTrack.title || 'No Title';
        document.getElementById('current-album').textContent = nextTrack.album || 'Jane Duke';
    }
});
});