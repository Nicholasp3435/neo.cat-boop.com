// modified from https://www.geeksforgeeks.org/how-to-draw-with-mouse-in-html-5-canvas/

window.addEventListener('load', () => { 
    canvas.addEventListener('mousedown', startPainting); 
    document.addEventListener('mouseup', stopPainting); 
    canvas.addEventListener('mousemove', sketch); 

    // Touch events for touch screens
    canvas.addEventListener('touchstart', startTouchPainting);
    document.addEventListener('touchend', stopPainting);
    canvas.addEventListener('touchmove', touchSketch);
}); 
    
const canvas = document.querySelector('#canvas'); 
const ctx = canvas.getContext('2d'); 
let coord = {x: 0, y: 0};  
let paint = false; 

// max undo stack
const MAX_UNDO_STATES = 30;

// saves state of each stroke for undoing
let undoStack = [];

const stroke = document.getElementById("stroke-color");
const thicc = document.getElementById("thicc");

thicc.addEventListener("input", (event) => {
    if (event.target.value > 50) {
        event.target.value = 50;
    } else if (event.target.value < 0) {
        event.target.value = 0;
    }
});

function getPosition(evt) {
    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

    coord.x = (evt.clientX - rect.left) * scaleX;
    coord.y = (evt.clientY - rect.top) * scaleY;
}

function getTouchPosition(touchEvent) {
    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

    coord.x = (touchEvent.touches[0].clientX - rect.left) * scaleX;
    coord.y = (touchEvent.touches[0].clientY - rect.top) * scaleY;
}

function startPainting(event){
    if (event.target.nodeName !== "CANVAS") return;
    paint = true; 
    saveState(); 
    getPosition(event); 
} 

function startTouchPainting(event) {
    event.preventDefault();
    paint = true;
    saveState();
    getTouchPosition(event);
}

function stopPainting() {
    paint = false; 
} 

function sketch(event){ 
    if (!paint) return; 
    ctx.beginPath(); 
    ctx.lineWidth = thicc.value; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = stroke.value; 
    ctx.moveTo(coord.x, coord.y); 
    getPosition(event); 
    ctx.lineTo(coord.x , coord.y); 
    ctx.stroke(); 
}

function touchSketch(event) {
    if (!paint) return;
    event.preventDefault(); 
    ctx.beginPath();
    ctx.lineWidth = thicc.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = stroke.value;
    ctx.moveTo(coord.x, coord.y);
    getTouchPosition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
}

function saveState() {
    if (undoStack.length >= MAX_UNDO_STATES) {
        undoStack.shift();
    }
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push(imageData);
}

function undo() {
    if (undoStack.length > 0) {
        let previousState = undoStack.pop();
        ctx.putImageData(previousState, 0, 0);
    }
}

function clearDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

