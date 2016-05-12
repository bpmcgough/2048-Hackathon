(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./game.js":4,"./helperFunk.js":5,"./keyDownHandlers.js":6}],2:[function(require,module,exports){
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

},{"./game.js":4,"./helperFunk.js":5,"./keyDownHandlers.js":6}],3:[function(require,module,exports){
var aI = {};

aI.allDirectionsStrategyLeft = function(){
  var atLeastOneCanMove = true;
  while(atLeastOneCanMove){
    if(!Handlers.consolidateLeft() && !Handlers.consolidateDown() && !Handlers.consolidateRight() && !Handlers.consolidateUp()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

aI.allDirectionsStrategyRight = function(){
  var atLeastOneCanMove = true;
  while(atLeastOneCanMove){
    if(!Handlers.consolidateRight() && !Handlers.consolidateUp() && !Handlers.consolidateLeft() && !Handlers.consolidateDown()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

aI.allDirectionsStrategyUp = function(){
  var atLeastOneCanMove = true;
  while(atLeastOneCanMove){
    if(!Handlers.consolidateUp() && !Handlers.consolidateLeft() && !Handlers.consolidateDown() && !Handlers.consolidateRight()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

aI.allDirectionsStrategyDown = function(){
  var atLeastOneCanMove = true;
  while(atLeastOneCanMove){
    if(!Handlers.consolidateLeft() && !Handlers.consolidateDown() && !Handlers.consolidateRight() && !Handlers.consolidateUp()){
      atLeastOneCanMove = false;
    }
  }
  return helpers.score;
};

module.exports = aI;

},{}],4:[function(require,module,exports){
// browserify game.js -o browserifiedGame.js -d

var Handlers = require('./keyDownHandlers.js');
var aI = require('./AI.js');
var aIcorners = require('./AICorners.js');
var aIdirections = require('./AIallDirections.js');
var helpers = require('./helperFunk.js');

var gameTable;

var game = {
  width: 4,
  height: 4,

  createAndShowBoard: function () {
    var notThat = this;
    gameTable = document.createElement("tbody");

    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td class='empty' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    gameTable.innerHTML = tablehtml;

    var board = document.getElementById('board');
    board.appendChild(gameTable);

    helpers.addRandomTwoOrFour();
    helpers.addRandomTwoOrFour();

    document.onkeydown = function(event){
      if(event.keyCode === 37){ // key left
        Handlers.consolidateLeft();
      } else if(event.keyCode === 38){ // key up
        Handlers.consolidateUp();
      } else if(event.keyCode === 39){ // key right
        Handlers.consolidateRight();
      } else if(event.keyCode === 40){ // key down
        Handlers.consolidateDown();
      }
    };

    document.getElementById('start-ai').onclick = function(){
      aI.mainStrategy();
      // console.log('score: ', helpers.score);
      // game.metaCompareStrategies();
    };

    document.getElementById('reset-board').onclick = function(){
      game.resetBoard();
    };
  },

  resetBoard: function(){
    helpers.score = 0;
    var board = document.getElementById('board');
    board.removeChild(gameTable);
    game.createAndShowBoard();
  },

  metaCompareStrategies: function(){
    var iterations = 0;
    var metaScoresObj = {
      downRight: 0,
      downLeft: 0,
      upRight: 0,
      upLeft: 0
    };

    while(iterations < 100){
      var scoresObj = game.compareStrategies();
      metaScoresObj.downRight += scoresObj.downRight;
      metaScoresObj.downLeft += scoresObj.downLeft;
      metaScoresObj.upRight += scoresObj.upRight;
      metaScoresObj.upLeft += scoresObj.upLeft;
      iterations++;
    }

    metaScoresObj.downLeftAverage = metaScoresObj.downLeft / 20;
    metaScoresObj.downRightAverage = metaScoresObj.downRight / 20;
    metaScoresObj.upLeftAverage = metaScoresObj.upLeft / 20;
    metaScoresObj.upRightAverage = metaScoresObj.upRight / 20;

    console.log('here be the metascores:', metaScoresObj);
  },

  compareStrategies: function(){
    var scoresObj = {};

    var findDRScore = function(){
      return aIcorners.downRightCorner();
      // return aI
    };

    var findDLScore = function(){
      game.resetBoard();
      return aIcorners.downLeftCorner();
    };

    var findURScore = function(){
      game.resetBoard();
      return aIcorners.upRightCorner();
    };

    var findULScore = function(){
      game.resetBoard();
      return aIcorners.upLeftCorner();
    };

    scoresObj.downRight = findDRScore();
    scoresObj.downLeft = findDLScore();
    scoresObj.upRight = findURScore();
    scoresObj.upLeft = findULScore();

    console.log('here be the scores', scoresObj);

    return scoresObj;
  }
};

game.createAndShowBoard();

},{"./AI.js":1,"./AICorners.js":2,"./AIallDirections.js":3,"./helperFunk.js":5,"./keyDownHandlers.js":6}],5:[function(require,module,exports){
var handlers = require('./keyDownHandlers.js');
var game = require('./game.js');
var helpers = {};

helpers.score = 0;

helpers.heyThisCanCombineWhatShouldItBe = function(number) {
  if (number === 'two') {
    helpers.score += 4;
    return 'four';
  } else if (number === 'four') {
    helpers.score += 8;
    return 'eight';
  } else if (number === 'eight') {
    helpers.score += 16;
    return 'sixteen';
  } else if (number === 'sixteen') {
    helpers.score += 32;
    return 'thirty-two';
  } else if (number === 'thirty-two') {
    helpers.score += 64;
    return 'sixty-four';
  } else if (number === 'sixty-four') {
    helpers.score += 128;
    return 'one-hundred';
  } else if (number === 'one-hundred') {
    helpers.score += 256;
    return 'two-hundred';
  } else if (number === 'two-hundred') {
    helpers.score += 512;
    return 'five-hundred';
  } else if (number === 'five-hundred') {
    helpers.score += 1024;
    return 'one-thousand';
  } else if (number === 'one-thousand') {
    helpers.score += 2048;
    return 'two-thousand';
  } else if (number === 'two-thousand') {
    helpers.score += 4096;
    return 'four-thousand';
  }
};

helpers.addRandomTwoOrFour = function() {
  var twoOrFour;
  if (Math.random() < .8) {
    twoOrFour = ['two', 2];
  } else {
    twoOrFour = ['four', 4];
  }
  var randomX = Math.floor(Math.random() * (4));
  var randomY = Math.floor(Math.random() * (4));
  while (document.getElementById(randomX + '-' + randomY).className !== 'empty') {
    randomX = Math.floor(Math.random() * (4));
    randomY = Math.floor(Math.random() * (4));
  }
  document.getElementById(randomX + '-' + randomY).className = twoOrFour[0];
  document.getElementById(randomX + '-' + randomY).innerHTML = twoOrFour[1];
};

helpers.addBox = function(coordArray, valueArray){
  document.getElementById(coordArray[0]+ '-' + coordArray[1]).className = value[0];
  document.getElementById(coordArray[0]+ '-' + coordArray[1]).innerHTML = value[1];
};

module.exports = helpers;

},{"./game.js":4,"./keyDownHandlers.js":6}],6:[function(require,module,exports){
var helpers = require('./helperFunk.js');

var handlers = {};

var setClassAndHTML = function(receivingBox, givingBox){
  receivingBox.className = givingBox.className;
  receivingBox.innerHTML = givingBox.innerHTML;
  givingBox.className = 'empty';
  givingBox.innerHTML = '';
  return true;
};

var combineSetClassAndHTML = function(receivingBox, givingBox){
  receivingBox.className = helpers.heyThisCanCombineWhatShouldItBe(givingBox.className);
  receivingBox.innerHTML = (Number(givingBox.innerHTML) * 2);
  givingBox.className = 'empty';
  givingBox.innerHTML = '';
  return true;
};

handlers.consolidateLeft = function() {
  var somethingMoved = false;
  for (var x = 1; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
      var selectedElement = document.getElementById(x + '-' + y);
      var nextElementCoord = x - 1;
      if (selectedElement.className !== 'empty') {
        if (document.getElementById(nextElementCoord + '-' + y).className === 'empty') {
          if (nextElementCoord === 0) {
            somethingMoved = setClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
          } else {
            while (nextElementCoord > 0 && document.getElementById(nextElementCoord + '-' + y).className === 'empty') {
              nextElementCoord--;
            }
            if (document.getElementById(nextElementCoord + '-' + y).className === selectedElement.className) { // if the next one isnt empty
              somethingMoved = combineSetClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
            } else if(nextElementCoord === 0){
              if(document.getElementById(nextElementCoord + '-' + y).className === 'empty'){
                somethingMoved = setClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
              }
              else {
                somethingMoved = setClassAndHTML(document.getElementById((nextElementCoord + 1) + '-' + y), selectedElement);
              }
            } else {
              somethingMoved = setClassAndHTML(document.getElementById((nextElementCoord + 1) + '-' + y), selectedElement);
            }
          }
        } else {
          if (document.getElementById(nextElementCoord + '-' + y).className === selectedElement.className) { // if i can combine with the next one
            somethingMoved = combineSetClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
          } else if (nextElementCoord === 0 && document.getElementById(nextElementCoord + '-' + y).className === 'empty') { // if we get to the end and its empty...
            somethingMoved = setClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
          }
        }
      }
    }
  }
  if(somethingMoved) helpers.addRandomTwoOrFour();
  return somethingMoved;
};

handlers.consolidateRight = function() {
  var somethingMoved = false;
  for (var x = 2; x >= 0; x--) {
    for (var y = 0; y < 4; y++) {
      var selectedElement = document.getElementById(x + '-' + y);
      var nextElementCoord = x + 1;
      if (selectedElement.className !== 'empty') {
        if (document.getElementById(nextElementCoord + '-' + y).className === 'empty') {
          if (nextElementCoord === 3) {
            somethingMoved = setClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
          } else {
            while (nextElementCoord < 3 && document.getElementById(nextElementCoord + '-' + y).className === 'empty') {
              nextElementCoord++;
            }
            if (document.getElementById(nextElementCoord + '-' + y).className === selectedElement.className) {
              somethingMoved = combineSetClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
            } else if(nextElementCoord === 3){
              if(document.getElementById(nextElementCoord + '-' + y).className === 'empty'){
                somethingMoved = setClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
              }
              else {
                somethingMoved = setClassAndHTML(document.getElementById((nextElementCoord - 1) + '-' + y), selectedElement);
              }
            }
            else {
              somethingMoved = setClassAndHTML(document.getElementById((nextElementCoord - 1) + '-' + y), selectedElement);
            }
          }
        } else {
          if (document.getElementById(nextElementCoord + '-' + y).className === selectedElement.className) {
            somethingMoved = combineSetClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
          } else if (nextElementCoord === 3 && document.getElementById(nextElementCoord + '-' + y).className === 'empty') {
            somethingMoved = setClassAndHTML(document.getElementById(nextElementCoord + '-' + y), selectedElement);
          }
        }
      }
    }
  }
  if(somethingMoved) helpers.addRandomTwoOrFour();
  return somethingMoved;
};

handlers.consolidateUp = function() {
  var somethingMoved = false;
  for (var x = 0; x < 4; x++) {
    for (var y = 1; y < 4; y++) {
      var selectedElement = document.getElementById(x + '-' + y);
      var nextElementCoord = y - 1;
      if (selectedElement.className !== 'empty') {
        if (document.getElementById(x + '-' + nextElementCoord).className === 'empty') {
          if (nextElementCoord === 0) {
            somethingMoved = setClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
          } else {
            while (nextElementCoord > 0 && document.getElementById(x + '-' + nextElementCoord).className === 'empty') {
              nextElementCoord--;
            }
            if (document.getElementById(x + '-' + nextElementCoord).className === selectedElement.className) {
              somethingMoved = combineSetClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
            } else if(nextElementCoord === 0){
              if(document.getElementById(x + '-' + nextElementCoord).className === 'empty'){
                somethingMoved = setClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
              }
              else {
                somethingMoved = setClassAndHTML(document.getElementById(x + '-' + (nextElementCoord + 1)), selectedElement);
              }
            } else {
              somethingMoved = setClassAndHTML(document.getElementById(x + '-' + (nextElementCoord + 1)), selectedElement);
            }
          }
        } else {
          if (document.getElementById(x + '-' + nextElementCoord).className === selectedElement.className) {
            somethingMoved = combineSetClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
          } else if (nextElementCoord === 0 && document.getElementById(x + '-' + nextElementCoord).className === 'empty') {
            somethingMoved = setClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
          }
        }
      }
    }
  }
  if(somethingMoved) helpers.addRandomTwoOrFour();
  return somethingMoved;
};

handlers.consolidateDown = function() {
  var somethingMoved = false;
  for (var x = 0; x < 4; x++) {
    for (var y = 2; y >= 0; y--) {
      var selectedElement = document.getElementById(x + '-' + y);
      var nextElementCoord = y + 1;
      if (selectedElement.className !== 'empty') {
        if (document.getElementById(x + '-' + nextElementCoord).className === 'empty') {
          if (nextElementCoord === 3) {
            somethingMoved = setClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
          } else {
            while (nextElementCoord < 3 && document.getElementById(x + '-' + nextElementCoord).className === 'empty') {
              nextElementCoord++;
            }
            if (document.getElementById(x + '-' + nextElementCoord).className === selectedElement.className) {
              somethingMoved = combineSetClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
            } else if(nextElementCoord === 3){
              if(document.getElementById(x + '-' + nextElementCoord).className === 'empty'){
                somethingMoved = setClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
              } else {
                somethingMoved = setClassAndHTML(document.getElementById(x + '-' + (nextElementCoord - 1)), selectedElement);
              } // this is what i need to add to all directions
              // i think i dont need one of these else statements...
            } else {
              somethingMoved = setClassAndHTML(document.getElementById(x + '-' + (nextElementCoord - 1)), selectedElement);
            }
          }
        } else {
          if (document.getElementById(x + '-' + nextElementCoord).className === selectedElement.className) {
            somethingMoved = combineSetClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
          } else if (nextElementCoord === 3 && document.getElementById(x + '-' + nextElementCoord).className === 'empty') {
            somethingMoved = setClassAndHTML(document.getElementById(x + '-' + nextElementCoord), selectedElement);
          }
        }
      }
    }
  }
  if(somethingMoved) helpers.addRandomTwoOrFour();
  return somethingMoved;
};

module.exports = handlers;

},{"./helperFunk.js":5}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIkFJLmpzIiwiQUlDb3JuZXJzLmpzIiwiQUlhbGxEaXJlY3Rpb25zLmpzIiwiZ2FtZS5qcyIsImhlbHBlckZ1bmsuanMiLCJrZXlEb3duSGFuZGxlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEhhbmRsZXJzID0gcmVxdWlyZSgnLi9rZXlEb3duSGFuZGxlcnMuanMnKTtcbnZhciBnYW1lID0gcmVxdWlyZSgnLi9nYW1lLmpzJyk7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVyRnVuay5qcycpO1xuXG52YXIgYUkgPSB7fTtcblxudmFyIHBlZWtBaGVhZCA9IGZ1bmN0aW9uKCl7XG5cbn07XG5cbnZhciBtYWtlUmFuZG9tTW92ZSA9IGZ1bmN0aW9uKCl7XG4gIHZhciBudW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNCkpO1xuICBpZihudW0gPT09IDEpIEhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpO1xuICBlbHNlIGlmKG51bSA9PT0gMikgSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpO1xuICBlbHNlIGlmKG51bSA9PT0gMykgSGFuZGxlcnMuY29uc29saWRhdGVVcCgpO1xuICBlbHNlIGlmKG51bSA9PT0gNCkgSGFuZGxlcnMuY29uc29saWRhdGVEb3duKCk7XG59O1xuXG52YXIgcGVla1N0cmF0ZWd5ID0gZnVuY3Rpb24oZGlyZWN0aW9uKXtcbiAgLy8gaSB3YW50IHRvIG1ha2UgbGlrZSBhIHZpcnR1YWwgYm9hcmQgdGhhdCBpIGNhbiBydW4gdGVzdHMgb24gYnV0IHdvbnQgZGlzcGxheVxuICAvLyBvciB0aGUgYWJpbGl0eSB0byByZXZlcnNlXG4gIC8vIG1ha2UgYSAnaGlzdG9yeSBvZiBtb3ZlcydcbiAgdmFyIG1vdmVIaXN0b3J5ID0gW107XG59O1xuXG52YXIgbW92ZVRvU2NvcmUgPSBmdW5jdGlvbigpe1xuICB2YXIgcG9zc2libGVTdGFydGluZ01vdmVzID0gW107XG59O1xuXG52YXIgZW1wdHlTcGFjZUNoZWNrID0gZnVuY3Rpb24oYm94MSwgYm94MiwgZGlyZWN0aW9uKXtcbiAgdmFyIHNwYWNlSXNFbXB0eSA9IHRydWU7XG4gIHZhciBib3gxWCA9IGJveDEuaWRbMF07XG4gIHZhciBib3gxWSA9IGJveDEuaWRbMl07XG4gIHZhciBib3gyWCA9IGJveDIuaWRbMF07XG4gIHZhciBib3gyWSA9IGJveDIuaWRbMl07XG4gIGlmKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKXtcbiAgICBmb3IodmFyIGkgPSBib3gxWDsgaSA8IGJveDJYOyBpKyspe1xuICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaSArICctJyArIGJveDFZKS5jbGFzc05hbWUgIT09ICdlbXB0eScpe1xuICAgICAgICBzcGFjZUlzRW1wdHkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZihkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpe1xuICAgIGZvcih2YXIgaiA9IGJveDFZOyBqIDwgYm94Mlk7IGorKyl7XG4gICAgICBpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChib3gxWCArICctJyArIGopLmNsYXNzTmFtZSAhPT0gJ2VtcHR5Jyl7XG4gICAgICAgIHNwYWNlSXNFbXB0eSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3BhY2VJc0VtcHR5O1xufTtcblxudmFyIGNhbklDb21iaW5lSG9yaXpvbnRhbCA9IGZ1bmN0aW9uKCl7XG4gIC8vIGlmIHRoZXJlIGFyZSB0d28gYm94ZXMgb2Ygc2ltaWxhciB2YWx1ZSB3aXRob3V0IGFueXRoaW5nIGJldHdlZW4sIGNvbnNvbGlkYXRlIGluIHRoYXQgZGlyZWN0aW9uXG4gIC8vIG1heWJlIGluc3RlYWQgb2YgaGF2aW5nIHRvIGxvb3AsIGkgY2FuIGp1c3QgaGF2ZSBsaWtlIGFuIGFycmF5IG9mIGFsbCB0aGUgb2NjdXBpZWQgYm94ZXNcbiAgLy8gYW5kIGxvb3AgdGhyb3VnaCB0aG9zZVxuICB2YXIgZXhlY3V0ZU1vdmUgPSBmYWxzZTtcbiAgZm9yKHZhciB4ID0gMDsgeCA8IDQ7IHgrKyl7XG4gICAgZm9yKHZhciB5ID0gMDsgeSA8IDQ7IHkrKyl7XG4gICAgICBmb3IodmFyIHh4ID0geCArIDE7IHh4IDwgNDsgeHgrKyl7XG4gICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyB5KS5jbGFzc05hbWUgPT09IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHh4ICsgJy0nICsgeSkuY2xhc3NOYW1lKXsgLy8gaWYgdHdvIGJveGVzIGluIGEgcm93IGhhdmUgdGhlIHNhbWUgdmFsdWVcbiAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSdzIGFueXRoaW5nIGJldHdlZW4gdGhlbVxuICAgICAgICAgIGlmKHh4IC0geCA9PT0gMCl7IC8vIGlmIHRoZXlyZSBuZXh0IHRvIGVhY2ggb3RoZXJcbiAgICAgICAgICAgIGV4ZWN1dGVNb3ZlID0gMTtcbiAgICAgICAgICB9IGVsc2UgaWYoZW1wdHlTcGFjZUNoZWNrKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyB5KSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeHggKyAnLScgKyB5KSwgJ2hvcml6b250YWwnKSl7IC8vIGlmIHRoZXJlcyBub3RoaW5nIGJldHdlZW4gdGhlbVxuICAgICAgICAgICAgZXhlY3V0ZU1vdmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZXhlY3V0ZU1vdmU7XG59O1xuXG52YXIgY2FuSUNvbWJpbmVWZXJ0aWNhbCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBleGVjdXRlTW92ZSA9IGZhbHNlO1xuICBmb3IodmFyIHggPSAwOyB4IDwgNDsgeCsrKXtcbiAgICBmb3IodmFyIHkgPSAwOyB5IDwgNDsgeSsrKXtcbiAgICAgIGZvcih2YXIgeXkgPSB5ICsgMTsgeXkgPCA0OyB5eSsrKXtcbiAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIHkpLmNsYXNzTmFtZSA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIHl5KS5jbGFzc05hbWUpeyAvLyBpZiB0d28gYm94ZXMgaW4gYSByb3cgaGF2ZSB0aGUgc2FtZSB2YWx1ZVxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0d28gYm94ZXMgaW4gYSBjb2x1bW4gY2FuIGNvbWJpbmUnLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgeSkuY2xhc3NOYW1lLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgeXkpKVxuICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlJ3MgYW55dGhpbmcgYmV0d2VlbiB0aGVtXG4gICAgICAgICAgaWYoeXkgLSB5ID09PSAxKXsgLy8gaWYgdGhleXJlIG5leHQgdG8gZWFjaCBvdGhlclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ25leHQgdG8gZWFjaCBvdGhlciB2ZXJ0aWNhbCcpXG4gICAgICAgICAgICBleGVjdXRlTW92ZSA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmKGVtcHR5U3BhY2VDaGVjayhkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgeSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyB5eSksICd2ZXJ0aWNhbCcpKXsgLy8gaWYgdGhlcmVzIG5vdGhpbmcgYmV0d2VlbiB0aGVtXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbG9va2luZyBmb3IgZW1wdHkgc3BhY2UnKVxuICAgICAgICAgICAgZXhlY3V0ZU1vdmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZXhlY3V0ZU1vdmU7XG59O1xuXG5hSS5tYWluU3RyYXRlZ3kgPSBmdW5jdGlvbigpe1xuICB2YXIgY2FuTW92ZSA9IHRydWU7XG4gIHdoaWxlKGNhbk1vdmUpe1xuICAgIHZhciBnb0hvcml6b250YWwgPSBjYW5JQ29tYmluZUhvcml6b250YWwoKTtcbiAgICB2YXIgZ29WZXJ0aWNhbCA9IGNhbklDb21iaW5lVmVydGljYWwoKTtcbiAgICBpZihnb0hvcml6b250YWwgJiYgZ29WZXJ0aWNhbCl7XG4gICAgICBjb25zb2xlLmxvZygnZ28gYm90aCcpXG4gICAgICBpZighSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpKXtcbiAgICAgICAgaWYoIUhhbmRsZXJzLmNvbnNvbGlkYXRlVXAoKSl7XG4gICAgICAgICAgaWYoIUhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpKSBIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZihnb0hvcml6b250YWwpe1xuICAgICAgY29uc29sZS5sb2coJ2dvIGhvcml6b250YWwnKVxuICAgICAgaWYoIUhhbmRsZXJzLmNvbnNvbGlkYXRlUmlnaHQoKSkgSGFuZGxlcnMuY29uc29saWRhdGVMZWZ0KCk7XG4gICAgfSBlbHNlIGlmKGdvVmVydGljYWwpe1xuICAgICAgY29uc29sZS5sb2coJ2dvIHZlcnRpY2FsJylcbiAgICAgIGlmKCFIYW5kbGVycy5jb25zb2xpZGF0ZVVwKCkpIEhhbmRsZXJzLmNvbnNvbGlkYXRlRG93bigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnY2FudCBjb25zb2xpZGF0ZScpXG4gICAgICBpZighSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZVVwKCkgJiYgIUhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjYW50IG1vdmUnKVxuICAgICAgICBjYW5Nb3ZlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdzY29yZTonLCBoZWxwZXJzLnNjb3JlKTtcbiAgfVxuICAvLyB0b3AgcmlnaHQgY29ybmVyIGlzIGZhdm9yZWRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYUk7XG4iLCJ2YXIgSGFuZGxlcnMgPSByZXF1aXJlKCcuL2tleURvd25IYW5kbGVycy5qcycpO1xudmFyIGdhbWUgPSByZXF1aXJlKCcuL2dhbWUuanMnKTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJGdW5rLmpzJyk7XG5cbnZhciBhSSA9IHt9O1xuXG5hSS5kb3duTGVmdENvcm5lciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBhdExlYXN0T25lQ2FuTW92ZSA9IHRydWU7XG5cbiAgd2hpbGUoYXRMZWFzdE9uZUNhbk1vdmUpe1xuICAgIHdoaWxlKEhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmIEhhbmRsZXJzLmNvbnNvbGlkYXRlRG93bigpKXt9XG4gICAgSGFuZGxlcnMuY29uc29saWRhdGVVcCgpO1xuICAgIHdoaWxlKEhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmIEhhbmRsZXJzLmNvbnNvbGlkYXRlRG93bigpKXt9XG4gICAgaWYoIUhhbmRsZXJzLmNvbnNvbGlkYXRlUmlnaHQoKSAmJiAhSGFuZGxlcnMuY29uc29saWRhdGVVcCgpKXtcbiAgICAgIGF0TGVhc3RPbmVDYW5Nb3ZlID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBoZWxwZXJzLnNjb3JlO1xufTtcblxuYUkuZG93blJpZ2h0Q29ybmVyID0gZnVuY3Rpb24oKXtcbiAgdmFyIGF0TGVhc3RPbmVDYW5Nb3ZlID0gdHJ1ZSwgY2FuTW92ZVJpZ2h0RG93blVwID0gdHJ1ZTtcblxuICB3aGlsZShhdExlYXN0T25lQ2FuTW92ZSl7XG4gICAgd2hpbGUoY2FuTW92ZVJpZ2h0RG93blVwKXtcbiAgICAgIHdoaWxlKEhhbmRsZXJzLmNvbnNvbGlkYXRlUmlnaHQoKSAmJiBIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSl7fVxuICAgICAgSGFuZGxlcnMuY29uc29saWRhdGVVcCgpO1xuICAgICAgaWYoIUhhbmRsZXJzLmNvbnNvbGlkYXRlUmlnaHQoKSAmJiAhSGFuZGxlcnMuY29uc29saWRhdGVEb3duKCkgJiYgIUhhbmRsZXJzLmNvbnNvbGlkYXRlVXAoKSl7XG4gICAgICAgIGNhbk1vdmVSaWdodERvd25VcCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZighSGFuZGxlcnMuY29uc29saWRhdGVMZWZ0KCkgJiYgIUhhbmRsZXJzLmNvbnNvbGlkYXRlVXAoKSAmJiAhSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSl7XG4gICAgICBhdExlYXN0T25lQ2FuTW92ZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaGVscGVycy5zY29yZTtcbn07XG5cbmFJLnVwTGVmdENvcm5lciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBhdExlYXN0T25lQ2FuTW92ZSA9IHRydWU7XG5cbiAgd2hpbGUoYXRMZWFzdE9uZUNhbk1vdmUpe1xuICAgIHdoaWxlKEhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmIEhhbmRsZXJzLmNvbnNvbGlkYXRlVXAoKSl7fVxuICAgIEhhbmRsZXJzLmNvbnNvbGlkYXRlRG93bigpO1xuICAgIHdoaWxlKEhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmIEhhbmRsZXJzLmNvbnNvbGlkYXRlVXAoKSl7fVxuICAgIGlmKCFIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSAmJiAhSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpKXtcbiAgICAgIGF0TGVhc3RPbmVDYW5Nb3ZlID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBoZWxwZXJzLnNjb3JlO1xufTtcblxuYUkudXBSaWdodENvcm5lciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBhdExlYXN0T25lQ2FuTW92ZSA9IHRydWU7XG5cbiAgd2hpbGUoYXRMZWFzdE9uZUNhbk1vdmUpe1xuICAgIHdoaWxlKEhhbmRsZXJzLmNvbnNvbGlkYXRlUmlnaHQoKSAmJiBIYW5kbGVycy5jb25zb2xpZGF0ZVVwKCkpe31cbiAgICBIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKTtcbiAgICB3aGlsZShIYW5kbGVycy5jb25zb2xpZGF0ZVJpZ2h0KCkgJiYgSGFuZGxlcnMuY29uc29saWRhdGVVcCgpKXt9XG4gICAgaWYoIUhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSAmJiAhSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZVVwKCkpe1xuICAgICAgYXRMZWFzdE9uZUNhbk1vdmUgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhlbHBlcnMuc2NvcmU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFJO1xuIiwidmFyIGFJID0ge307XG5cbmFJLmFsbERpcmVjdGlvbnNTdHJhdGVneUxlZnQgPSBmdW5jdGlvbigpe1xuICB2YXIgYXRMZWFzdE9uZUNhbk1vdmUgPSB0cnVlO1xuICB3aGlsZShhdExlYXN0T25lQ2FuTW92ZSl7XG4gICAgaWYoIUhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSAmJiAhSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZVVwKCkpe1xuICAgICAgYXRMZWFzdE9uZUNhbk1vdmUgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhlbHBlcnMuc2NvcmU7XG59O1xuXG5hSS5hbGxEaXJlY3Rpb25zU3RyYXRlZ3lSaWdodCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBhdExlYXN0T25lQ2FuTW92ZSA9IHRydWU7XG4gIHdoaWxlKGF0TGVhc3RPbmVDYW5Nb3ZlKXtcbiAgICBpZighSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZVVwKCkgJiYgIUhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSl7XG4gICAgICBhdExlYXN0T25lQ2FuTW92ZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaGVscGVycy5zY29yZTtcbn07XG5cbmFJLmFsbERpcmVjdGlvbnNTdHJhdGVneVVwID0gZnVuY3Rpb24oKXtcbiAgdmFyIGF0TGVhc3RPbmVDYW5Nb3ZlID0gdHJ1ZTtcbiAgd2hpbGUoYXRMZWFzdE9uZUNhbk1vdmUpe1xuICAgIGlmKCFIYW5kbGVycy5jb25zb2xpZGF0ZVVwKCkgJiYgIUhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKSAmJiAhSGFuZGxlcnMuY29uc29saWRhdGVSaWdodCgpKXtcbiAgICAgIGF0TGVhc3RPbmVDYW5Nb3ZlID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBoZWxwZXJzLnNjb3JlO1xufTtcblxuYUkuYWxsRGlyZWN0aW9uc1N0cmF0ZWd5RG93biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBhdExlYXN0T25lQ2FuTW92ZSA9IHRydWU7XG4gIHdoaWxlKGF0TGVhc3RPbmVDYW5Nb3ZlKXtcbiAgICBpZighSGFuZGxlcnMuY29uc29saWRhdGVMZWZ0KCkgJiYgIUhhbmRsZXJzLmNvbnNvbGlkYXRlRG93bigpICYmICFIYW5kbGVycy5jb25zb2xpZGF0ZVJpZ2h0KCkgJiYgIUhhbmRsZXJzLmNvbnNvbGlkYXRlVXAoKSl7XG4gICAgICBhdExlYXN0T25lQ2FuTW92ZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaGVscGVycy5zY29yZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYUk7XG4iLCIvLyBicm93c2VyaWZ5IGdhbWUuanMgLW8gYnJvd3NlcmlmaWVkR2FtZS5qcyAtZFxuXG52YXIgSGFuZGxlcnMgPSByZXF1aXJlKCcuL2tleURvd25IYW5kbGVycy5qcycpO1xudmFyIGFJID0gcmVxdWlyZSgnLi9BSS5qcycpO1xudmFyIGFJY29ybmVycyA9IHJlcXVpcmUoJy4vQUlDb3JuZXJzLmpzJyk7XG52YXIgYUlkaXJlY3Rpb25zID0gcmVxdWlyZSgnLi9BSWFsbERpcmVjdGlvbnMuanMnKTtcbnZhciBoZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJGdW5rLmpzJyk7XG5cbnZhciBnYW1lVGFibGU7XG5cbnZhciBnYW1lID0ge1xuICB3aWR0aDogNCxcbiAgaGVpZ2h0OiA0LFxuXG4gIGNyZWF0ZUFuZFNob3dCb2FyZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBub3RUaGF0ID0gdGhpcztcbiAgICBnYW1lVGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGJvZHlcIik7XG5cbiAgICB2YXIgdGFibGVodG1sID0gJyc7XG4gICAgZm9yICh2YXIgaD0wOyBoPHRoaXMuaGVpZ2h0OyBoKyspIHtcbiAgICAgIHRhYmxlaHRtbCArPSBcIjx0ciBpZD0ncm93K1wiICsgaCArIFwiJz5cIjtcbiAgICAgIGZvciAodmFyIHc9MDsgdzx0aGlzLndpZHRoOyB3KyspIHtcbiAgICAgICAgdGFibGVodG1sICs9IFwiPHRkIGNsYXNzPSdlbXB0eScgaWQ9J1wiICsgdyArIFwiLVwiICsgaCArIFwiJz48L3RkPlwiO1xuICAgICAgfVxuICAgICAgdGFibGVodG1sICs9IFwiPC90cj5cIjtcbiAgICB9XG4gICAgZ2FtZVRhYmxlLmlubmVySFRNTCA9IHRhYmxlaHRtbDtcblxuICAgIHZhciBib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib2FyZCcpO1xuICAgIGJvYXJkLmFwcGVuZENoaWxkKGdhbWVUYWJsZSk7XG5cbiAgICBoZWxwZXJzLmFkZFJhbmRvbVR3b09yRm91cigpO1xuICAgIGhlbHBlcnMuYWRkUmFuZG9tVHdvT3JGb3VyKCk7XG5cbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbihldmVudCl7XG4gICAgICBpZihldmVudC5rZXlDb2RlID09PSAzNyl7IC8vIGtleSBsZWZ0XG4gICAgICAgIEhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCgpO1xuICAgICAgfSBlbHNlIGlmKGV2ZW50LmtleUNvZGUgPT09IDM4KXsgLy8ga2V5IHVwXG4gICAgICAgIEhhbmRsZXJzLmNvbnNvbGlkYXRlVXAoKTtcbiAgICAgIH0gZWxzZSBpZihldmVudC5rZXlDb2RlID09PSAzOSl7IC8vIGtleSByaWdodFxuICAgICAgICBIYW5kbGVycy5jb25zb2xpZGF0ZVJpZ2h0KCk7XG4gICAgICB9IGVsc2UgaWYoZXZlbnQua2V5Q29kZSA9PT0gNDApeyAvLyBrZXkgZG93blxuICAgICAgICBIYW5kbGVycy5jb25zb2xpZGF0ZURvd24oKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0LWFpJykub25jbGljayA9IGZ1bmN0aW9uKCl7XG4gICAgICBhSS5tYWluU3RyYXRlZ3koKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzY29yZTogJywgaGVscGVycy5zY29yZSk7XG4gICAgICAvLyBnYW1lLm1ldGFDb21wYXJlU3RyYXRlZ2llcygpO1xuICAgIH07XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzZXQtYm9hcmQnKS5vbmNsaWNrID0gZnVuY3Rpb24oKXtcbiAgICAgIGdhbWUucmVzZXRCb2FyZCgpO1xuICAgIH07XG4gIH0sXG5cbiAgcmVzZXRCb2FyZDogZnVuY3Rpb24oKXtcbiAgICBoZWxwZXJzLnNjb3JlID0gMDtcbiAgICB2YXIgYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm9hcmQnKTtcbiAgICBib2FyZC5yZW1vdmVDaGlsZChnYW1lVGFibGUpO1xuICAgIGdhbWUuY3JlYXRlQW5kU2hvd0JvYXJkKCk7XG4gIH0sXG5cbiAgbWV0YUNvbXBhcmVTdHJhdGVnaWVzOiBmdW5jdGlvbigpe1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgbWV0YVNjb3Jlc09iaiA9IHtcbiAgICAgIGRvd25SaWdodDogMCxcbiAgICAgIGRvd25MZWZ0OiAwLFxuICAgICAgdXBSaWdodDogMCxcbiAgICAgIHVwTGVmdDogMFxuICAgIH07XG5cbiAgICB3aGlsZShpdGVyYXRpb25zIDwgMTAwKXtcbiAgICAgIHZhciBzY29yZXNPYmogPSBnYW1lLmNvbXBhcmVTdHJhdGVnaWVzKCk7XG4gICAgICBtZXRhU2NvcmVzT2JqLmRvd25SaWdodCArPSBzY29yZXNPYmouZG93blJpZ2h0O1xuICAgICAgbWV0YVNjb3Jlc09iai5kb3duTGVmdCArPSBzY29yZXNPYmouZG93bkxlZnQ7XG4gICAgICBtZXRhU2NvcmVzT2JqLnVwUmlnaHQgKz0gc2NvcmVzT2JqLnVwUmlnaHQ7XG4gICAgICBtZXRhU2NvcmVzT2JqLnVwTGVmdCArPSBzY29yZXNPYmoudXBMZWZ0O1xuICAgICAgaXRlcmF0aW9ucysrO1xuICAgIH1cblxuICAgIG1ldGFTY29yZXNPYmouZG93bkxlZnRBdmVyYWdlID0gbWV0YVNjb3Jlc09iai5kb3duTGVmdCAvIDIwO1xuICAgIG1ldGFTY29yZXNPYmouZG93blJpZ2h0QXZlcmFnZSA9IG1ldGFTY29yZXNPYmouZG93blJpZ2h0IC8gMjA7XG4gICAgbWV0YVNjb3Jlc09iai51cExlZnRBdmVyYWdlID0gbWV0YVNjb3Jlc09iai51cExlZnQgLyAyMDtcbiAgICBtZXRhU2NvcmVzT2JqLnVwUmlnaHRBdmVyYWdlID0gbWV0YVNjb3Jlc09iai51cFJpZ2h0IC8gMjA7XG5cbiAgICBjb25zb2xlLmxvZygnaGVyZSBiZSB0aGUgbWV0YXNjb3JlczonLCBtZXRhU2NvcmVzT2JqKTtcbiAgfSxcblxuICBjb21wYXJlU3RyYXRlZ2llczogZnVuY3Rpb24oKXtcbiAgICB2YXIgc2NvcmVzT2JqID0ge307XG5cbiAgICB2YXIgZmluZERSU2NvcmUgPSBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGFJY29ybmVycy5kb3duUmlnaHRDb3JuZXIoKTtcbiAgICAgIC8vIHJldHVybiBhSVxuICAgIH07XG5cbiAgICB2YXIgZmluZERMU2NvcmUgPSBmdW5jdGlvbigpe1xuICAgICAgZ2FtZS5yZXNldEJvYXJkKCk7XG4gICAgICByZXR1cm4gYUljb3JuZXJzLmRvd25MZWZ0Q29ybmVyKCk7XG4gICAgfTtcblxuICAgIHZhciBmaW5kVVJTY29yZSA9IGZ1bmN0aW9uKCl7XG4gICAgICBnYW1lLnJlc2V0Qm9hcmQoKTtcbiAgICAgIHJldHVybiBhSWNvcm5lcnMudXBSaWdodENvcm5lcigpO1xuICAgIH07XG5cbiAgICB2YXIgZmluZFVMU2NvcmUgPSBmdW5jdGlvbigpe1xuICAgICAgZ2FtZS5yZXNldEJvYXJkKCk7XG4gICAgICByZXR1cm4gYUljb3JuZXJzLnVwTGVmdENvcm5lcigpO1xuICAgIH07XG5cbiAgICBzY29yZXNPYmouZG93blJpZ2h0ID0gZmluZERSU2NvcmUoKTtcbiAgICBzY29yZXNPYmouZG93bkxlZnQgPSBmaW5kRExTY29yZSgpO1xuICAgIHNjb3Jlc09iai51cFJpZ2h0ID0gZmluZFVSU2NvcmUoKTtcbiAgICBzY29yZXNPYmoudXBMZWZ0ID0gZmluZFVMU2NvcmUoKTtcblxuICAgIGNvbnNvbGUubG9nKCdoZXJlIGJlIHRoZSBzY29yZXMnLCBzY29yZXNPYmopO1xuXG4gICAgcmV0dXJuIHNjb3Jlc09iajtcbiAgfVxufTtcblxuZ2FtZS5jcmVhdGVBbmRTaG93Qm9hcmQoKTtcbiIsInZhciBoYW5kbGVycyA9IHJlcXVpcmUoJy4va2V5RG93bkhhbmRsZXJzLmpzJyk7XG52YXIgZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZS5qcycpO1xudmFyIGhlbHBlcnMgPSB7fTtcblxuaGVscGVycy5zY29yZSA9IDA7XG5cbmhlbHBlcnMuaGV5VGhpc0NhbkNvbWJpbmVXaGF0U2hvdWxkSXRCZSA9IGZ1bmN0aW9uKG51bWJlcikge1xuICBpZiAobnVtYmVyID09PSAndHdvJykge1xuICAgIGhlbHBlcnMuc2NvcmUgKz0gNDtcbiAgICByZXR1cm4gJ2ZvdXInO1xuICB9IGVsc2UgaWYgKG51bWJlciA9PT0gJ2ZvdXInKSB7XG4gICAgaGVscGVycy5zY29yZSArPSA4O1xuICAgIHJldHVybiAnZWlnaHQnO1xuICB9IGVsc2UgaWYgKG51bWJlciA9PT0gJ2VpZ2h0Jykge1xuICAgIGhlbHBlcnMuc2NvcmUgKz0gMTY7XG4gICAgcmV0dXJuICdzaXh0ZWVuJztcbiAgfSBlbHNlIGlmIChudW1iZXIgPT09ICdzaXh0ZWVuJykge1xuICAgIGhlbHBlcnMuc2NvcmUgKz0gMzI7XG4gICAgcmV0dXJuICd0aGlydHktdHdvJztcbiAgfSBlbHNlIGlmIChudW1iZXIgPT09ICd0aGlydHktdHdvJykge1xuICAgIGhlbHBlcnMuc2NvcmUgKz0gNjQ7XG4gICAgcmV0dXJuICdzaXh0eS1mb3VyJztcbiAgfSBlbHNlIGlmIChudW1iZXIgPT09ICdzaXh0eS1mb3VyJykge1xuICAgIGhlbHBlcnMuc2NvcmUgKz0gMTI4O1xuICAgIHJldHVybiAnb25lLWh1bmRyZWQnO1xuICB9IGVsc2UgaWYgKG51bWJlciA9PT0gJ29uZS1odW5kcmVkJykge1xuICAgIGhlbHBlcnMuc2NvcmUgKz0gMjU2O1xuICAgIHJldHVybiAndHdvLWh1bmRyZWQnO1xuICB9IGVsc2UgaWYgKG51bWJlciA9PT0gJ3R3by1odW5kcmVkJykge1xuICAgIGhlbHBlcnMuc2NvcmUgKz0gNTEyO1xuICAgIHJldHVybiAnZml2ZS1odW5kcmVkJztcbiAgfSBlbHNlIGlmIChudW1iZXIgPT09ICdmaXZlLWh1bmRyZWQnKSB7XG4gICAgaGVscGVycy5zY29yZSArPSAxMDI0O1xuICAgIHJldHVybiAnb25lLXRob3VzYW5kJztcbiAgfSBlbHNlIGlmIChudW1iZXIgPT09ICdvbmUtdGhvdXNhbmQnKSB7XG4gICAgaGVscGVycy5zY29yZSArPSAyMDQ4O1xuICAgIHJldHVybiAndHdvLXRob3VzYW5kJztcbiAgfSBlbHNlIGlmIChudW1iZXIgPT09ICd0d28tdGhvdXNhbmQnKSB7XG4gICAgaGVscGVycy5zY29yZSArPSA0MDk2O1xuICAgIHJldHVybiAnZm91ci10aG91c2FuZCc7XG4gIH1cbn07XG5cbmhlbHBlcnMuYWRkUmFuZG9tVHdvT3JGb3VyID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0d29PckZvdXI7XG4gIGlmIChNYXRoLnJhbmRvbSgpIDwgLjgpIHtcbiAgICB0d29PckZvdXIgPSBbJ3R3bycsIDJdO1xuICB9IGVsc2Uge1xuICAgIHR3b09yRm91ciA9IFsnZm91cicsIDRdO1xuICB9XG4gIHZhciByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDQpKTtcbiAgdmFyIHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNCkpO1xuICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmFuZG9tWCArICctJyArIHJhbmRvbVkpLmNsYXNzTmFtZSAhPT0gJ2VtcHR5Jykge1xuICAgIHJhbmRvbVggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNCkpO1xuICAgIHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNCkpO1xuICB9XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJhbmRvbVggKyAnLScgKyByYW5kb21ZKS5jbGFzc05hbWUgPSB0d29PckZvdXJbMF07XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJhbmRvbVggKyAnLScgKyByYW5kb21ZKS5pbm5lckhUTUwgPSB0d29PckZvdXJbMV07XG59O1xuXG5oZWxwZXJzLmFkZEJveCA9IGZ1bmN0aW9uKGNvb3JkQXJyYXksIHZhbHVlQXJyYXkpe1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb29yZEFycmF5WzBdKyAnLScgKyBjb29yZEFycmF5WzFdKS5jbGFzc05hbWUgPSB2YWx1ZVswXTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29vcmRBcnJheVswXSsgJy0nICsgY29vcmRBcnJheVsxXSkuaW5uZXJIVE1MID0gdmFsdWVbMV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhlbHBlcnM7XG4iLCJ2YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vaGVscGVyRnVuay5qcycpO1xuXG52YXIgaGFuZGxlcnMgPSB7fTtcblxudmFyIHNldENsYXNzQW5kSFRNTCA9IGZ1bmN0aW9uKHJlY2VpdmluZ0JveCwgZ2l2aW5nQm94KXtcbiAgcmVjZWl2aW5nQm94LmNsYXNzTmFtZSA9IGdpdmluZ0JveC5jbGFzc05hbWU7XG4gIHJlY2VpdmluZ0JveC5pbm5lckhUTUwgPSBnaXZpbmdCb3guaW5uZXJIVE1MO1xuICBnaXZpbmdCb3guY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgZ2l2aW5nQm94LmlubmVySFRNTCA9ICcnO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnZhciBjb21iaW5lU2V0Q2xhc3NBbmRIVE1MID0gZnVuY3Rpb24ocmVjZWl2aW5nQm94LCBnaXZpbmdCb3gpe1xuICByZWNlaXZpbmdCb3guY2xhc3NOYW1lID0gaGVscGVycy5oZXlUaGlzQ2FuQ29tYmluZVdoYXRTaG91bGRJdEJlKGdpdmluZ0JveC5jbGFzc05hbWUpO1xuICByZWNlaXZpbmdCb3guaW5uZXJIVE1MID0gKE51bWJlcihnaXZpbmdCb3guaW5uZXJIVE1MKSAqIDIpO1xuICBnaXZpbmdCb3guY2xhc3NOYW1lID0gJ2VtcHR5JztcbiAgZ2l2aW5nQm94LmlubmVySFRNTCA9ICcnO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmhhbmRsZXJzLmNvbnNvbGlkYXRlTGVmdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc29tZXRoaW5nTW92ZWQgPSBmYWxzZTtcbiAgZm9yICh2YXIgeCA9IDE7IHggPCA0OyB4KyspIHtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IDQ7IHkrKykge1xuICAgICAgdmFyIHNlbGVjdGVkRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyB5KTtcbiAgICAgIHZhciBuZXh0RWxlbWVudENvb3JkID0geCAtIDE7XG4gICAgICBpZiAoc2VsZWN0ZWRFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2VtcHR5Jykge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmV4dEVsZW1lbnRDb29yZCArICctJyArIHkpLmNsYXNzTmFtZSA9PT0gJ2VtcHR5Jykge1xuICAgICAgICAgIGlmIChuZXh0RWxlbWVudENvb3JkID09PSAwKSB7XG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0RWxlbWVudENvb3JkID4gMCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSkuY2xhc3NOYW1lID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgICAgIG5leHRFbGVtZW50Q29vcmQtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSkuY2xhc3NOYW1lID09PSBzZWxlY3RlZEVsZW1lbnQuY2xhc3NOYW1lKSB7IC8vIGlmIHRoZSBuZXh0IG9uZSBpc250IGVtcHR5XG4gICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gY29tYmluZVNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYobmV4dEVsZW1lbnRDb29yZCA9PT0gMCl7XG4gICAgICAgICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRFbGVtZW50Q29vcmQgKyAnLScgKyB5KS5jbGFzc05hbWUgPT09ICdlbXB0eScpe1xuICAgICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gc2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRFbGVtZW50Q29vcmQgKyAnLScgKyB5KSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgobmV4dEVsZW1lbnRDb29yZCArIDEpICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gc2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKChuZXh0RWxlbWVudENvb3JkICsgMSkgKyAnLScgKyB5KSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRFbGVtZW50Q29vcmQgKyAnLScgKyB5KS5jbGFzc05hbWUgPT09IHNlbGVjdGVkRWxlbWVudC5jbGFzc05hbWUpIHsgLy8gaWYgaSBjYW4gY29tYmluZSB3aXRoIHRoZSBuZXh0IG9uZVxuICAgICAgICAgICAgc29tZXRoaW5nTW92ZWQgPSBjb21iaW5lU2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRFbGVtZW50Q29vcmQgKyAnLScgKyB5KSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG5leHRFbGVtZW50Q29vcmQgPT09IDAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmV4dEVsZW1lbnRDb29yZCArICctJyArIHkpLmNsYXNzTmFtZSA9PT0gJ2VtcHR5JykgeyAvLyBpZiB3ZSBnZXQgdG8gdGhlIGVuZCBhbmQgaXRzIGVtcHR5Li4uXG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmKHNvbWV0aGluZ01vdmVkKSBoZWxwZXJzLmFkZFJhbmRvbVR3b09yRm91cigpO1xuICByZXR1cm4gc29tZXRoaW5nTW92ZWQ7XG59O1xuXG5oYW5kbGVycy5jb25zb2xpZGF0ZVJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzb21ldGhpbmdNb3ZlZCA9IGZhbHNlO1xuICBmb3IgKHZhciB4ID0gMjsgeCA+PSAwOyB4LS0pIHtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IDQ7IHkrKykge1xuICAgICAgdmFyIHNlbGVjdGVkRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyB5KTtcbiAgICAgIHZhciBuZXh0RWxlbWVudENvb3JkID0geCArIDE7XG4gICAgICBpZiAoc2VsZWN0ZWRFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2VtcHR5Jykge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmV4dEVsZW1lbnRDb29yZCArICctJyArIHkpLmNsYXNzTmFtZSA9PT0gJ2VtcHR5Jykge1xuICAgICAgICAgIGlmIChuZXh0RWxlbWVudENvb3JkID09PSAzKSB7XG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0RWxlbWVudENvb3JkIDwgMyAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSkuY2xhc3NOYW1lID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgICAgIG5leHRFbGVtZW50Q29vcmQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSkuY2xhc3NOYW1lID09PSBzZWxlY3RlZEVsZW1lbnQuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gY29tYmluZVNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYobmV4dEVsZW1lbnRDb29yZCA9PT0gMyl7XG4gICAgICAgICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRFbGVtZW50Q29vcmQgKyAnLScgKyB5KS5jbGFzc05hbWUgPT09ICdlbXB0eScpe1xuICAgICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gc2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRFbGVtZW50Q29vcmQgKyAnLScgKyB5KSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgobmV4dEVsZW1lbnRDb29yZCAtIDEpICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgobmV4dEVsZW1lbnRDb29yZCAtIDEpICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSkuY2xhc3NOYW1lID09PSBzZWxlY3RlZEVsZW1lbnQuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IGNvbWJpbmVTZXRDbGFzc0FuZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmV4dEVsZW1lbnRDb29yZCArICctJyArIHkpLCBzZWxlY3RlZEVsZW1lbnQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEVsZW1lbnRDb29yZCA9PT0gMyAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSkuY2xhc3NOYW1lID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuZXh0RWxlbWVudENvb3JkICsgJy0nICsgeSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmKHNvbWV0aGluZ01vdmVkKSBoZWxwZXJzLmFkZFJhbmRvbVR3b09yRm91cigpO1xuICByZXR1cm4gc29tZXRoaW5nTW92ZWQ7XG59O1xuXG5oYW5kbGVycy5jb25zb2xpZGF0ZVVwID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzb21ldGhpbmdNb3ZlZCA9IGZhbHNlO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IDQ7IHgrKykge1xuICAgIGZvciAodmFyIHkgPSAxOyB5IDwgNDsgeSsrKSB7XG4gICAgICB2YXIgc2VsZWN0ZWRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIHkpO1xuICAgICAgdmFyIG5leHRFbGVtZW50Q29vcmQgPSB5IC0gMTtcbiAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQuY2xhc3NOYW1lICE9PSAnZW1wdHknKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCkuY2xhc3NOYW1lID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgaWYgKG5leHRFbGVtZW50Q29vcmQgPT09IDApIHtcbiAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gc2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyBuZXh0RWxlbWVudENvb3JkKSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hpbGUgKG5leHRFbGVtZW50Q29vcmQgPiAwICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyBuZXh0RWxlbWVudENvb3JkKS5jbGFzc05hbWUgPT09ICdlbXB0eScpIHtcbiAgICAgICAgICAgICAgbmV4dEVsZW1lbnRDb29yZC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyBuZXh0RWxlbWVudENvb3JkKS5jbGFzc05hbWUgPT09IHNlbGVjdGVkRWxlbWVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgc29tZXRoaW5nTW92ZWQgPSBjb21iaW5lU2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyBuZXh0RWxlbWVudENvb3JkKSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihuZXh0RWxlbWVudENvb3JkID09PSAwKXtcbiAgICAgICAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIG5leHRFbGVtZW50Q29vcmQpLmNsYXNzTmFtZSA9PT0gJ2VtcHR5Jyl7XG4gICAgICAgICAgICAgICAgc29tZXRoaW5nTW92ZWQgPSBzZXRDbGFzc0FuZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIG5leHRFbGVtZW50Q29vcmQpLCBzZWxlY3RlZEVsZW1lbnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gc2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyAobmV4dEVsZW1lbnRDb29yZCArIDEpKSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc29tZXRoaW5nTW92ZWQgPSBzZXRDbGFzc0FuZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIChuZXh0RWxlbWVudENvb3JkICsgMSkpLCBzZWxlY3RlZEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIG5leHRFbGVtZW50Q29vcmQpLmNsYXNzTmFtZSA9PT0gc2VsZWN0ZWRFbGVtZW50LmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgc29tZXRoaW5nTW92ZWQgPSBjb21iaW5lU2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyBuZXh0RWxlbWVudENvb3JkKSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG5leHRFbGVtZW50Q29vcmQgPT09IDAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIG5leHRFbGVtZW50Q29vcmQpLmNsYXNzTmFtZSA9PT0gJ2VtcHR5Jykge1xuICAgICAgICAgICAgc29tZXRoaW5nTW92ZWQgPSBzZXRDbGFzc0FuZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIG5leHRFbGVtZW50Q29vcmQpLCBzZWxlY3RlZEVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZihzb21ldGhpbmdNb3ZlZCkgaGVscGVycy5hZGRSYW5kb21Ud29PckZvdXIoKTtcbiAgcmV0dXJuIHNvbWV0aGluZ01vdmVkO1xufTtcblxuaGFuZGxlcnMuY29uc29saWRhdGVEb3duID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzb21ldGhpbmdNb3ZlZCA9IGZhbHNlO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IDQ7IHgrKykge1xuICAgIGZvciAodmFyIHkgPSAyOyB5ID49IDA7IHktLSkge1xuICAgICAgdmFyIHNlbGVjdGVkRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyB5KTtcbiAgICAgIHZhciBuZXh0RWxlbWVudENvb3JkID0geSArIDE7XG4gICAgICBpZiAoc2VsZWN0ZWRFbGVtZW50LmNsYXNzTmFtZSAhPT0gJ2VtcHR5Jykge1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIG5leHRFbGVtZW50Q29vcmQpLmNsYXNzTmFtZSA9PT0gJ2VtcHR5Jykge1xuICAgICAgICAgIGlmIChuZXh0RWxlbWVudENvb3JkID09PSAzKSB7XG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0RWxlbWVudENvb3JkIDwgMyAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCkuY2xhc3NOYW1lID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgICAgIG5leHRFbGVtZW50Q29vcmQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCkuY2xhc3NOYW1lID09PSBzZWxlY3RlZEVsZW1lbnQuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gY29tYmluZVNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYobmV4dEVsZW1lbnRDb29yZCA9PT0gMyl7XG4gICAgICAgICAgICAgIGlmKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyBuZXh0RWxlbWVudENvb3JkKS5jbGFzc05hbWUgPT09ICdlbXB0eScpe1xuICAgICAgICAgICAgICAgIHNvbWV0aGluZ01vdmVkID0gc2V0Q2xhc3NBbmRIVE1MKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHggKyAnLScgKyBuZXh0RWxlbWVudENvb3JkKSwgc2VsZWN0ZWRFbGVtZW50KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgKG5leHRFbGVtZW50Q29vcmQgLSAxKSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICAgIH0gLy8gdGhpcyBpcyB3aGF0IGkgbmVlZCB0byBhZGQgdG8gYWxsIGRpcmVjdGlvbnNcbiAgICAgICAgICAgICAgLy8gaSB0aGluayBpIGRvbnQgbmVlZCBvbmUgb2YgdGhlc2UgZWxzZSBzdGF0ZW1lbnRzLi4uXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgKG5leHRFbGVtZW50Q29vcmQgLSAxKSksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCkuY2xhc3NOYW1lID09PSBzZWxlY3RlZEVsZW1lbnQuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IGNvbWJpbmVTZXRDbGFzc0FuZEhUTUwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoeCArICctJyArIG5leHRFbGVtZW50Q29vcmQpLCBzZWxlY3RlZEVsZW1lbnQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobmV4dEVsZW1lbnRDb29yZCA9PT0gMyAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCkuY2xhc3NOYW1lID09PSAnZW1wdHknKSB7XG4gICAgICAgICAgICBzb21ldGhpbmdNb3ZlZCA9IHNldENsYXNzQW5kSFRNTChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh4ICsgJy0nICsgbmV4dEVsZW1lbnRDb29yZCksIHNlbGVjdGVkRWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmKHNvbWV0aGluZ01vdmVkKSBoZWxwZXJzLmFkZFJhbmRvbVR3b09yRm91cigpO1xuICByZXR1cm4gc29tZXRoaW5nTW92ZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhhbmRsZXJzO1xuIl19
