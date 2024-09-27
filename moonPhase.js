console.log("moonPhase.js");

const moonDiv = document.getElementById("moonPhase");

const moonImg = document.createElement("img");
moonDiv.appendChild(moonImg);

var date = new Date();
date = date.toISOString();
date = date.substring(0, date.length - 8);
const url = "https://svs.gsfc.nasa.gov/api/dialamoon/" + date;

var r = new XMLHttpRequest();


r.onload = function () {
    const json = JSON.parse(r.responseText);
    var moonURL = json['image']['url'];
    moonImg.src = moonURL;
};

r.open("GET", url);
r.send(); 
