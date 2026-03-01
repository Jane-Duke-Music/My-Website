// js/player.js
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js?module'

document.addEventListener('DOMContentLoaded', () => {
  // Création de l'instance WaveSurfer
  const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4e0202',
    progressColor: '#880000',
    cursorColor: '#b47302',
    barWidth: 3,
    barRadius: 3,
    responsive: true,
    height: 100,
    normalize: true,
    backend: 'WebAudio'
  })

  // Éléments DOM
  const playPauseBtn   = document.getElementById('playPause')
  const currentTrackEl = document.getElementById('current-track')
  const playlistEl     = document.getElementById('playlist')
  const albumSelect    = document.getElementById('album-select')
  const albumCoverEl   = document.getElementById('album-cover')

  let currentTracks = [] // pour garder la liste chargée

  // Fonction pour charger et afficher une playlist
  async function loadPlaylist(playlistFile) {
    try {
      const res = await fetch(playlistFile)
      if (!res.ok) throw new Error(`Playlist non trouvée : ${playlistFile}`)
      currentTracks = await res.json()

      playlistEl.innerHTML = '' // vide l'ancienne liste

      currentTracks.forEach((track, index) => {
        const li = document.createElement('li')
        li.innerHTML = `<span>${index + 1}.</span> ${track.title} <small>– ${track.artist}</small>`
        li.dataset.index = index
        li.addEventListener('click', () => playTrack(index))
        playlistEl.appendChild(li)
      })

      // Optionnel : précharge le premier track (waveform visible, mais pas de lecture auto)
      if (currentTracks.length > 0) {
        wavesurfer.load(currentTracks[0].url)
        currentTrackEl.textContent = currentTracks[0].title
        playlistEl.children[0].classList.add('playing')
      }

      // Met à jour la cover du premier track
      if (currentTracks[0]?.cover && albumCoverEl) {
        albumCoverEl.src = currentTracks[0].cover
        albumCoverEl.style.display = 'block'
      }
    } catch (err) {
      console.error('Erreur loadPlaylist:', err)
      playlistEl.innerHTML = '<li style="color: #ff5555;">Erreur : impossible de charger la playlist</li>'
    }
  }

  // Joue un track par son index dans la liste courante
  function playTrack(index) {
    const track = currentTracks[index]
    if (!track) return

    wavesurfer.load(track.url)
    currentTrackEl.textContent = track.title

    // Highlight
    document.querySelectorAll('#playlist li').forEach(el => el.classList.remove('playing'))
    playlistEl.children[index]?.classList.add('playing')

    if (albumCoverEl && track.cover) {
      albumCoverEl.src = track.cover
    }
  }

  // Contrôles play/pause
  playPauseBtn.addEventListener('click', () => {
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause()
      playPauseBtn.textContent = 'Play'
    } else {
      wavesurfer.play()
      playPauseBtn.textContent = 'Pause'
    }
  })

  // Événements WaveSurfer de base
  wavesurfer.on('finish', () => {
  wavesurfer.seekTo(0);

  const currentLi = document.querySelector('#playlist li.playing');
  if (!currentLi) return;

  const currentIndex = parseInt(currentLi.dataset.index || '0', 10);
  const nextIndex = currentIndex + 1;

  if (nextIndex < currentTracks.length) {
    currentLi.classList.remove('playing');

    const nextTrack = currentTracks[nextIndex];

    // Highlight + scroll
    if (playlistEl.children[nextIndex]) {
      playlistEl.children[nextIndex].classList.add('playing');
      playlistEl.children[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Charge et joue dès que prêt
    wavesurfer.once('ready', () => {
      wavesurfer.play();
      currentTrackEl.textContent = nextTrack.title;

      if (albumCoverEl && nextTrack.cover) {
        albumCoverEl.src = nextTrack.cover;
      }
    });

    wavesurfer.load(nextTrack.url);
  }
});
  // Changement d'album
  const albumData = {
    origin: {
      file:  'playlist-origin.json',
      cover: 'music/Jane_Duke/Album-Cover.png'
    },
    infection: {
      file:  'playlist-infection.json',
      cover: 'music/Jane_Duke/Infection.jpg'
    }
  }

  albumSelect.addEventListener('change', () => {
    const selected = albumSelect.value
    const data = albumData[selected] || albumData.origin

    if (albumCoverEl) {
      albumCoverEl.src = data.cover
    }

    loadPlaylist(data.file)
  })

  // Charge par défaut
  const initialValue = albumSelect.value || 'origin' // sécurité si value pas définie
  const initialData = albumData[initialValue] || albumData.origin

  if (albumCoverEl) {
    albumCoverEl.src = initialData.cover
  }

  loadPlaylist(initialData.file)
})