// WaveSurfer Initialization

var wavesurfer = WaveSurfer.create({
    container: '#audiowave',
    waveColor: '#6b0a0a',       // rouge sombre
    progressColor: '#d40707',   // rouge plus vif
    cursorColor: '#070000',
    barWidth: 3,
    barGap: 1,
    cursor: true,
    cursorWidth: 2,
    height: 110,
    barHeight: 0.5,
    backgroundColor: '#111111'
});

wavesurferInit(wavesurfer);

function wavesurferInit(wavesurfer) {
    var trackID = document.getElementById('audiowave');
    var songURL = trackID.dataset.waveurl;
    wavesurfer.load(songURL);

    function formatSecondsAsTime(secs) {
        var hr  = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600))/60);
        var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

        if (min < 10){ 
            min = "0" + min; 
        }
        if (sec < 10){ 
            sec  = "0" + sec;
        }
        return min + ':' + sec;
    }


    $(document).ready(function($){
        $('#currentTime').appendTo('wave wave');
    });

    wavesurfer.on('audioprocess', function () {
        var clipCurrentTime = wavesurfer.getCurrentTime();
        document.getElementById('currentTime').innerHTML = formatSecondsAsTime(clipCurrentTime);
    });

    wavesurfer.on('ready', function () {
        var clipTime = wavesurfer.getDuration();
        document.getElementById('clipTime').innerHTML = formatSecondsAsTime(clipTime);
    });

    wavesurfer.on('interaction', function () {
        var clipCurrentTime = wavesurfer.getCurrentTime();
        document.getElementById('currentTime').innerHTML = formatSecondsAsTime(clipCurrentTime);
    });

    wavesurfer.on('play', function () {
        $(document).ready(function () {
            $('.player-box').addClass('playing');
            $('.jplayer').jPlayer("pauseOthers");
        });
    });

    wavesurfer.on('pause', function () {
        $(document).ready(function () {
            $('.player-box').removeClass('playing');
        });
    });
}