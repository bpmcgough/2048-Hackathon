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
