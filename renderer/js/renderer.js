// We can't do const os = require('os') here, because renderer processes do not run node.js
// main process has the full operating system access
// we need preload.js to do that as the bridge
// const os = require('os');

const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

// When you upload a file, it gets put into an array called files, even if it's just one single file
function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError('Please select an image.');
    return;
  }

  // Get the original dimensions of the picture
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  // show the form
  form.style.display = 'block';
  // get the file name and render on the page
  filename.innerText = file.name;

  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

// Send image data th main
function sendImage(e) {
  e.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  // In electron, it provides .path method for us to get the path of a file
  const imgPath = img.files[0].path;

  if (!img.files[0]) {
    alertError('Please upload an image');
    return;
  }

  if (width === '' || height === '') {
    alertError('Please fill in a height and width');
    return;
  }

  // Send to main using ipcRenderer
  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  });
}

// Catch the image:done event
ipcRenderer.on('image:done', () => {
  alertSuccess(`Image resized to ${widthInput.value} X ${heightInput.value}`);
});

// Make sure file is a image
function isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg'];

  return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 4000,
    close: false, // won't have a close button
    style: {
      color: 'white',
      background: 'pink',
      textAlign: 'center',
    },
  });
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 4000,
    close: false, // won't have a close button
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);
