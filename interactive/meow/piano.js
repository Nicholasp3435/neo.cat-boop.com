console.log("piano.js");

const folder_name = "/interactive/meow/meowsic_samples/Compressed - Meowsic_"
const piano_keys = document.getElementById("piano-container");
const key_names = ['C', 'C#', 'D', 'D#', 'E', 'F','F#', 'G', 'G#', 'A','A#', 'B', ]

function play_note(n) {
    var note_name = folder_name + n + ".wav";
    var audio = new Audio(note_name);
    audio.play();
}


function init_piano() {
    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < key_names.length; i++) {
            if (j == 0 && i <= 8 || j == 3 && i >= 1) {
                continue;
            }
            const key = document.createElement("button");
            key.id = key_names[i] + j;
            if (key_names[i].indexOf('#') > -1) {
                key.classList.add("black-key");
            } else {
                key.classList.add("white-key");
            }
            key.onclick = function(e) {
                var key_name = e.target.id;
                play_note(encodeURIComponent(key_name));
            };
            key.innerText = key_names[i];
        
            piano_keys.appendChild(key);
        }
    }
}

init_piano();