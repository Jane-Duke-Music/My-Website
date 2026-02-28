const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

const musicDir = './music/Jane_Duke';          // ← adapte si tes MP3 sont dans un sous-dossier
const outputFile = './playlists.json';

async function generate() {
  const files = fs.readdirSync(musicDir).filter(f => f.toLowerCase().endsWith('.mp3'));
  const tracks = [];

  for (const file of files) {
    try {
      const fullPath = path.join(musicDir, file);
      const metadata = await mm.parseFile(fullPath);
      const common = metadata.common;

      tracks.push({
        url: `${musicDir}/${file}`,   // chemin relatif pour le web (ex: music/Jane_Duke/mon-titre.mp3)
        filename: file,
        title: common.title || file
          .replace(/\.mp3$/i, '')
          .replace(/^\d+\s*[-–—]\s*/i, '')   // gère -, –, —
          .trim(),
        artist: common.artist || 'Jane Duke',
        album: common.album || 'The Origin of Evil',
        album: common.album || 'Infection',
        duration: metadata.format.duration,  // en secondes, si tu veux l'afficher
        year: common.year,
        trackNumber: common.trackNumber,
      });
    } catch (err) {
      console.error(`Erreur sur ${file}:`, err.message);
      // fallback si metadata cassée
      tracks.push({ url: `${musicDir}/${file}`, filename: file, title: file.replace(/\.mp3$/i, '') });
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(tracks, null, 2));
  console.log(`Playlist générée : ${tracks.length} morceaux → ${outputFile}`);
}

generate().catch(console.error);