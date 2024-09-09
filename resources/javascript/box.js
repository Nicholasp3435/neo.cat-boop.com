console.log("box.js");

const boxFrontElements = document.getElementsByClassName("box_front");
const boxJumpables = ['133', '134', '135', '136', '196', '197', '470', '471', '700'];


function filterBoxes(e) {

    const target = e.target;
    
    if (target.nodeName === "HTML") {
        return;
    }

    const box_inside = target.parentElement.getElementsByClassName("box_inside")[0];

    if (!target.classList.contains("box_front")) {
        return;
    }

    if (box_inside.classList.contains("jumping")) {
        return;
    }

    box_inside.classList.add("jumping");    
    
    const rand_mon = boxJumpables[getRandomInt(0, boxJumpables.length)];

    if (!isMute) {
        var audio = new Audio("resources/images/eevees/sounds/" + rand_mon + ".opus");
        audio.volume = 0.25;
        audio.play();
    }

    box_inside.src = "resources/images/eevees/imgs/" + rand_mon + ".gif";

    setTimeout(function() {
        box_inside.classList.remove("jumping");
        box_inside.removeAttribute('src');
    }, 1200);
}

document.addEventListener('mousedown', filterBoxes);

document.addEventListener('touchstart', filterBoxes);

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}