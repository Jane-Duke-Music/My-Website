// À mettre après WaveSurfer.create(...) et tes on('ready'), on('audioprocess'), etc.

// Fonction pour parser un .m3u / .m3u8 basique
async function loadPlaylist(m3uUrl) {
    try {
        const response = await fetch('music-files/Jane_Duke/The-Origin-Of-Evil-(MP3 Edition)/The Origin Of Evil - The Legend Of Narcissus And Oedipus.m3u8');
        if (!response.ok) throw new Error('Playlist non trouvée');
        
        const text = await response.text();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        const tracks = [];
        let pendingTitle = null;

        for (let line of lines) {
            if (line.startsWith('#EXTM3U')) continue; // header

            if (line.startsWith('#EXTINF:')) {
                // Ex: #EXTINF:180,Mon Titre
                const parts = line.split(',', 2);
                const duration = parseInt(parts[0].split(':')[1]) || 0;
                pendingTitle = parts[1] || 'Track inconnu';
            } else if (!line.startsWith('#')) {
                // C'est l'URL du fichier audio
                const title = pendingTitle || line.split('/').pop().replace('.mp3', '');
                tracks.push({
                    url: line.startsWith('http') ? line : line,  // si relatif, fetch le gérera
                    title: title
                });
                pendingTitle = null;
            }
        }

        return tracks;
    } catch (err) {
        console.error('Erreur chargement playlist:', err);
        return [];
    }
}

// Utilisation : charge la playlist et crée la liste
const playlistContainer = document.getElementById('playlist'); // <ul id="playlist"></ul> dans ton HTML

loadAndDisplayPlaylist('music-files/Jane_Duke/Infection - Mp3/Infection.m3u8')  // ou '/assets/playlist.m3u8' selon où tu l'as mis
    .then(tracks => {
        if (tracks.length === 0) {
            playlistContainer.innerHTML = '<li>Erreur : playlist vide ou introuvable</li>';
            return;
        }

        playlistContainer.innerHTML = ''; // vide l’ancien contenu

        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${track.title}`;
            li.dataset.trackUrl = track.url;
            li.classList.add('track-item');
            li.addEventListener('click', function () {
                // Highlight
                document.querySelectorAll('#playlist .track-item').forEach(el => el.classList.remove('active'));
                this.classList.add('active');

                // Charge et joue
                wavesurfer.load(this.dataset.trackUrl);
                wavesurfer.once('ready', () => {
                    wavesurfer.play();
                });
            });
            playlistContainer.appendChild(li);
        });

        // Charge et joue la première piste automatiquement
        if (tracks.length > 0) {
            const firstLi = playlistContainer.querySelector('li');
            firstLi.classList.add('active');
            wavesurfer.load(firstLi.dataset.trackUrl);
            // wavesurfer.once('ready', () => wavesurfer.play());  ← décommente si auto-play au chargement page
        }
    });