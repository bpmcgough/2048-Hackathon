var Handlers = require('./keyDownHandlers.js');
var game = require('./game.js');
var helpers = require('./helperFunk.js');

var aI = {};

var peekAhead = function(){

};

var makeRandomMove = function(){
  var num = Math.floor(Math.random() * (4));
  if(num === 1) Handlers.consolidateLeft();
  else if(num === 2) Handlers.consolidateRight();
  else if(num === 3) Handlers.consolidateUp();
  else if(num === 4) Handlers.consolidateDown();
};

var peekStrategy = function(direction){
  // i want to make like a virtual board that i can run tests on but wont display
  // or the ability to reverse
  // make a 'history of moves'
  var moveHistory = [];
};

var moveToScore = function(){
  var possibleStartingMoves = [];
};

var emptySpaceCheck = function(box1, box2, direction){
  var spaceIsEmpty = true;
  var box1X = box1.id[0];
  var box1Y = box1.id[2];
  var box2X = box2.id[0];
  var box2Y = box2.id[2];
  if(direction === 'horizontal'){
    for(var i = box1X; i < box2X; i++){
      if(document.getElementById(i + '-' + box1Y).className !== 'empty'){
        spaceIsEmpty = false;
      }
    }
  } else if(direction === 'vertical'){
    for(var j = box1Y; j < box2Y; j++){
      if(document.getElementById(box1X + '-' + j).className !== 'empty'){
        spaceIsEmpty = false;
      }
    }
  }
  return spaceIsEmpty;
};

var canICombineHorizontal = function(){
  // if there are two boxes of similar value without anything between, consolidate in that direction
  // maybe instead of having to loop, i can just have like an array of all the occupied boxes
  // and loop through those
  var executeMove = false;
  for(var x = 0; x < 4; x++){
    for(var y = 0; y < 4; y++){
      for(var xx = x + 1; xx < 4; xx++){
        if(document.getElementById(x + '-' + y).className === document.getElementById(xx + '-' + y).className){ // if two boxes in a row have the same value
          // check if there's anything between them
          if(xx - x === 0){ // if theyre next to each other
            executeMove = 1;
          } else if(emptySpaceCheck(document.getElementById(x + '-' + y), document.getElementById(xx + '-' + y), 'horizontal')){ // if theres nothing between them
            executeMove = true;
          }
        }
      }
    }
  }
  return executeMove;
};

var canICombineVertical = function(){
  var executeMove = false;
  for(var x = 0; x < 4; x++){
    for(var y = 0; y < 4; y++){
      for(var yy = y + 1; yy < 4; yy++){
        if(document.getElementById(x + '-' + y).className === document.getElementById(x + '-' + yy).className){ // if two boxes in a row have the same value
          console.log('two boxes in a column can combine', document.getElementById(x + '-' + y).className, document.getElementById(x + '-' + yy))
          // check if there's anything between them
          if(yy - y === 1){ // if theyre next to each other
            console.log('next to each other vertical')
            executeMove = true;
          } else if(emptySpaceCheck(document.getElementById(x + '-' + y), document.getElementById(x + '-' + yy), 'vertical')){ // if theres nothing between them
            console.log('looking for empty space')
            executeMove = true;
          }
        }
      }
    }
  }
  return executeMove;
};

aI.mainStrategy = function(){
  var canMove = true;
  while(canMove){
    var goHorizontal = canICombineHorizontal();
    var goVertical = canICombineVertical();
    if(goHorizontal && goVertical){
      console.log('go both')
      if(!Handlers.consolidateRight()){
        if(!Handlers.consolidateUp()){
          if(!Handlers.consolidateLeft()) Handlers.consolidateDown();
        }
      }
    } else if(goHorizontal){
      console.log('go horizontal')
      if(!Handlers.consolidateRight()) Handlers.consolidateLeft();
    } else if(goVertical){
      console.log('go vertical')
      if(!Handlers.consolidateUp()) Handlers.consolidateDown();
    } else {
      console.log('cant consolidate')
      if(!Handlers.consolidateRight() && !Handlers.consolidateUp() && !Handlers.consolidateLeft() && !Handlers.consolidateDown()){
        console.log('cant move')
        canMove = false;
      }
    }
    console.log('score:', helpers.score);
  }
  // top right corner is favored
};

module.exports = aI;
