// js/player.js
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js?module'

document.addEventListener('DOMContentLoaded', () => {
  // Création de l'instance WaveSurfer
  const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4a4a8c',
    progressColor: '#7f7fd5',
    cursorColor: '#ddd',
    barWidth: 3,
    barRadius: 3,
    responsive: true,
    height: 100,
    normalize: true,
    backend: 'WebAudio' // ou 'MediaElement' si tu préfères
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
      if (!res.ok) throw new Error('Playlist non trouvée')
      currentTracks = await res.json()

      playlistEl.innerHTML = '' // vide l'ancienne liste

      currentTracks.forEach((track, index) => {
        const li = document.createElement('li')
        li.innerHTML = `<span>${index + 1}.</span> ${track.title} <small>– ${track.artist}</small>`
        li.dataset.index = index
        li.addEventListener('click', () => playTrack(index))
        playlistEl.appendChild(li)
      })

      // Charge le premier track automatiquement
      if (currentTracks.length > 0) {
        playTrack(0)
      }

      // Met à jour la cover (prend celle du premier track, ou fixe par album si tu veux)
      if (currentTracks[0]?.cover) {
        albumCoverEl.src = currentTracks[0].cover
        albumCoverEl.style.display = 'block'
      }
    } catch (err) {
      console.error(err)
      playlistEl.innerHTML = '<li style="color: #ff5555;">Erreur : impossible de charger la playlist</li>'
    }
  }

  // Joue un track par son index dans la liste courante
  function playTrack(index) {
    const track = currentTracks[index]
    if (!track) return

    wavesurfer.load(track.url)
    currentTrackEl.textContent = track.title

    // Highlight le track sélectionné
    document.querySelectorAll('#playlist li').forEach(el => el.classList.remove('playing'))
    playlistEl.children[index].classList.add('playing')

    // Option : change la cover si chaque track en a une différente
    if (track.cover) albumCoverEl.src = track.cover
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

  // Événements WaveSurfer
  wavesurfer.on('play', () => playPauseBtn.textContent = 'Pause')
  wavesurfer.on('pause', () => playPauseBtn.textContent = 'Play')
  wavesurfer.on('ready', () => {
    // Option : auto-play au chargement du premier track
    // wavesurfer.play()
  })

  // Changement d'album
  albumSelect.addEventListener('change', () => {
    const selected = albumSelect.value
    const file = selected === 'infection' ? 'playlist-infection.json' : 'playlist-origin.json'
    loadPlaylist(file)
  })

  // Charge l'album par défaut au démarrage (Origin Of Evil)
  loadPlaylist('playlist-origin.json')
})