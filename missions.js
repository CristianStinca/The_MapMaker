import { TERRAIN } from "./elements.js";
import { MAP_SIZE } from "./main.js";

export function getBasicMissions() {
    return missions["basic"];
}

export function getExtraMissions() {
    return missions["basic"].concat(missions["extra"]);
}

function checkAdj(board, i, j, type) {
  let l = false;
  if (i > 0) l |= board[i-1][j] === type;
  if (j > 0) l |= board[i][j-1] === type;
  if (i < MAP_SIZE-1) l |= board[i+1][j] === type;
  if (j < MAP_SIZE-1) l |= board[i][j+1] === type;
  return l;
}

const missions = 
{
  "basic": [
    {
      "title": "Edge of the forest",
      "description": "You get one point for each forest field adjacent to the edge of your map.",
      "image": 'url("img/assignment_assets/assets/missions_eng/Group 69.png")',
      evaluate : function(board) {
        let sum = 0;
        for (let i = 0; i < MAP_SIZE; i++) {
          if (board[0][i] === TERRAIN.FOREST_TYPE) sum++;
          if (board[MAP_SIZE-1][i] === TERRAIN.FOREST_TYPE) sum++;
          if (board[i][0] === TERRAIN.FOREST_TYPE) sum++;
          if (board[i][MAP_SIZE-1] === TERRAIN.FOREST_TYPE) sum++;
        }

        console.log("forest edge: " + sum);
        return sum;
      }
    },
    {
      "title": "Sleepy valley",
      "description": "For every row with three forest fields, you get four points.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 74.png')",
      evaluate : function(board) {
        let sum = 0;
        for (let i = 0; i < MAP_SIZE; i++) {
          let cnt = 0;
          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[i][j] === TERRAIN.FOREST_TYPE) cnt++;
          }
        if (cnt === 3) sum += 4;
        }

        console.log("three forest in a row: " + sum);
        return sum;
      }
    },
    {
      "title": "Watering potatoes",
      "description": "You get two points for each water field adjacent to your farm fields.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 70.png')",
      evaluate : function(board) {
        let sum = 0;
        for (let i = 0; i < MAP_SIZE; i++) {
          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[i][j] === TERRAIN.WATER_TYPE) {
              if (checkAdj(board, i, j, TERRAIN.PLAINS_TYPE)) sum += 2;
            }
          }
        }

        console.log("water adj to farm: " + sum);
        return sum;
      }
    },
    {
      "title": "Borderlands",
      "description": "For each full row or column, you get six points.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 78.png')",
      evaluate : function(board) {
        let sum = 0;
        for (let i = 0; i < MAP_SIZE; i++) {
          let isRow = true;
          let isCol = true;
          for (let j = 0; j < MAP_SIZE; j++) {
            if (isRow && board[i][j] === TERRAIN.EMPTY_TYPE) isRow = false;
            if (isCol && board[j][i] === TERRAIN.EMPTY_TYPE) isCol = false;
          }
          if (isRow) sum += 6;
          if (isCol) sum += 6;
        }

        console.log("full row/col: " + sum);
        return sum;
      }
    }
  ],
  "extra": [
    {
      "title": "Tree line",
      "description": "You get two points for each of the fields in the longest vertically uninterrupted continuous forest. If there are two or more tree lines with the same longest length, only one counts.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 68.png')",
      evaluate : function(board) {
        let max = 0;
        for (let i = 0; i < MAP_SIZE; i++) {
          let loc_max = 0;
          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[j][i] === TERRAIN.FOREST_TYPE) {
              loc_max++;
              if (loc_max > max) {
                max = loc_max;
              }
            } else {
              loc_max = 0;
            }
          }
        }
        console.log("Tree line: " + (2*max));
        return 2*max;
      }
    },
    {
      "title": "Watering canal",
      "description": "For each column of your map that has the same number of farm and water fields, you will receive four points. You must have at least one field of both terrain types in your column to score points.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 75.png')",
      evaluate : function(board) {
        let cnt = 0;

        for (let i = 0; i < MAP_SIZE; i++) {
          let plain_cnt = 0;
          let water_cnt = 0;

          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[j][i] === TERRAIN.PLAINS_TYPE) {
              plain_cnt++;
            } else if (board[j][i] === TERRAIN.WATER_TYPE) {
              water_cnt++;
            }
          }

          if (plain_cnt === water_cnt && plain_cnt >= 1) {
            cnt++;
          }

        }
        console.log("Watering canal: " + (cnt * 4));
        return cnt * 4;
      }
    },
    {
      "title": "Wealthy town",
      "description": "You get three points for each of your village fields adjacent to at least three different terrain types.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 71.png')",
      evaluate : function(board) {
        let cnt = 0;

        for (let i = 0; i < MAP_SIZE; i++) {

          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[i][j] === TERRAIN.VILLAGE_TYPE) {
              let list = new Set();

              if (i > 0) list.add(board[i-1][j]);
              if (j > 0) list.add(board[i][j-1]);
              if (i < MAP_SIZE-1) list.add(board[i+1][j]);
              if (j < MAP_SIZE-1) list.add(board[i][j+1]);

              list.delete(TERRAIN.EMPTY_TYPE);

              if (list.size >= 3) {
                cnt++;
              }
            }
          }

        }
        console.log("Wealthy town: " + (cnt * 3));
        return cnt * 3;
      }
    },
    {
      "title": "Magicians' valley",
      "description": "You get three points for your water fields adjacent to your mountain fields.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 76.png')",
      evaluate : function(board) {
        let cnt = 0;

        for (let i = 0; i < MAP_SIZE; i++) {

          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[i][j] === TERRAIN.WATER_TYPE) {
              if (checkAdj(board, i, j, TERRAIN.MOUNTAIN_TYPE)) {
                cnt++;
              }
            }
          }

        }
        console.log("Magicians' valley: " + (cnt * 3));
        return cnt * 3;
      }
    },
    {
      "title": "Empty site",
      "description": "You get two points for empty fields adjacent to your village fields.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 77.png')",
      evaluate : function(board) {
        let cnt = 0;

        for (let i = 0; i < MAP_SIZE; i++) {

          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[i][j] === TERRAIN.EMPTY_TYPE) {
              if (checkAdj(board, i, j, TERRAIN.VILLAGE_TYPE)) {
                cnt++;
              }
            }
          }

        }
        console.log("Empty site: " + (cnt * 2));
        return cnt * 2;
      }
    },
    {
      "title": "Terraced house",
      "description": "For each field in the longest village fields that are horizontally uninterrupted and contiguous you will get two points.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 72.png')",
      evaluate : function(board) {
        let cnt = 0;
        let max_len = 0;

        for (let i = 0; i < MAP_SIZE; i++) {
          let loc_max = 0;
          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[i][j] === TERRAIN.VILLAGE_TYPE) {
              loc_max++;
            } else {
              if (loc_max > max_len) {
                max_len = loc_max;
                cnt = 1;
              } else if (loc_max === max_len) {
                cnt++;
              }
              loc_max = 0;
            }
          }

        }
        console.log("Terraced house: " + (max_len * cnt * 2));
        return max_len * cnt * 2;
      }
    },
    {
      "title": "Odd numbered silos",
      "description": "For each of your odd numbered full columns you get 10 points.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 73.png')",
      evaluate : function(board) {
        let cnt = 0;

        for (let i = 0; i < MAP_SIZE; i+=2) {
          let l = true;
          for (let j = 0; j < MAP_SIZE; j++) {
            if (board[j][i] === TERRAIN.EMPTY_TYPE) {
              l = false;
              break;
            }
            
          }
          
          if (l) {
            console.log("Odd numbered silos column: " + (i));
            cnt++;
          }
        }
        console.log("Odd numbered silos: " + (cnt * 10));
        return cnt * 10;
      }
    },
    {
      "title": "Rich countryside",
      "description": "For each row with at least five different terrain types, you will receive four points.",
      "image": "url('img/assignment_assets/assets/missions_eng/Group 79.png')",
      evaluate : function(board) {
        let cnt = 0;

        for (let i = 0; i < MAP_SIZE; i++) {
          let list = new Set([TERRAIN.EMPTY_TYPE]);
          for (let j = 0; j < MAP_SIZE; j++) {
            list.add(board[i][j]);
          }

          if (list.size-1 >= 5) {
            cnt++;
          }
        }
        console.log("Rich countryside: " + (cnt * 4));
        return cnt * 4;
      }
    }
  ],
}