console.log("mute.js");

const muteIcon = document.getElementById("mute-icon");
var isMute = false;
if (localStorage.getItem("isMute") === null) {
    localStorage.isCrunchMute = false;
}

function toggleSound() {
    if (isMute) {
        isMute = false;
        muteIcon.innerHTML = "&#xe042;";
    } else {
        isMute = true;
        muteIcon.innerHTML = "&#xe043;";
    }
    localStorage.isMute = isMute;
}

initToggleSounds();
function initToggleSounds() {
    if (localStorage.getItem("isMute") === "true") {
        isMute = true;
        muteIcon.innerHTML = "&#xe043;";
    }
}