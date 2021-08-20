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
    if (currVal >= 0 && currVal <= 9)
      inputs[i].lastVal = currVal;
    else inputs[i].input.value = '';
  }
  else if (currVal.length == 2) {
    if (currVal[0] >= 0 && currVal[0] <= firstDigitMax && currVal[1] >= 0 && currVal[1] <= 9)
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