document.querySelector("#startBasicButton").addEventListener("click", startBasicEvent);
document.querySelector("#startExpandedButton").addEventListener("click", startExpandedEvent);

document.querySelector("#toMainMenuButton").addEventListener("click", toMainMenuEvent);
document.querySelector("#tomainmenu").addEventListener("click", toMainMenuEvent);
document.querySelector("#restartButton").addEventListener("click", restartEvent);
document.querySelector("#restart").addEventListener("click", restartEvent);
document.querySelector("#close_end_menu_button").addEventListener("click", closeEndGameMenu);

const menu = document.querySelector("#mainmenu");
const gamepage = document.querySelector("#gamepage");
const endmenu = document.querySelector("#endmenu");
const shade_courtain = document.querySelector("#shade_courtain");

function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function (event) {
        const targetElement = event.target.closest(selector)
        if (this.contains(targetElement)) handler.call(targetElement, event)
    })
}

function startBasicEvent() {
    startGame(getBasicMissions(), getBoardElements());
}

function startExpandedEvent() {
    startGame(getExtraMissions(), getBoardElements());
}

function toMainMenuEvent() {
    menu.classList.remove("disable");
    gamepage.classList.add("disable");
    endmenu.classList.add("disable");
    shade_courtain.classList.add("disable");
}

function restartEvent() {
    startGame(_missions, getBoardElements());
}

function startGame(missions, elements) {
    //initialising the variables
    menu.classList.add("disable");
    gamepage.classList.remove("disable");
    endmenu.classList.add("disable");
    shade_courtain.classList.add("disable");

    _missions = missions.concat([]);
    _elements = elements.concat([]);
    game_end = false;
    let t_missions = missions.concat([]);
    let t_elements = elements.concat([]);
    
    missions_pool = [];
    elements_pool = [];
    curr_element = null;

    game_board = [];
    is_busy_board = [];

    curr_season_time = 0;
    curr_season_ind = 0;

    mission1 = 0;
    mission2 = 1;

    total_p = 0;

    initialiseUI();

    //generating empty cells
    for (let i = 0; i < MAP_SIZE; i++) {
        game_board.push([]);
        is_busy_board.push([]);
        const tr = document.createElement("tr");
        for (let j = 0; j < MAP_SIZE; j++) {
            const td = document.createElement("td");
            td.style.backgroundImage = EMPTY_TILE;
            tr.appendChild(td);
            game_board[i].push(TERRAIN.EMPTY_TYPE);
            is_busy_board[i].push(false);
        }
        game_table.appendChild(tr);
    }

    //generating mountains
    MOUNTAINS_POS.forEach(element => {
        game_table.rows[element[0]].cells[element[1]].style.backgroundImage = MOUNTAIN_TILE;
        game_board[element[0]][element[1]] = TERRAIN.MOUNTAIN_TYPE;
        is_busy_board[element[0]][element[1]] = true;
    });

    //generating missions
    for (let i = 0; i < 4; i++) {
        let mission_ind = Math.floor(Math.random() * t_missions.length);
        missions_pool.push(t_missions[mission_ind]);
        game_missions[i].style.backgroundImage = missions_pool[i]["image"];
        t_missions.splice(mission_ind, 1);
    }

    //generating elements
    let sum = 0;
    for (let i = 0; i < _elements.length; i++) {
        let element_ind = Math.floor(Math.random() * t_elements.length);
        elements_pool.push(t_elements[element_ind]);
        sum += t_elements[element_ind].time;
        t_elements.splice(element_ind, 1);
    }
    t_elements = _elements.concat([]);
    while (sum < 28) {
        let element_ind = Math.floor(Math.random() * t_elements.length);
        elements_pool.push(t_elements[element_ind]);
        sum += t_elements[element_ind].time;
        t_elements.splice(element_ind, 1);
    }

    extractElement();
}

function closeEndGameMenu() {
    endmenu.classList.add("disable");
    shade_courtain.classList.add("disable");
}

