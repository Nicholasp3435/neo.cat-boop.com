const eatElements = document.getElementsByClassName("eatable");
const foods = ['cookie'];

function filter(e) {
    let target = e.target;

    if (!target.classList.contains("eatable")) {
        return;
    }
    let name = target.src.split("_")[0] + "_";
    let amount = target.src.split("_")[1].split(".")[0];
    if (amount == 25) {
        target.remove();
        if (!isMute) {
            var audio = new Audio('sounds/Burp.ogg');
            audio.play();
        }
        return;
    }
    if (!isMute) {
        var audio = new Audio(`sounds/Eat${getRandomInt(1,3)}.ogg`);
        audio.play();
    }
    target.src = name + (amount - 25) + ".png";
}

document.onmousedown = filter;
document.ontouchstart = filter;

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
  
  

function spawnFood() {
    let newFood = document.createElement("img");
    let randFood = foods[getRandomInt(0, foods.length)];
    newFood.src = randFood + "_100.png";
    newFood.classList.add("eatable");
    newFood.style.top = getRandomInt(0, window.innerHeight - 128) + "px";
    newFood.style.left = getRandomInt(0, window.innerWidth - 128) + "px";
    newFood.style.transform = `rotate(${getRandomInt(0, 359)}deg)`;
    document.body.appendChild(newFood);
}

spawnFood();
setInterval(spawnFood, 3000);

const muteImg = document.getElementById("muteImg");
let isMute = false;

function toggleSound() {
    if (isMute) {
        isMute = false;
        muteImg.src = "sound.png";
    } else {
        isMute = true;
        muteImg.src = "mute.png";
    }
}