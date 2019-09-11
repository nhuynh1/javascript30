const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const filtersStrip = document.querySelector('.filters');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
let intervalID;

ctx.save(); // Save context so we can restore to fresh state when switching filters


// Filters from https://www.designpieces.com/2014/09/instagram-filters-css3-effects/
const filters = {
  xpro: "contrast(1.3) brightness(0.8) sepia(0.3) saturate(1.5) hue-rotate(-20deg)",
  valencia: "sepia(0.15) saturate(1.5) contrast(0.9)",
  toaster: "sepia(0.4) saturate(2.5) hue-rotate(-30deg) contrast(0.67)",
  sierra: "contrast(0.8) saturate(1.2) sepia(0.15)",
  mayfair: "saturate(1.4) contrast(1.1)",
  "lo-fi": "contrast(1.4) brightness(0.9) sepia(0.05)",
  inkwell: "grayscale(1) brightness(1.2) contrast(1.05)",
  hudson: "contrast(1.2) brightness(0.9) hue-rotate(-10deg)",
  earlybird: "sepia(0.4) saturate(1.6) contrast(1.1) brightness(0.9) hue-rotate(-10deg)",
  amaro: "hue-rotate(-10deg) contrast(0.9) brightness(1.1) saturate(1.5)",
  1977: "sepia(0.5) hue-rotate(-30deg) saturate(1.2) contrast(0.8)"
}

// Insert buttons for the filters listed in the filters object
const loadFilterButtons = () => {
  const filterNames = Object.keys(filters).sort((a, b) => a > b ? -1 : 1);
  const filterButtons = filterNames.reduce((fragment, filter) => {
    const button = document.createElement('button');
    button.setAttribute('onClick', `paintToCanvas('${filter}')`);
    button.textContent = filter;
    fragment.appendChild(button);
    return fragment;
  }, document.createDocumentFragment());
  
  filtersStrip.appendChild(filterButtons);
  const resetButton = document.createElement('button');
  resetButton.setAttribute('onClick', `paintToCanvas()`);
  resetButton.textContent = 'reset';
  filtersStrip.appendChild(resetButton);
}

// Draw video image to canvas
const paintToCanvas = (myFilter = '') => {
  const {videoWidth: width, videoHeight: height} = video;
  // canvas width and height properties need to be set so image is drawn to canvas properly
  [canvas.width, canvas.height] = [width, height];
  
  if(intervalID)
    clearInterval(intervalID);
  
  ctx.restore(); // reset context before applying new filter
  ctx.filter = filters[myFilter] || "none";
  
  intervalID = setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
  }, 16);
}

// Load camera
const getCamVideo = () => {
  navigator.mediaDevices.getUserMedia({audio: false, video: {faceMode: "user"}})
    .then(stream => {
      video.srcObject = stream;
    
      // Event handler properties
      video.onloadedmetadata = (e) => {
        video.play();
      };
      video.oncanplay = (e) => paintToCanvas();
    })
    .catch(error => {
      console.error(`${error.name}: ${error.message}`);
    })
}

// Take picture and put it in the photo strip
const takePhoto = () => {
  // Play photo-taking snap sound
  snap.currentTime = 0;
  snap.play();
  
  const canvasURI = canvas.toDataURL('image/jpeg');
  const img = new Image,
        link = document.createElement('a');
  img.src = canvasURI;
  img.setAttribute('alt', 'image from camera');
  link.href = canvasURI;
  link.setAttribute('download', 'selfie');
  link.appendChild(img);
  strip.insertBefore(link, strip.firstElementChild);
}

loadFilterButtons();
getCamVideo();