// modified from https://www.geeksforgeeks.org/how-to-draw-with-mouse-in-html-5-canvas/

window.addEventListener('load', () => { 
    canvas.addEventListener('mousedown', startPainting); 
    document.addEventListener('mouseup', stopPainting); 
    canvas.addEventListener('mousemove', sketch); 
    previousColorsContainer.addEventListener('mousedown', selectColor)

    // Touch events for touch screens
    canvas.addEventListener('touchstart', startTouchPainting);
    document.addEventListener('touchend', stopPainting);
    canvas.addEventListener('touchmove', touchSketch);

    askIfLoad();
}); 
    
const canvas = document.querySelector('#canvas'); 
canvas.width = 600;
canvas.height = 300;
const ctx = canvas.getContext('2d'); 



let coord = {x: 0, y: 0};  
let paint = false; 
let erasing = false;
let eyedropping = false;

// max undo stack
const MAX_UNDO_STATES = 100;

let undoPointer = 0;

// saves state of each stroke for undoing
let undoStack = [];

clearDraw();

const thicc = document.getElementById("thicc");
const erase = document.getElementById("eraser");
const eyedrop = document.getElementById("eyedropper");

const previousColorsContainer = document.getElementById("previous-colors");
var previousColorsElms = [];
var selectedColorIndex = 0;
for (let i = 0; i < previousColorsContainer.childElementCount; i++) {
    previousColorsElms.push(previousColorsContainer.children[i]);
    previousColorsElms[i].id = i;
}

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
    if (eyedropping) {
        getPosition(event); 
        eyedropPixel();
        return;
    }
    if (document.getElementById("loadbtn")) {
        document.getElementById("loadbtn").remove();
    } 
    paint = true; 
    getPosition(event); 
} 

function startTouchPainting(event) {
    if (event.target.nodeName !== "CANVAS") return;
    event.preventDefault();
    if (eyedropping) {
        getTouchPosition(event); 
        eyedropPixel();
        return;
    }
    if (document.getElementById("loadbtn")) {
        document.getElementById("loadbtn").remove();
    } 
    paint = true;
    getTouchPosition(event);
}

function stopPainting() {
    if (paint) {
        saveState();
        saveToLocal();
    }
    paint = false; 
} 

function sketch(event){ 
    if (!paint) return; 
    if (undoPointer < undoStack.length) {
        for (let i = undoPointer; i < undoStack.length; i++) {
            undoStack.pop();
        }
    }
    ctx.beginPath(); 
    ctx.lineWidth = thicc.value; 
    ctx.lineCap = 'round'; 
    if (!erasing) {
        ctx.strokeStyle = previousColorsElms[selectedColorIndex].value; 
    } else {
        ctx.strokeStyle = '#fff'; 
    }
    ctx.moveTo(coord.x, coord.y); 
    getPosition(event); 
    ctx.lineTo(coord.x , coord.y); 
    ctx.stroke(); 
}

function touchSketch(event) {
    if (!paint) return;
    if (undoPointer < undoStack.length) {
        for (let i = undoPointer; i < undoStack.length; i++) {
            undoStack.pop();
        }
    }
    event.preventDefault(); 
    ctx.beginPath();
    ctx.lineWidth = thicc.value;
    ctx.lineCap = 'round';
    if (!erasing) {
        ctx.strokeStyle = previousColorsElms[selectedColorIndex].value; 
    } else {
        ctx.strokeStyle = '#fff'; 
    }
    ctx.moveTo(coord.x, coord.y);
    getTouchPosition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
}

function saveState() {
    if (undoStack.length >= MAX_UNDO_STATES) {
        undoStack.shift();
        undoPointer--;
    }
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.push(imageData);
    undoPointer++;
    console.log(undoStack, undoPointer)
}

function undo() {
     if (undoPointer > 1) {
        undoPointer--;
        let previousState = undoStack[undoPointer - 1];
        ctx.putImageData(previousState, 0, 0);
    }
    console.log(undoStack, undoPointer)
}

function redo() {
    if (undoPointer < undoStack.length) {
        let nextState = undoStack[undoPointer];
        ctx.putImageData(nextState, 0, 0);
        undoPointer++;
    }

    console.log(undoStack, undoPointer)
}

function clearDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleErase() {
    if (erase.classList.contains("toggled")) {
        erase.classList.remove("toggled");
        erasing = false;
    } else {
        erasing = true;
        eyedropping = false;
        eyedrop.classList.remove("toggled");
        erase.classList.add("toggled");
    }
}

function toggleEyedropper() {
    if (eyedrop.classList.contains("toggled")) {
        eyedrop.classList.remove("toggled");
        eyedropping = false;
    } else {
        erasing = false;
        eyedropping = true;
        erase.classList.remove("toggled");
        eyedrop.classList.add("toggled");
    }
}

function eyedropPixel() {
    let [ r, g, b, a ] = ctx.getImageData( coord.x, coord.y, 1, 1 ).data;
    const color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    previousColorsElms[selectedColorIndex].value = color;
    console.log(r, g, b);
}

function selectColor(event) {
    const target = event.target;
    if (target.nodeName !== 'INPUT') {
        return;
    }
    for (let i = 0; i < previousColorsElms.length; i++) {
        previousColorsElms[i].classList.remove("toggled");
    }
    target.classList.add("toggled");
    selectedColorIndex = parseInt(target.id);
    console.log(selectedColorIndex);
}

function saveToLocal() {
    if (localStorage.getItem("lateststroke") === null) {
        localStorage.lateststroke = canvas.toDataURL();
    }
    localStorage.lateststroke = canvas.toDataURL();
}

function loadFromLocal() {
    var dataURL = localStorage.lateststroke;
    var img = new Image;
    img.src = dataURL;
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    };
}

function askIfLoad() {
    if (localStorage.getItem("lateststroke") !== null) {
        const loadbtn = document.createElement('button');
        loadbtn.id = "loadbtn";
        loadbtn.innerHTML = "Detected unsent image.<br>Click to load it?<br>Drawing will remove this message"
        loadbtn.onclick = function() {loadFromLocal();loadbtn.remove();};
        document.getElementById("drawing-container").appendChild(loadbtn);
    }
}


function clearDraw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();    
}