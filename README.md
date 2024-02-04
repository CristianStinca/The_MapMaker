# The MapMaker
A single player, tetris-like game. Inspired from the board game "Cartographers". 

### How to start the project?
No pre-installs needed. Just download all the files, run the index.html and the game will open in your default browser.

### How to play?
You have to place map elements of different shapes and terrain types on an 11x11 square grid map. Each element is assigned a time value (1 or 2) and the game consists of 28 time units. A number of checks for missions are performed against the current state of the grid. At the end of each season you are given points corresponding to two missions.

### Calculating the score
Every season 2 out of 4 missions are active. At the end of each (the game lasts 4 seasons), the points are assigned corresponding to the missions rules. Additionally, if you surround the mountains on 4 sides, you get 1 point per surrounded mountain.
