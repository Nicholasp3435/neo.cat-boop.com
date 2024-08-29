/** box js */

const boxFrontElements = document.getElementsByClassName("box_front");
const boxJumpables = ['133', '134', '135', '136', '196', '197', '470', '471', '700'];

const jump = { transform: ["translateY(0) rotate(0)", "translateY(-100px) rotate(180deg)", "translateY(0) rotate(359deg)"] };


function filter(e) {
    let target = e.target;

    if (!target.classList.contains("box_front")) {
        return;
    }

    let box_inside = target.parentElement.getElementsByClassName("box_inside")[0];

    if (box_inside.classList.contains("jumping")) {
        return;
    }

    box_inside.classList.add("jumping");    

    const jump_anim = box_inside.animate(jump, 1100);
    
    let rand_mon = boxJumpables[getRandomInt(0, boxJumpables.length)];

    if (!isMute) {
        var audio = new Audio(`eevees/${rand_mon}.mp3`);
        audio.volume = 0.25;
        audio.play();
    }
    box_inside.src = `eevees/${rand_mon}.png`;

    jump_anim.addEventListener("finish", (event) => {
        box_inside.classList.remove("jumping");   
        box_inside.src = "";
    });
    
}

document.onmousedown = filter;
document.ontouchstart = filter;

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


/** mute js */

const muteImg = document.getElementById("muteImg");
let isMute = false;
if (localStorage.getItem("isCrunchMute") === null) {
    localStorage.isCrunchMute = false;
}

function toggleSound() {
    if (isMute) {
        isMute = false;
        muteImg.src = "sound.png";
    } else {
        isMute = true;
        muteImg.src = "mute.png";
    }
    localStorage.isCrunchMute = isMute;
}

initToggleSounds();
function initToggleSounds() {
    if (localStorage.getItem("isCrunchMute") === "true") {
        isMute = true;
        muteImg.src = "mute.png";
    }
}