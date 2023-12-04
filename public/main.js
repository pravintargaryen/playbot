import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0'
// Since we will download the model from the Huggin;g Face Hub, we can skip the local model check
env.allowLocalModels = false;

// Reference the elements that we will need
const status = document.getElementById('status');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');
const textOutput = document.getElementById('output');
const textInput = document.getElementById('text-input')
const inputButton = document.getElementById('input-button')

// Create a new object detection pipeline
status.textContent = 'Loading...';
const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
status.textContent = 'Ready';

fileUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    // Set up a callback when the file is loaded
    reader.onload = function (e2) {
        imageContainer.innerHTML = '';
        const image = document.createElement('img');
        image.src = e2.target.result;
        imageContainer.appendChild(image);
        detect(image);
    };
    reader.readAsDataURL(file);
});


// Detect objects in the image
async function detect(img) {
    status.textContent = 'Still Working...';
    const output = await detector(img.src, {
        threshold: 0.5,
        percentage: true,
    });
    status.textContent = '';
    output.forEach(renderBox);
}

// Render a bounding box and label on the image
function renderBox({ box, label }) {
    const { xmax, xmin, ymax, ymin } = box;

    // Generate a random color for the box
    const color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, 0);

    // Draw the box
    const boxElement = document.createElement('div');
    boxElement.className = 'bounding-box';
    Object.assign(boxElement.style, {
        borderColor: color,
        left: 100 * xmin + '%',
        top: 100 * ymin + '%',
        width: 100 * (xmax - xmin) + '%',
        height: 100 * (ymax - ymin) + '%',
    });

    // Draw label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    textInput.textContent = label;
    typeText(label)
    setTimeout(() => {inputButton.click()}, 2000 )
    labelElement.className = 'bounding-box-label';
    labelElement.style.backgroundColor = color;
    boxElement.appendChild(labelElement);
    imageContainer.appendChild(boxElement);
}

function clickTextarea() {
    // Create a new mouse click event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
  
    // Dispatch the click event on the textarea
    textInput.dispatchEvent(clickEvent);
  }
  


function typeText(label) {
    clickTextarea()
    let index = 0;
    const typingSpeed = 100;
    const typingInterval = setInterval(function() {
      // Append one character at a time to the input field value
      textInput.value += label[index];
      index++;
  
      // Stop interval when the entire text has been typed
      if (index === label.length) {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
  }
  

