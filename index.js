// FCC: Build a Simon Game
// User Story: I am presented with a random series of button presses.
// User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with an additional step.
// User Story: I hear a sound that corresponds to each button both when the series of button presses plays, and when I personally press a button.
// User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses starts again to remind me of the pattern so I can try again.
// User Story: I can see how many steps are in the current series of button presses.
// User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.
// User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so, and the game restarts at a new random series of button presses.
// User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.


// Wrap everything in an IFFE
!function() {

 var greenAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
 var redAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
 var yellowAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
 var blueAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

var gameState = 0;

// Main
function simon() {
  // 1. Global reset
  gameState = 0;
  var strictMode = 0;
  var turnNumber = 0;
  var turn = document.getElementById('center__turn--display');
  turn.textContent = turnNumber; // don't use .innerText as that's an old method.

  var startEnd = document.getElementById('center__start--button');
  var strict = document.getElementById('center__mode--button');
  
  startEnd.style.background = '';
  strict.style.cursor = 'pointer';
  strict.style.background = '';

  ['green', 'red', 'yellow', 'blue'].forEach(function(oldColor) { // add back mouseaction
    document.getElementById('simon__color--' + oldColor).classList.add('no-mouseaction');
  });
  
  
  // 2. Setup click events
  strict.onclick = function() {
    if(!strictMode) {
      strict.style.background = '#c00';
      strictMode = 1;
    }
    else {
      strict.style.background = '';
      strictMode = 0;
    }
  };
  
  startEnd.onclick = function() {
    if(!gameState) {
      startEnd.style.background = '#0c0';
      gameState = 1;
      // 3. Start prompt
      colorPrompt(strictMode, turnNumber, null);
      strict.onclick = function() { return false; }
      strict.style.cursor = 'auto';
    }
    else {
      startEnd.style.background = '';
      gameState = 0;
      turnNumber = 0;
      turn.textContent = 0; // again, don't use .innerText as it's not widely supported
    }
  };
}

function colorPrompt(sMode, tNumber, previousPattern) {
  // 4. No mouseaction during prompt
  ['green', 'red', 'yellow', 'blue'].forEach(function(oldColor) { // remove mouseaction
    document.getElementById('simon__color--' + oldColor).classList.add('no-mouseaction');
  });
 
  // 5. Move turn forward.
  document.getElementById('center__turn--display').textContent = ++tNumber;
  var pattern = [];
  
  // 6. Conditionals for specific turn numbers.
  if(tNumber > 20) {
    document.getElementById('background').classList.add('win');
    setTimeout(function() { document.getElementById('background').classList.remove('win'); }, 2000);
    simon();
  }
  else if(tNumber === 1) {
    pattern.push(randomColor());
  }
  else {
    pattern = previousPattern;
    pattern.push(randomColor());
  }
  
  // 7. Present new pattern with one added to old pattern at random.
  setTimeout(function() { 
    presentPattern(pattern, tNumber, sMode); 
  }, 0); // removed delay, as including any delay seems too long.
}

function presentPattern(pat, tNum, sMo) {
  // 8. Present each pattern sequentially; return to game start if game button is pressed while on
  pat.forEach(function(step, index) {
    setTimeout(function() {
        
      if(gameState) { // Removed the previous way of detecting when the game ended (i.e., detecting style changes, as this was less reliable)
         presentStep(step);
      }
      else return simon();
      }, (index+1)*1000);
    });
  // 9. Request user input
  setTimeout(function() {
    if(gameState) {
       getUserInput(pat, tNum, sMo); 
    }
    else return simon();
  }, (pat.length+1)*1000);
}


function getUserInput(correctPattern, currentTurn, strictM) {
  
  var userPattern = [];
 
  // 10. Enable user input
  ['green', 'red', 'yellow', 'blue'].forEach(function(oldColor) { // add back mouseaction
    document.getElementById('simon__color--' + oldColor).classList.remove('no-mouseaction');
  });

  document.getElementById('simon').onclick = function(e) {
    // 11. Check user input
    if(userPattern.length < correctPattern.length) {
      if(e.target) {
        if(e.target.id == 'simon__color--green') {
          userPattern.push('green');
          // 12. Segment for restarting sounds if button is pressed repeatedly.
          if(greenAudio.paused) {
            greenAudio.play();
          }
          else {
            greenAudio.currentTime = 0;
          }
          // 13. Highlight button pressed.
          highlightInput('green');
          // 14. Check user input against correct pattern.
          if(!checkInput(userPattern, correctPattern, strictM)) return;
          // 15. At the last pattern, restart the prompt, but add one more to the pattern.
          if(userPattern.length === correctPattern.length) {
            setTimeout(function() { colorPrompt(strictM, currentTurn, correctPattern); }, 400); // wait for user input animation to play out
          }
        }
        if(e.target.id == 'simon__color--red') {
          userPattern.push('red');
          if(redAudio.paused) {
            redAudio.play();
          }
          else {
            redAudio.currentTime = 0;
          }
          highlightInput('red');
          if(!checkInput(userPattern, correctPattern, strictM)) return;
          if(userPattern.length === correctPattern.length) {
            setTimeout(function() { colorPrompt(strictM, currentTurn, correctPattern); }, 400);
          }
        }
        if(e.target.id == 'simon__color--yellow') {
          userPattern.push('yellow');
          if(yellowAudio.paused) {
            yellowAudio.play();
          }
          else {
            yellowAudio.currentTime = 0;
          }
          highlightInput('yellow');
          if(!checkInput(userPattern, correctPattern, strictM)) return;
          if(userPattern.length === correctPattern.length) {
            setTimeout(function() { colorPrompt(strictM, currentTurn, correctPattern); }, 400);
          }
        }
        if(e.target.id == 'simon__color--blue') {
          userPattern.push('blue');
          if(blueAudio.paused) {
            blueAudio.play();
          }
          else {
            blueAudio.currentTime = 0;
          }
          highlightInput('blue');
          if(!checkInput(userPattern, correctPattern, strictM)) return;
          if(userPattern.length === correctPattern.length) {
            setTimeout(function() { colorPrompt(strictM, currentTurn, correctPattern); }, 400);
          }
        }
      }
    }
  };
}

function highlightInput(color) {
  document.getElementById('simon__color--' + color).classList.remove(color + '-animation')
  document.getElementById('simon__color--' + color).classList.add(color + '-animation');
  setTimeout(function() { 
    document.getElementById('simon__color--' + color).classList.remove(color + '-animation');
  }, 50);
  
}


function checkInput(userP, correctP, sm) {
  var passState = true;
  
  for(var index = 0; index < userP.length; ++index) {
    if(userP[index] !== correctP[index]) {
      passState = false;
      document.getElementById('background').classList.add('wrong');
      setTimeout(function() {
        document.getElementById('background').classList.remove('wrong');
      }, 1000);
      if(sm) {
     //   return defeat();
        simon();
      }
      else {
        // replay the last step
        ['green', 'red', 'yellow', 'blue'].forEach(function(oldColor) { // remove mouseaction
          document.getElementById('simon__color--' + oldColor).classList.add('no-mouseaction');
        });
        setTimeout(function() { 
          presentPattern(correctP, correctP.length, sm); 
        }, 1000); // give a one second delay before displaying the next pattern.
      }
    }
  }
  
  return passState;
  
}

function presentStep(color) {
  //audio
  document.getElementById('simon__color--' + color).classList.add(color + '-animation');
  setTimeout(function() { 
    document.getElementById('simon__color--' + color).classList.remove(color + '-animation')
  }, 900);
  // play sound
  switch(color) {
    case 'green': greenAudio.play();
      break;
    case 'red': redAudio.play();
      break;
    case 'yellow': yellowAudio.play();
      break;
    case 'blue': blueAudio.play();
      break;
  }
}

function randomColor() { // generate a random color
  var rNumber = Math.random();
  var color;
  if(rNumber < 0.25) color = 'green';
  else if(rNumber < 0.5) color = 'red';
  else if(rNumber < 0.75) color = 'yellow';
  else color = 'blue';
  return color;
}


simon();

}();
