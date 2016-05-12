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
