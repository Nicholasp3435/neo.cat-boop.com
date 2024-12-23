import { list } from "../music/list.js";

console.log("music.js");

const songs_list = document.getElementById("songs");
const player = document.getElementById("player");
const audio = document.getElementById('audio');

list.forEach(game => {
    for (let i = 0; i < Object.keys(game.songs).length; i++) {
        const option = document.createElement("option");
        option.innerHTML = game.songs[i][0];
        option.value = game.songs[i][1];
        songs_list.appendChild(option);
    }
});

songs_list.onchange = function() {

  
    player.src = "/resources/music/" + songs_list.value;
    audio.load(); //call this to just preload the audio without playing
}