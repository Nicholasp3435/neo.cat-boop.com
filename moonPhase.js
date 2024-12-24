console.log("moonPhase.js");

const moonDiv = document.getElementById("moonPhase");

const moonImg = document.createElement("img");
moonImg.classList.add("full-width");
moonDiv.appendChild(moonImg);

var date_moon = new Date();
date_moon = date_moon.toISOString();
date_moon = date_moon.substring(0, date_moon.length - 8);
const url = "https://svs.gsfc.nasa.gov/api/dialamoon/" + date_moon;

var r = new XMLHttpRequest();

r.onload = function () {
    const json = JSON.parse(r.responseText);
    var moonURL = json['image']['url'];
    moonImg.src = moonURL;
    moonImg.alt = json['image']['alt_text'];
};

r.open("GET", url);
r.send(); 
