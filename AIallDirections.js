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
