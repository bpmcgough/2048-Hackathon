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
