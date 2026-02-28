# Implementation Plan

## [Overview]
Fix critical HTML syntax errors, resolve JavaScript conflicts between playlist loading and WaveSurfer initialization, and ensure functional music playback from the music/Jane_Duke/The-Origin-Of-Evil-MP3-Edition/ directory serving all 21 tracks via M3U8 playlist.

The website has broken navigation links, unclosed HTML tags preventing proper rendering, and duplicate track click handlers causing unpredictable behavior. The playlist paths are correct relative to web root, WaveSurfer is properly initialized as a global instance, but coordination between playlists.js (loads playlist, populates DOM) and WaveSurferInit.js (attaches click handlers) needs synchronization. This plan prioritizes structural fixes first, then JS refactoring for reliable single-click track switching with auto-play, time display, and next-track advancement.

## [Types]
No TypeScript usage; vanilla JavaScript with DOM elements and WaveSurfer API. Key data structures:

- Track object: `{ url: string, title: string }` - url is relative path like 'music/Jane_Duke/The-Origin-Of-Evil-MP3-Edition/01 - Morning Birds.mp3', title extracted from #EXTINF or filename.
- DOM elements: #playlist (ul/li.track-item[data-track-url]), #current-track-title (h5), #audiowave (waveform container), #currentTime/#clipTime (time displays).
- Global: wavesurfer (WaveSurfer instance) - methods: load(url), play(), pause(), skipBackward(), skipForward(), stop(), getCurrentTime(), getDuration().

No new types/interfaces needed; leverage existing.

## [Files]
Modify 3 existing files; no new files or deletions.

- **index.html** (critical syntax fixes):
  | Change | Location | Details |
  |--------|----------|---------|
  | Fix href | Header logo | `href="index.html"` (add quote, remove linebreak) |
  | Fix href | Home menu | `href="index.html"` (remove linebreak) |
  | Fix IDs | Player info | Change 2nd `id="current-album"` to `id="current-track"` on h4 |
  | Close tags | Songs details | Add missing `</div>` for col-lg-6, col-lg-9, row, container-fluid, section |
  | Add Similar Songs | After artist | Complete `<section class="similar-songs-section">...</section>` stub |
  | Close body | End | Add `</section>` for similar songs, `</div>` containers, `</body>`, `</html>` |
  | Script order | Bottom | Ensure wavesurfer.min.js → WaveSurferInit.js → playlists.js

- **js/playlists.js** (remove handler duplication):
  | Change | Details |
  |--------|---------|
  | Simplify | Remove duplicate click handlers (let WaveSurferInit handle); just populate DOM and load first track |

- **js/WaveSurferInit.js** (enhance primary handler):
  | Change | Details |
  |--------|---------|
  | Update selector | `document.querySelectorAll('#playlist li[data-track-url]')` for specificity |
  | Add title update | `document.getElementById('current-track-title').textContent = trackTitleFromData()` |

No config files affected.

## [Functions]
Remove duplication, enhance coordination; no new functions.

- **Modified in js/playlists.js**:
  | Function | Changes |
  |----------|---------|
  | loadPlaylist() | Populate #playlist with `<li data-track-url="${track.url}" data-track-title="${track.title}">${i+1}. ${track.title}</li>`; load first track via wavesurfer.load() but NO click handler (delegate to WaveSurferInit.js); auto-activate first li.classList.add('active') |

- **Modified in js/WaveSurferInit.js**:
  | Function | Changes |
  |----------|---------|
  | Anonymous click handler | Update selector to '#playlist li[data-track-url]'; extract title from data-track-title; update #current-track-title; add next-track auto-advance on 'finish' event |

- **Global wavesurfer methods**: Use existing playPause(), skipBackward(), skipForward(), stop() bound to HTML buttons (already in index.html).

No removals.

## [Classes]
No class modifications; pure procedural JS with DOM queries. CSS classes affected:
- .active (on li.track-item for current track highlight)
- .playing (on .player-box for visual feedback)
No new CSS needed; assume style.css handles.

## [Dependencies]
No changes to external dependencies.

Current script stack functional:
- wavesurfer.min.js (vX from CDN/local)
- All other libs (jQuery, bootstrap, etc.) already loaded.
No new packages.

## [Testing]
Manual browser testing via local file serving (file:// or simple HTTP server).

- Unit: Console logs for playlist load (21 tracks), wavesurfer 'ready' events.
- Integration: Click each track li → verify load/play/#current-track-title updates; time displays update; prev/next/skip buttons work.
- E2E: Play full album → auto-advance to next; skipBackward/Forward navigate playlist.
- Visual: Waveform renders, play/pause button states, active track highlight.
Commands: `python -m http.server 8000` then browser_action to localhost:8000/index.html for verification.

## [Implementation Order]
Logical sequence to avoid breakage:

1. Fix index.html syntax (href, IDs, close all tags) → page renders without errors
2. Update js/playlists.js (populate data-track-url/title attrs, remove duplicate handlers) → clean playlist DOM
3. Enhance js/WaveSurferInit.js (specific selectors, title updates, auto-next) → functional clicks
4. Test via browser_action: launch http://localhost:8000/index.html (start server if needed), verify playlist loads/plays
5. Minor polish: album/track display logic, button bindings confirmation
