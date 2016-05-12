var Handlers = require('./keyDownHandlers.js');
var game = require('./game.js');
var helpers = require('./helperFunk.js');

var aI = {};

aI.downLeftCorner = function(){
  var atLeastOneCanMove = true;

  while(atLeastOneCanMove){
    while(Handlers.consolidateLeft() && Handlers.consolidateDown()){}
    Handlers.consolidateUp();
    while(Handlers.consolidateLeft() && Handlers.consolidateDown()){}
    if(!Handlers.consolidateRight() && !Handlers.consolidateUp()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

aI.downRightCorner = function(){
  var atLeastOneCanMove = true, canMoveRightDownUp = true;

  while(atLeastOneCanMove){
    while(canMoveRightDownUp){
      while(Handlers.consolidateRight() && Handlers.consolidateDown()){}
      Handlers.consolidateUp();
      if(!Handlers.consolidateRight() && !Handlers.consolidateDown() && !Handlers.consolidateUp()){
        canMoveRightDownUp = false;
      }
    }
    if(!Handlers.consolidateLeft() && !Handlers.consolidateUp() && !Handlers.consolidateRight() && !Handlers.consolidateDown()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

aI.upLeftCorner = function(){
  var atLeastOneCanMove = true;

  while(atLeastOneCanMove){
    while(Handlers.consolidateLeft() && Handlers.consolidateUp()){}
    Handlers.consolidateDown();
    while(Handlers.consolidateLeft() && Handlers.consolidateUp()){}
    if(!Handlers.consolidateDown() && !Handlers.consolidateRight()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

aI.upRightCorner = function(){
  var atLeastOneCanMove = true;

  while(atLeastOneCanMove){
    while(Handlers.consolidateRight() && Handlers.consolidateUp()){}
    Handlers.consolidateDown();
    while(Handlers.consolidateRight() && Handlers.consolidateUp()){}
    if(!Handlers.consolidateLeft() && !Handlers.consolidateDown() && !Handlers.consolidateRight() && !Handlers.consolidateUp()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

module.exports = aI;
