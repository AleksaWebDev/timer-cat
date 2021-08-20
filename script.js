//global variables
var leftEyelid = document.getElementById('left-eyelid');
var rightEyelid = document.getElementById('right-eyelid');
var blinkingInterval;

var body = document.getElementsByTagName('body')[0];
var cat = document.getElementById('cat');
var leftEye = document.getElementById('left-eye');
var rightEye = document.getElementById('right-eye');

var hoursInput = document.getElementById('hours');
var minutesInput = document.getElementById('minutes');
var secondsInput = document.getElementById('seconds');
var hoursLastVal = hoursInput.value;
var minutesLastVal = minutesInput.value;
var secondsLastVal = secondsInput.value;

var stop = true; //shows whether the timer has stopped
var audioAlert = new Audio('cat.mp3');
var alertDiv = document.getElementById('alert');
var totalSeconds;
var snore1 = document.getElementById('snore-1');
var snore2 = document.getElementById('snore-2');
var snore3 = document.getElementById('snore-3');

function setGradient(x, y, i) {
  body.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px , #1f1f1f ' + i + '%, #e4ebf5 ' + (i+1) + '% ,' + '#e4ebf5 100%)';
}
// from light to dark
function animateBGlightToDark(x, y, i) {
  if (i < 100) {
    setGradient(x, y, i);

    setTimeout(animateBGlightToDark, 4, x, y, i+1);
  }
  else {
    body.removeAttribute('style');
  }
}
// from dark to light
function animateBGdarkToLight(x, y, i) {
  if (i >= -1) {
    setGradient(x, y, i);

    setTimeout(animateBGdarkToLight, 4, x, y, i-1);
  }
  else {
    body.removeAttribute('style');
  }
}

// switch between light and dark themes
function switchTheme(e) {
  var allMeta = document.getElementsByTagName('meta');
  var meta;
  for (var i = 0; i < allMeta.length; i++) {
    if (allMeta[i].hasAttribute('name') && allMeta[i].name == 'theme-color') {
      meta = allMeta[i];
      break;
    }
  }
  //center of radial gradient for animation
  var x, y;
  if (e) {
    x = e.pageX;
    y = e.pageY;
  }
  
  // from dark to light
  if (body.hasAttribute('class')) {
    body.removeAttribute('class');

    animateBGdarkToLight(x, y, 99);
    meta.content = '#9baacf';
  }
  else { // from light to dark
    body.setAttribute('class', 'dark');

    animateBGlightToDark(x, y, 0);
    meta.content = '#6f6f6f';
  }
}

//blinking eyes
function toggleBlinkingEyes() {
  leftEyelid.classList.toggle('blinking-eyes');
  rightEyelid.classList.toggle('blinking-eyes');
}
function blinkingEyes() {
    toggleBlinkingEyes();

    setTimeout(function () {
      toggleBlinkingEyes();
    }, 2000);
}

//eye movement in body tag without cat
function eyeMovementBody(e) {
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  var leftEyeball = document.getElementById('left-eyeball');
  var radiusEyeball = leftEyeball.getBoundingClientRect().width / 2;

  var coordsLeftEye = leftEye.getBoundingClientRect();
  var coordsRightEye = rightEye.getBoundingClientRect();
  var radiusEye = coordsLeftEye.width / 2;
  var leftEyeCenterX = Math.round(coordsLeftEye.x + coordsLeftEye.width / 2 + pageXOffset);
  var leftEyeCenterY = Math.round(coordsLeftEye.y + coordsLeftEye.height / 2 + pageYOffset);
  var rightEyeCenterX = Math.round(coordsRightEye.x + coordsRightEye.width / 2 + pageXOffset);

  if (mouseX >= rightEyeCenterX && mouseX <= leftEyeCenterX) {
    if (mouseY > leftEyeCenterY) {
      leftEye.style.top = rightEye.style.top = '33.3333%';
      leftEye.style.left = rightEye.style.left = '16.6667%';
    }
    else {
      leftEye.style.top = rightEye.style.top = '0%';
      leftEye.style.left = rightEye.style.left = '16.6667%';
    }
  }
  else {
    //transfer the coordinate system center to the center of the eyeball 
    var newMouseX, newMouseY;
    if (mouseX < rightEyeCenterX) {
      newMouseX = mouseX - rightEyeCenterX;
    }
    else {
      newMouseX = mouseX - leftEyeCenterX;
    }
    newMouseY = mouseY - leftEyeCenterY;
    // y = kx - the line on which the coordinates of the mouse lie and on which lies the center of the eye and eyeball
    var k = newMouseY / newMouseX;

    //the point of intersection of the line, an eye and an eyeball
    var xb, yb;
    xb = radiusEyeball / Math.sqrt(k*k + 1);
    if (mouseX < rightEyeCenterX) {
      xb = -xb;
    }
    yb = k*xb;

    //coordinates of the center of the eye
    var xs = (radiusEyeball - radiusEye) * xb / radiusEyeball;
    var ys = (radiusEyeball - radiusEye) * yb / radiusEyeball;

    var top = radiusEyeball + ys - radiusEye;
    var left = radiusEyeball + xs - radiusEye;

    top = top * 50 / radiusEyeball + '%';
    left = left * 50 / radiusEyeball + '%';
    leftEye.style.top = rightEye.style.top = top;
    leftEye.style.left = rightEye.style.left = left;
  }
}
//eye movement into cat
function eyeMovementCat(e) {
  //canceled the popup event for body tag
  if (e.stopPropagation) e.stopPropagation();

  leftEye.style.top = leftEye.style.left = rightEye.style.top = rightEye.style.left = '16.6667%';
}

