var boardObj = {};

boardObj.board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

var addRandomTwoOrFour = function(){
  var randomX = Math.floor(Math.random() * 4);
  var randomY = Math.floor(Math.random() * 4);
  var twoOrFour;
  if (Math.random() < .85) {
    twoOrFour = 2;
  } else {
    twoOrFour = 4;
  }
  boardArray[randomX][randomY] = twoOrFour;
};

var populateBoard = function(){
  board.addRandomTwoOrFour();
  board.addRandomTwoOrFour();
};

var setThisToThat = function(coordArray1, coordArray2){
  boardObj.board[coordArray1[0]][coordArray1[1]] = boardObj.board[coordArray1[0][coordArray2[1]]]; // should be coordinates, not values
  boardObj.board[coordArray1[0][coordArray2[1]]] = 0;
};

var combineThisWithThat = function(box1, box2){

};

var consolidateLeft = function(){
  var somethingMoved = false;
  for (var x = 1; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
      var selectedElement = boardObj.board[x][y];
      var nextElementCoord = x - 1;
      if (selectedElement !== 0) {
        if (boardObj.board[nextElementCoord][y] === 0) {
          if (nextElementCoord === 0) {
            somethingMoved = setThisToThat([nextElementCoord, y], [x, y]);
          } else {
            while (nextElementCoord > 0 && boardObj.board[nextElementCoord][y] === 0) {
              nextElementCoord--;
            }
            if (boardObj.board[nextElementCoord][y] === selectedElement) { // if the next one isnt empty
              somethingMoved = combineSetClassAndHTML([nextElementCoord, y], [x, y]);
            } else if(nextElementCoord === 0){
              if(boardObj.board[nextElementCoord][y] === 0){
                somethingMoved = setThisToThat([nextElementCoord, y], [x, y]);
              }
              else {
                somethingMoved = setThisToThat([nextElementCoord + 1, y], [x, y]);
              }
            } else {
              somethingMoved = setThisToThat([nextElementCoord + 1, y], [x, y]);
            }
          }
        } else {
          if (boardObj.board[nextElementCoord][y] === selectedElement) { // if i can combine with the next one
            somethingMoved = combineSetClassAndHTML([nextElementCoord, y], [x, y]);
          } else if (nextElementCoord === 0 && boardObj.board[nextElementCoord][y] === 0) { // if we get to the end and its empty...
            somethingMoved = setThisToThat([nextElementCoord, y], [x, y]);
          }
        }
      }
    }
  }
  if(somethingMoved) helpers.addRandomTwoOrFour();
  return somethingMoved;
};

module.exports = boardObj;
