import WaveSurfer from 'wavesurfer.js';
import playlist from './playlist.js';

let wavesurfer = null;
let currentTrackIndex = 0;

function initPlayer() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#800505',
        progressColor: '#e00808',
        height: 90,
        responsive: true,
        // ... autres options
    });

    loadTrack(currentTrackIndex);

    wavesurfer.on('finish', () => {
        nextTrack();
    });
}

function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const track = playlist[index];
    
    wavesurfer.load(track.url);
    
    // Mettre à jour le titre / interface
    document.querySelector('#current-title').textContent = track.title;
    document.querySelector('#current-artist').textContent = track.artist;
}

function playPause() {
    wavesurfer.playPause();
}

function nextTrack() {
    let next = currentTrackIndex + 1;
    if (next >= playlist.length) next = 0; // boucle ou stop selon ton choix
    loadTrack(next);
}

function prevTrack() {
    let prev = currentTrackIndex - 1;
    if (prev < 0) prev = playlist.length - 1;
    loadTrack(prev);
}

// Lancer le player
initPlayer();