function initialiseUI() {
    game_table.innerHTML = '';
    total_points_counter.innerHTML = 0;
    cur_season_container.innerHTML = "Spring";

    season_counters.forEach(element => {
        element.innerHTML = "0";
    });
    curr_season_counter.innerHTML = "0";
    
    mission_counters.forEach(element => {
        element.innerHTML = "0";
    });

    activities[0].classList.remove("disable");
    activities[1].classList.remove("disable");
    activities[2].classList.add("disable");
    activities[3].classList.add("disable");
}

//actual game logic

const MOUNTAINS_POS = [[1,1], [3,8], [5,3], [8,9], [9,5]];
const MAP_SIZE = 11;

const OPACITY = 0.7;

const EMPTY_TILE = "url(img/assignment_assets/assets/tiles/base_tile.svg)";
const MOUNTAIN_TILE = "url(img/assignment_assets/assets/tiles/mountain_tile.svg)";
const FOREST_TILE = "url(img/assignment_assets/assets/tiles/forest_tile.svg)";
const PLAINS_TILE = "url(img/assignment_assets/assets/tiles/plains_tile.svg)";
const VILLAGE_TILE = "url(img/assignment_assets/assets/tiles/village_tile.svg)";
const WATER_TILE = "url(img/assignment_assets/assets/tiles/water_tile.svg)";
const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "Spring"];

let _missions = [];
let _elements = [];
let missions_pool = []; // missions that are active in this game
let elements_pool = []; // elements in the order of appearing
let curr_element; // the current element to be placed

let game_board = []; // board containing information on what type the cell contains
let is_busy_board = []; // board containing boolean information on wether the cell is free to place

let curr_season_time = 0; // how much time was spent in the present season
let curr_season_ind = 0; // index of the current season

let game_end = false;

let mission1 = 0;
let mission2 = 1;

let total_p = 0;

const game_table = document.querySelector("#board_table");
const cur_element_table = document.querySelector("#cur_element_table");
const game_missions = document.querySelectorAll(".mission");
const season_counters = document.querySelectorAll(".season_counter");
const mission_counters = document.querySelectorAll(".mission_counter");
const activities = document.querySelectorAll(".activity");
const curr_season_counter = document.querySelector("#current_season_counter");
const cur_element_price_value = document.querySelector("#cur_element_price_value");
const total_points_counter = document.querySelector("#total_points");
const end_points_count = document.querySelector("#end_points_count");
const cur_season_container = document.querySelector("#curr_season");

delegate(game_table, "mouseover", "td", givePlacingPreview);
delegate(game_table, "mouseout", "td", removePlacingPreview);
delegate(game_table, "click", "td", placeElement);

document.querySelector("#rotate").addEventListener("click", rotateElement);
document.querySelector("#flip").addEventListener("click", flipElement);

function givePlacingPreview() {
    if (game_end) return;

    let col = this.cellIndex;
    let row = this.parentNode.rowIndex;

    if (isColliding(row, col)) {
        return;
    }

    let ip = 0;
    for (let i = row-1; i < row+2; i++) {
        let jp = 0;
        for (let j = col-1; j < col+2; j++) {
            if (curr_element.shape[ip][jp] === 1) {
                game_table.rows[i].cells[j].style.backgroundImage = getImageFromType(curr_element.type);
                game_table.rows[i].cells[j].style.opacity = OPACITY;
            }
            jp++;
        }
        ip++;
    }
}

function removePlacingPreview() {
    if (game_end) return;

    let col = this.cellIndex;
    let row = this.parentNode.rowIndex;

    if (isColliding(row, col)) {
        return;
    }

    let ip = 0;
    for (let i = row-1; i < row+2; i++) {
        let jp = 0;
        for (let j = col-1; j < col+2; j++) {
            if (curr_element.shape[ip][jp] === 1) {
                game_table.rows[i].cells[j].style.backgroundImage = getImageFromType(game_board[i][j]);
                game_table.rows[i].cells[j].style.opacity = 1;
            }
            jp++;
        }
        ip++;
    }
}

function isColliding(row, col) {
    try {
        let ip = 0;
        for (let i = row-1; i < row+2; i++) {
            let jp = 0;
            for (let j = col-1; j < col+2; j++) {
                if (curr_element.shape[ip][jp] === 1) {
                    if (i < 0 || j < 0 || i > 10 || j > 10) {
                        return true;
                    }
                    if (is_busy_board[i][j]) {
                        return true;
                    }
                }
                jp++;
            }
            ip++;
        }
    } catch (error) {
        return true;
    }

    return false;
}

