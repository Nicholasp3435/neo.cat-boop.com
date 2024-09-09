console.log("mute.js");

const muteImg = document.getElementById("muteImg");
var isMute = false;
if (localStorage.getItem("isMute") === null) {
    localStorage.isCrunchMute = false;
}

function toggleSound() {
    if (isMute) {
        isMute = false;
        muteImg.src = "/resources/images/sound.gif";
    } else {
        isMute = true;
        muteImg.src = "/resources/images/mute.gif";
    }
    localStorage.isMute = isMute;
}

initToggleSounds();
function initToggleSounds() {
    if (localStorage.getItem("isMute") === "true") {
        isMute = true;
        muteImg.src = "/resources/images/mute.gif";
    }
}