import os
import json

# Helper function to format game names
def format_game_name(name):
    return name.replace('-', '_').lower()

# Helper function to clean song names
def clean_song_name(filename):
    parts = filename.split(' ')
    for i in range(len(parts)):
        letter = parts[i][0]
        if (ord(letter) >= 65 and ord(letter) <= 90) or (ord(letter) >= 97 and ord(letter) <= 122):
            name = ''
            for j in range(i, len(parts)):
                name += parts[j] + " "     
            return name.replace('.mp3 ', '')

# Directory containing the music files
base_dir = '.'  # Change to the path of your directory
output_file = 'list.js'

# Initialize the list to hold the data
music_list = []

# Walk through each subdirectory
for subdir, _, files in os.walk(base_dir):
    if subdir == base_dir:
        continue  # Skip the root directory

    game_name = format_game_name(os.path.basename(subdir))
    songs = {}

    # Process each file in the subdirectory
    for i, file in enumerate(sorted(files)):
        if file.endswith('.mp3'):
            clean_name = clean_song_name(file)  # Remove numbers from the song name
            songs[str(i)] = (clean_name, subdir.replace(".", "") + "/" + file)

    # Add the game and its songs to the list
    music_list.append({"game": game_name, "songs": songs})

# Write the data to a JavaScript file
with open(output_file, 'w') as f:
    f.write('export let list = ')
    f.write(json.dumps(music_list, indent=4, ensure_ascii=False))
    f.write(';')

print(f"{output_file} has been created!")
