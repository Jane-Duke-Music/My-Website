// playlists.js - Chargement dynamique de la playlist .m3u8

document.addEventListener('DOMContentLoaded', function () {
    // Vérifie que wavesurfer existe déjà (défini dans WaveSurferInit.js)
    if (typeof wavesurfer === 'undefined') {
        console.error('wavesurfer non défini – assure-toi que WaveSurferInit.js est chargé AVANT playlists.js');
        return;
    }

    async function loadAndDisplayPlaylist(m3uRelativePath) {
        const playlistEl = document.getElementById('playlist');
        if (!playlistEl) {
            console.error('#playlist non trouvé dans le DOM');
            return;
        }

        try {
            console.log('Tentative de fetch playlist:', m3uRelativePath);
            const response = await fetch(m3uRelativePath);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status} - ${response.statusText}`);
            }

            const text = await response.text();
            console.log('Contenu brut m3u8 (premières lignes):', text.substring(0, 300)); // debug

            const lines = text.split('\n').map(l => l.trim()).filter(l => l);
            const tracks = [];
            let pendingTitle = null;

            lines.forEach(line => {
                if (line.startsWith('#EXTM3U')) return;
                if (line.startsWith('#EXTINF:')) {
                    const [, title] = line.split(',', 2);
                    pendingTitle = title ? title.trim() : null;
                } else if (!line.startsWith('#') && line) {
                    const url = line; // chemin relatif → bon si MP3 au bon endroit
                    const title = pendingTitle || line.split('/').pop().replace('.mp3', '').replace(/-/g, ' ').trim();
                    tracks.push({ url, title });
                    pendingTitle = null;
                }
            });

            if (tracks.length === 0) {
                playlistEl.innerHTML = '<li>Aucune piste trouvée dans la playlist</li>';
                console.warn('Playlist vide après parsing');
                return;
            }

            playlistEl.innerHTML = '';

            tracks.forEach((track, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${track.title}`;
                li.dataset.trackUrl = track.url;
                li.classList.add('track-item');
                li.style.cursor = 'pointer';
                li.addEventListener('click', function () {
                    document.querySelectorAll('#playlist .track-item').forEach(el => el.classList.remove('active'));
                    li.classList.add('active');

                    document.getElementById('current-track-title').textContent = track.title;

                    wavesurfer.load(track.url);
                    wavesurfer.once('ready', () => {
                        wavesurfer.play();
                    });
                });
                playlistEl.appendChild(li);
            });

            // Auto-load première piste
            const firstLi = playlistEl.querySelector('li');
            firstLi.classList.add('active');
            document.getElementById('current-track-title').textContent = tracks[0].title;
            wavesurfer.load(tracks[0].url);
            // wavesurfer.once('ready', () => wavesurfer.play()); // décommente pour play auto au load page

            console.log(`Playlist chargée : ${tracks.length} pistes`);

        } catch (err) {
            console.error('Erreur lors du chargement de la playlist:', err);
            playlistEl.innerHTML = `<li>Erreur : impossible de charger la playlist (${err.message})</li>`;
        }
    }

    // Choisis TON playlist ici (teste une à la fois)
    // Option 1 : Origin Of Evil (corrige le nom du fichier !)
    loadAndDisplayPlaylist('/music-files/Jane_Duke/The-Origin-Of-Evil-(MP3 Edition)/playlist-origin.m3u8'); // ← renomme ton .m3u8 en "playlist.m3u8" pour simplifier

    // Option 2 : Infection (décommente pour switcher)
    // loadAndDisplayPlaylist('/music-files/Jane_Duke/Infection - Mp3/Infection.m3u8');
});