//start / stop timer
//convert time to two digits
function timeTwoDigits(time) {
  if (time == '') time = '00';
  else if (time < 10 && time >= 0) time = '0' + time;
  return time;
}
function checkTime(timeInput) {
  if (timeInput.value.length < 2)
    timeInput.value = timeTwoDigits(timeInput.value);
  return timeInput.value;
}

//block startStop functions
function makeInputsDisabled() {
  hoursInput.setAttribute('disabled', '');
  minutesInput.setAttribute('disabled', '');
  secondsInput.setAttribute('disabled', '');
}
function deleteDisabledFromInputs() {
  hoursInput.removeAttribute('disabled');
  minutesInput.removeAttribute('disabled');
  secondsInput.removeAttribute('disabled');
}
function resetValuesOfInputs() {
  hoursInput.value = hoursLastVal = '';
  minutesInput.value = minutesLastVal = '';
  secondsInput.value = secondsLastVal = '';
}
function toggleClosedEyes() {
  leftEyelid.classList.toggle('closed-eyes');
  rightEyelid.classList.toggle('closed-eyes');
}
function toggleAnimationSnore() {
  snore1.classList.toggle('animation-snore');
  snore2.classList.toggle('animation-snore');
  snore3.classList.toggle('animation-snore');
}
function toggleEyesTurnOffTimer() {
  leftEye.classList.toggle('eyes-turn-off-timer');
  rightEye.classList.toggle('eyes-turn-off-timer');
}
function startStop() {
  if (this.innerHTML == 'Start') {
    var hours, minutes, seconds;

    if (function(){
      makeInputsDisabled();

      hours = parseInt(checkTime(hoursInput), 10);
      minutes = parseInt(checkTime(minutesInput), 10);
      seconds = parseInt(checkTime(secondsInput), 10);
      
      hoursLastVal = hoursInput.value;
      minutesLastVal = minutesInput.value;
      secondsLastVal = secondsInput.value;
      totalSeconds = seconds + minutes*60 + hours*60*60;
      if (totalSeconds > 0) return false;
      else {
        deleteDisabledFromInputs();
        resetValuesOfInputs();
        return true;
      }
    }()) return;
    

    this.innerHTML = 'Stop';
    stop = false;
    //stop blinking eyes
    clearInterval(blinkingInterval);
    //disable eye movement towards the mouse
    body.onmousemove = null;
    cat.onmousemove = null;
    //cat is closing its eyes
    toggleClosedEyes();
    //start snore animation
    toggleAnimationSnore();

    setTimeout(function tick() {
      if (stop) return;
      totalSeconds--;
      if (seconds > 0) {
        seconds--;
        secondsInput.value = secondsLastVal = timeTwoDigits(seconds);
      }
      else if (minutes > 0) {
        minutes--;
        minutesInput.value = minutesLastVal = timeTwoDigits(minutes);
        seconds = 59;
        secondsInput.value = seconds;
      }
      else if (hours > 0) {
        hours--;
        hoursInput.value = hoursLastVal = timeTwoDigits(hours);
        minutes = 59;
        minutesInput.value = minutes;
        seconds = 59;
        secondsInput.value = seconds;
      }
      if (totalSeconds == 0) {
        var once = true;
        setTimeout(function alert() {
          audioAlert.play();
          if (once) {
            //stop snore animation
            toggleAnimationSnore();
            //cat is opening its eyes
            toggleClosedEyes();
            //start animation eyes show to turn off timer
            if (leftEye.hasAttribute('style'))
              leftEye.removeAttribute('style');
            if (rightEye.hasAttribute('style'))
              rightEye.removeAttribute('style');
            toggleEyesTurnOffTimer();
            //start blinking eyes
            blinkingInterval = setInterval(blinkingEyes, 4000);

            alertDiv.classList.toggle('alert');
            once = false;
          }
          if (stop) {
            alertDiv.classList.toggle('alert');
            return;
          }
          else setTimeout(alert, 500);
        }, 10);

        return;
      }
      setTimeout(tick, 1000);
    }, 1000);
  }
  else {
    stop = true;
    this.innerHTML = 'Start';
    if (totalSeconds == 0) {
      resetValuesOfInputs();
      //stop animation eyes show to turn off timer
      toggleEyesTurnOffTimer();
      //turn on eye movement towards the mouse
      body.onmousemove = eyeMovementBody;
      cat.onmousemove = eyeMovementCat;
    }
    else {
      //stop snore animation
      toggleAnimationSnore();
      //cat is opening its eyes
      toggleClosedEyes();
      //start blinking eyes
      blinkingInterval = setInterval(blinkingEyes, 4000);
      //turn on eye movement towards the mouse
      body.onmousemove = eyeMovementBody;
      cat.onmousemove = eyeMovementCat;
    }
    deleteDisabledFromInputs();
  }
}
//check input time
function updateInputHMS(e) {
  var inputs = [
    {
      input: hoursInput,
      lastVal: hoursLastVal
    },
    {
      input: minutesInput,
      lastVal: minutesLastVal
    },
    {
      input: secondsInput,
      lastVal: secondsLastVal
    },
  ];
  // index for array
  var i;
  var firstDigitMax = 5;
  var id = e.target.id;

  if (id == 'hours') {
    i = 0;
    firstDigitMax = 9;
  }
  else if (id == 'minutes') {
    i = 1;
  }
  else {
    i = 2;
  }
  var currVal = inputs[i].input.value;


  if (currVal.length == 0) {
    inputs[i].lastVal = currVal;
  }
  else if (currVal.length == 1) {
    if (currVal >= '0' && currVal <= '9')
      inputs[i].lastVal = currVal;
    else inputs[i].input.value = inputs[i].lastVal;
  }
  else if (currVal.length == 2) {
    if (currVal[0] >= '0' && currVal[0] <= firstDigitMax && currVal[1] >= '0' && currVal[1] <= '9')
      inputs[i].lastVal = currVal;
    else inputs[i].input.value = inputs[i].lastVal;
  }
  else if (currVal.length > 2) {
    inputs[i].input.value = inputs[i].lastVal;
  }

  if (id == 'hours') hoursLastVal = inputs[i].lastVal;
  else if (id == 'minutes') minutesLastVal = inputs[i].lastVal;
  else secondsLastVal = inputs[i].lastVal;
}

function init() {
  //switch theme from light to dark
  var checkBox = document.getElementById('switch');

  checkBox.onclick = switchTheme;

  var theme = localStorage.getItem('theme');
  if (theme == 'dark') {
    switchTheme();
    checkBox.checked = true;
  }
  
  //blinking eyes
  blinkingInterval = setInterval(blinkingEyes, 4000);

  //eye movement
  body.onmousemove = eyeMovementBody;
  cat.onmousemove = eyeMovementCat;

  //start / stop timer
  var btn = document.getElementById('btn');
  btn.onclick = startStop;

  //check input time
  hoursInput.oninput = updateInputHMS;
  minutesInput.oninput = updateInputHMS;
  secondsInput.oninput = updateInputHMS;

  //before switching to an adjacent tab or closing this tab
  window.onunload = function() {
    if (checkBox.checked) localStorage.setItem('theme', 'dark');
    else localStorage.setItem('theme', 'light');
  };
}

window.onload = init;