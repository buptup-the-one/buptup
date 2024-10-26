document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const video = document.getElementById('video');
    const playPauseButton = document.getElementById('play-pause');
    const muteUnmuteButton = document.getElementById('mute-unmute');
    const volumeSlider = document.getElementById('volume');
    const fullscreenButton = document.getElementById('fullscreen');
    const seekBar = document.getElementById('seek-bar');
    const timeDisplay = document.getElementById('time-display');
    const loadingSpinner = document.getElementById('loading-spinner');
    const videoContainer = document.getElementById('video-container');
    const controls = document.getElementById('controls');

    let isPlaying = false;
    let animationFrameId;
    let controlsTimeout;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const updateSeekBar = () => {
        seekBar.value = (video.currentTime / video.duration) * 100;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    };

    const drawFrame = () => {
        if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            animationFrameId = requestAnimationFrame(drawFrame);
            updateSeekBar();
        }
    };

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            video.pause();
            cancelAnimationFrame(animationFrameId);
            playPauseButton.textContent = 'Play';
        } else {
            video.play();
            drawFrame();
            playPauseButton.textContent = 'Pause';
        }
        isPlaying = !isPlaying;
    });

    muteUnmuteButton.addEventListener('click', () => {
        if (video.muted) {
            video.muted = false;
            muteUnmuteButton.textContent = 'Mute';
        } else {
            video.muted = true;
            muteUnmuteButton.textContent = 'Unmute';
        }
    });

    volumeSlider.addEventListener('input', () => {
        video.volume = volumeSlider.value;
    });

    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    seekBar.addEventListener('input', () => {
        const seekTime = (seekBar.value / 100) * video.duration;
        video.currentTime = seekTime;
    });

    video.addEventListener('timeupdate', updateSeekBar);

    video.addEventListener('loadeddata', () => {
        loadingSpinner.style.display = 'none';
        updateSeekBar();
    });

    video.addEventListener('waiting', () => {
        loadingSpinner.style.display = 'block';
    });

    video.addEventListener('playing', () => {
        loadingSpinner.style.display = 'none';
    });

    video.addEventListener('ended', () => {
        isPlaying = false;
        playPauseButton.textContent = 'Play';
    });

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case ' ':
                playPauseButton.click();
                break;
            case 'm':
                muteUnmuteButton.click();
                break;
            case 'f':
                fullscreenButton.click();
                break;
        }
    });

    const showControls = () => {
        controls.classList.add('show');
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        controlsTimeout = setTimeout(() => {
            controls.classList.remove('show');
        }, 3000);
    };

    videoContainer.addEventListener('mousemove', showControls);

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            videoContainer.classList.add('fullscreen');
            showControls();
        } else {
            videoContainer.classList.remove('fullscreen');
            controls.classList.remove('show');
            if (controlsTimeout) {
                clearTimeout(controlsTimeout);
            }
        }
    });
});
