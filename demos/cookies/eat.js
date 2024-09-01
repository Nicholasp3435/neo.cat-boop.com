/** food click js */

const eatElements = document.getElementsByClassName("eatable");
const foods = ['cookie'];

function filter(e) {
    const target = e.target;

    if (!target.classList.contains("eatable")) {
        return;
    }

    const name = target.src.split("_")[0] + "_";
    const amount = target.src.split("_")[1].split(".")[0];
    
    if (amount <= 25) {
        target.remove();
        if (!isMute) {
            var audio = new Audio('sounds/Burp.opus');
            audio.play();
        }
        return;
    }
    if (!isMute) {
        var audio = new Audio("sounds/Eat" + getRandomInt(1, 4) + ".opus");
        audio.play();
    }
    target.src = name + (amount - 25) + ".gif";
}

document.onmousedown = filter;
document.ontouchstart = filter;


/** rng food js */

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function spawnFood() {
    const newFood = document.createElement("img");
    const randFood = foods[getRandomInt(0, foods.length)];
    newFood.src = "imgs/" + randFood + "_100.gif";
    newFood.classList.add("eatable");

    // 155 because the diagonal makes the 128 actually longer and push off the screen making scroll bars
    newFood.style.top = getRandomInt(0, window.innerHeight - 155) + "px";
    newFood.style.left = getRandomInt(0, window.innerWidth - 155) + "px";
    newFood.style.transform = "rotate(" + getRandomInt(0, 360) + "deg)";
    document.body.appendChild(newFood);
}

spawnFood();
var cookie_interval = setInterval(spawnFood, 3000);


/** mute js */

const muteImg = document.getElementById("muteImg");
var isMute = false;
if (localStorage.getItem("isCrunchMute") === null) {
    localStorage.isCrunchMute = false;
}

function toggleSound() {
    if (isMute) {
        isMute = false;
        muteImg.src = "sounds/sound.gif";
    } else {
        isMute = true;
        muteImg.src = "sounds/mute.gif";
    }
    localStorage.isCrunchMute = isMute;
}

initToggleSounds();
function initToggleSounds() {
    if (localStorage.getItem("isCrunchMute") === "true") {
        isMute = true;
        muteImg.src = "mute.gif";
    }
}