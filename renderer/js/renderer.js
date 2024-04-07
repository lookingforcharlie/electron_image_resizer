// We can't do const os = require('os') here, we need preload.js to do that
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
    console.log('Please select an image');
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
}

// Make sure file is a image
function isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg'];

  return file && acceptedImageTypes.includes(file['type']);
}

img.addEventListener('change', loadImage);
