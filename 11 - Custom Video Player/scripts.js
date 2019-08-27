/* Get Elements */

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const range = player.querySelectorAll('.player__slider');
const progressBar = player.querySelector('.progress__filled');
const progressContainer = player.querySelector('.progress');
const fullscreenButton = player.querySelector('#fullscreen');

/* Player Flags */
let mouseDown = false; // flag for when mouse is down

/* Player Functions */
const toggleVideo = () => {
  if(video.paused) video.play();
  else video.pause();
}

const togglePlayButton = () => {
  const icon = video.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

const skipVideo = (e) => {
  const button = e.currentTarget;
  const skipTime = parseFloat(button.dataset.skip);
  // const skipTime = parseFloat(button.getAttribute('data-skip'));
  video.currentTime += skipTime;
}

const updateRange = (e) => {
  const slider = e.currentTarget;
  video[slider.name] = slider.value;
}

const updateProgressBar = () => {
  progressBar.style.flexBasis = `${(video.currentTime / video.duration) * 100}%`;
}

const scrubVideo = (e) => {
  const scrubTime = e.layerX / e.currentTarget.offsetWidth * video.duration;
  video.currentTime = scrubTime;
  updateProgressBar();
}

const fullscreenToggle = () => {
  if(!document.fullscreenElement) {
    player.requestFullscreen().catch(error => { // fullscreen on the player element so we also fullscreen the controls
      console.log(`Error attempting to enable full-screen mode: ${error.message} (${error.name})`);
    })
  } else {
    document.exitFullscreen();
  }
}

/* Listeners */
// Play, Pause
video.addEventListener('click', toggleVideo);
toggle.addEventListener('click', toggleVideo);
video.addEventListener('play', togglePlayButton);
video.addEventListener('pause', togglePlayButton);

// Skip
skipButtons.forEach(button => button.addEventListener('click', skipVideo));

// Volume, Speed
range.forEach(slider => slider.addEventListener('change', updateRange));
range.forEach(slider => slider.addEventListener('mousedown', () => mouseDown = true));
range.forEach(slider => slider.addEventListener('mouseup', () => mouseDown = false));
range.forEach(slider => slider.addEventListener('mousemove', (e) => mouseDown && updateRange(e)));

// Progres Bar
video.addEventListener('timeupdate', updateProgressBar);

// Scrub
progressContainer.addEventListener('click', scrubVideo);
progressContainer.addEventListener('mousedown', () => mouseDown = true);
document.addEventListener('mouseup', () => mouseDown = false);
progressContainer.addEventListener('mousemove', (e) => mouseDown && scrubVideo(e));

// Fullscreen
fullscreenButton.addEventListener('click', fullscreenToggle);
