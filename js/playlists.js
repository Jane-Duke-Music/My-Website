// playlists.js

document.addEventListener('DOMContentLoaded', () => {
    if (typeof wavesurfer === 'undefined') {
        console.error('WaveSurfer non initialisé – Vérifie l’ordre des scripts');
        return;
    }

    const playlistEl = document.getElementById('playlist');
    if (!playlistEl) {
        console.error('#playlist introuvable');
        return;
    }

    async function loadPlaylist(m3uPath = 'music/Jane_Duke/The-Origin-Of-Evil-MP3-Edition/playlist-origin.txt') {   // ← change ici selon ton nom final
        console.log(`[Playlist] Début chargement depuis : ${m3uPath}`);

        try {
            const res = await fetch(m3uPath);
            console.log(`[Playlist] Statut HTTP : ${res.status}`);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const text = await res.text();
            console.log('[Playlist] Premières lignes du fichier :', text.slice(0, 200));

            if (text.includes('<html') || text.includes('<!DOCTYPE')) {
                throw new Error('Réponse est du HTML au lieu du .m3u8 – chemin incorrect ou fichier absent');
            }

            const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
            const tracks = [];
            let currentTitle = null;

            for (const line of lines) {
                if (line.startsWith('#EXTM3U')) continue;
                if (line.startsWith('#EXTINF:')) {
                    currentTitle = line.split(',', 2)[1]?.trim() || null;
                } else if (!line.startsWith('#') && line) {
                    const title = currentTitle || line.split('/').pop().replace('.mp3', '').replace(/-/g, ' ').trim();
                    tracks.push({ url: line, title });
                    currentTitle = null;
                }
            }

            console.log(`[Playlist] ${tracks.length} pistes trouvées`);

            playlistEl.innerHTML = tracks.length === 0 ? '<li>Aucune piste trouvée</li>' : '';

            tracks.forEach((track, i) => {
                const li = document.createElement('li');
                li.textContent = `${i + 1}. ${track.title}`;
                li.dataset.trackUrl = track.url;
                li.dataset.trackTitle = track.title;
                li.classList.add('track-item');
                playlistEl.appendChild(li);
            });

            if (tracks.length > 0) {
                const first = playlistEl.querySelector('li');
                first.classList.add('active');
                document.getElementById('current-track-title').textContent = tracks[0].title;
                wavesurfer.load(tracks[0].url);
                // wavesurfer.once('ready', () => wavesurfer.play());   // auto-play si tu veux
            }

        } catch (err) {
            console.error('[Playlist] Erreur :', err.message);
            playlistEl.innerHTML = `<li>Erreur chargement playlist : ${err.message}</li>`;
        }
    }

    // Lance le chargement
    loadPlaylist('music/Jane_Duke/The-Origin-Of-Evil-MP3-Edition/playlist-origin.txt');   // ou loadPlaylist('/chemin/exact/playlist-origin.m3u8');
});
