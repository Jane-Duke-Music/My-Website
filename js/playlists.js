// === Playlist dynamique depuis HTML (pas besoin de hardcoder) ===
document.addEventListener('DOMContentLoaded', function () {
    // Récupère tous les <div> dans #playlist
    const playlistItems = document.querySelectorAll('#playlist > div');
    const playlist = [];

    // Construit l'array playlist
    playlistItems.forEach(item => {
        playlist.push({
            src: item.getAttribute('data-src'),
            title: item.getAttribute('data-title') || 'Sans titre',
            album: item.getAttribute('data-album') || 'Jane Duke'
        });
    });

    // Si pas de tracks → on arrête
    if (playlist.length === 0) {
        console.warn("Aucun track trouvé dans #playlist");
        return;
    }

    // === Charge le premier track ===
    wavesurfer.load(playlist[0].src);

    // Affiche le titre et l'album du premier track
    const currentTitleEl = document.getElementById('current-track-title');
    const currentAlbumEl = document.getElementById('current-album');

    if (currentTitleEl) currentTitleEl.textContent = playlist[0].title;
    if (currentAlbumEl) currentAlbumEl.textContent = playlist[0].album;

    // === Gestion de la fin d'un track → passe au suivant ===
    wavesurfer.on('finish', function () {
        // Récupère la source actuelle du média (attention : peut être un blob URL)
        const currentMediaSrc = wavesurfer.backend.media.currentSrc || wavesurfer.backend.media.src;

        // Trouve l'index du track courant en comparant les src originaux
        const currentIndex = playlist.findIndex(track => currentMediaSrc.includes(track.src));

        // S'il y a un track suivant
        if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
            const nextTrack = playlist[currentIndex + 1];

            // Charge le suivant
            wavesurfer.load(nextTrack.src);

            // Met à jour l'affichage
            if (currentTitleEl) currentTitleEl.textContent = nextTrack.title;
            if (currentAlbumEl) currentAlbumEl.textContent = nextTrack.album;

            console.log(`Passage au track suivant : ${nextTrack.title}`);
        } else {
            console.log("Fin de la playlist");
            // Optionnel : boucle ou stop
            // wavesurfer.load(playlist[0].src); // pour boucle
        }
    });

    // Optionnel : mise à jour du titre quand on change manuellement de track
    wavesurfer.on('play', function () {
        const currentMediaSrc = wavesurfer.backend.media.currentSrc || wavesurfer.backend.media.src;
        const currentTrack = playlist.find(track => currentMediaSrc.includes(track.src));

        if (currentTrack) {
            if (currentTitleEl) currentTitleEl.textContent = currentTrack.title;
            if (currentAlbumEl) currentAlbumEl.textContent = currentTrack.album;
        }
    });
});