function getImageFromType(str) {
    switch (str) {
        case TERRAIN.WATER_TYPE:
            return WATER_TILE;
        case TERRAIN.VILLAGE_TYPE:
            return VILLAGE_TILE;
        case TERRAIN.FOREST_TYPE:
            return FOREST_TILE;
        case TERRAIN.PLAINS_TYPE:
            return PLAINS_TILE;
        case TERRAIN.MOUNTAIN_TYPE:
            return MOUNTAIN_TILE;
    
        default:
            return EMPTY_TILE;
    }
}

function extractElement() {
    curr_element = elements_pool.pop();
    cur_element_price_value.innerHTML = curr_element.time;
    drawElementTable();
}

function drawElementTable() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (curr_element.shape[i][j] === 1) {
                cur_element_table.rows[i].cells[j].style.backgroundImage = getImageFromType(curr_element.type);
            } else {
                cur_element_table.rows[i].cells[j].style.backgroundImage = "";
            }
        }
    }
}

function rotateElement() {
    if (game_end) return;

    curr_element.shape = curr_element.shape[0].map((val, index) => curr_element.shape.map(row => row[index]).reverse())
    drawElementTable();
}

function flipElement() {
    if (game_end) return;

    let temp = curr_element.shape[0];
    curr_element.shape[0] = curr_element.shape[2];
    curr_element.shape[2] = temp;
    drawElementTable();
}

function placeElement() {
    if (game_end) return;

    let row = this.parentNode.rowIndex;
    let col = this.cellIndex;
    
    if (isColliding(row, col)) {
        return;
    }

    let ip = 0;
    for (let i = row-1; i < row+2; i++) {
        let jp = 0;
        for (let j = col-1; j < col+2; j++) {
            if (curr_element.shape[ip][jp] === 1) {
                game_table.rows[i].cells[j].style.opacity = 1;
                game_board[i][j] = curr_element.type;
                is_busy_board[i][j] = true;
            }
            jp++;
        }
        ip++;
    }

    curr_season_time += curr_element.time;
    if (curr_season_time >= 7) {
        changeSeason();
    }
    
    curr_season_counter.innerHTML = curr_season_time;
    
    if (!(curr_season_ind >= 4)) {
        extractElement();
    }
}

function changeSeason() {
    let m = evaluateBoard(mission1, mission2);
    season_counters[curr_season_ind++].innerHTML = m[0] + m[1];// = evaluateBoard(mission1, mission2);
    total_p += m[0] + m[1];
    total_points_counter.innerHTML = total_p;

    cur_season_container.innerHTML = SEASONS[curr_season_ind];

    mission_counters.forEach(element => {
        element.innerHTML = 0;
    });
    mission_counters[mission1].innerHTML = m[0];
    mission_counters[mission2].innerHTML = m[1];

    activities[mission1].classList.add("disable")
    
    mission1 = (mission1+1) % 4;
    mission2 = (mission2+1) % 4;

    activities[mission2].classList.remove("disable")
    
    if (curr_season_ind >= 4) {
        endGame();
    } else {
        curr_season_time = curr_season_time-7;
    }
}

function evaluateBoard(mission1, mission2) {
    // let sum = 0;

    //sum += 
    let m1 = missions_pool[mission1].evaluate(game_board);
    //sum += 
    let m2 = missions_pool[mission2].evaluate(game_board);

    return [m1, m2];
}

function endGame() {
    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 0; j < MAP_SIZE; j++) {
            if (game_board[i][j] === TERRAIN.MOUNTAIN_TYPE) {
                if (!checkAdj(game_board, i, j, TERRAIN.EMPTY_TYPE)) {
                    total_p += 1;
                };
            };
        };
    };

    end_points_count.innerHTML = total_p;
    total_points_counter.innerHTML = total_p;
    endmenu.classList.remove("disable");
    shade_courtain.classList.remove("disable");
    game_end = true;
}