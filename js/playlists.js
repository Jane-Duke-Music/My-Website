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
    wavesurfer.on('finish', function () {
        const currentSrc = wavesurfer.backend.media.src;
        const currentIndex = playlist.findIndex(t => t.src === currentSrc);

        if (currentIndex < playlist.length - 1) {
            const nextTrack = playlist[currentIndex + 1];
            wavesurfer.load(nextTrack.src);
            if (currentTitleEl) currentTitleEl.textContent = nextTrack.title;
            if (currentAlbumEl) currentAlbumEl.textContent = nextTrack.album;
        }
    });

    // Optionnel : mettre à jour le titre quand on change de track manuellement
    wavesurfer.on('play', function () {
        const currentSrc = wavesurfer.backend.media.src;
        const currentTrack = playlist.find(t => t.src === currentSrc);
        if (currentTrack) {
            if (currentTitleEl) currentTitleEl.textContent = currentTrack.title;
            if (currentAlbumEl) currentAlbumEl.textContent = currentTrack.album;
        }
    });
});