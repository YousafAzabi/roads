const tm = require('../time.js');

exports.message = (text) => {
    console.info(text);
}

exports.header = (lengthOS = NaN, lengthOSM = NaN) => {
  if (isNaN(lengthOS) || isNaN(lengthOSM)) {
    throw 'ERROR! Parameter sent to function print.header are not numbers.';
  } else {
    console.info('\n\t\t*****\t comparator Script started at ' +
              new Date().toLocaleTimeString() + ' \t*****\n');
    console.info('Nubmer of roads OS= ' + lengthOS + ', and OSM= ' + lengthOSM);
  }
}

exports.report = (counter = []) => {
  if (counter.length === 0) {
    throw 'ERROR! The mismatch counters are empty no values to print';
  } else {
    console.info('Number of OS links with NONE match in OSM: ' + counter.noMatch);
    console.info('Number of OS links with ONE  match in OSM: ' + counter.oneMatch);
    console.info('Number of OS links with MULTImatch in OSM: ' + counter.multiMatch);
    console.info('Number of road links without a Name in OS: ' + counter.noName);
  }
}

exports.progress = (inputArray) => {
  if (inputArray && inputArray.length === 3) {
    [timePassed, estimateTimeLeft, Progresspercentage] = inputArray;
    if (isNaN(timePassed) || isNaN(estimateTimeLeft) || isNaN(Progresspercentage)) {
      console.info('ERROR! One or more of input values are NOT numbers.');
    } else {
      console.info('Time passed: ' + tm.format(timePassed));
      console.info('Estimate Time Left: ' + tm.format(estimateTimeLeft));
      console.info('Progress: ' + Progresspercentage.toFixed(2) + '%');
    }
  } else {
    console.info('ERROR! One or more of input values are missing.');
  }
}

exports.footer = (time = -1) => {
  if (time === -1) {
    throw 'ERROR! time cannot be calcualted. No starting (input) time provided';
  } else {
    let duration = new Date() - time;
    console.info('\t***************************************\n');
    if (duration < 0) {
      throw 'ERROR! starting (input) time is greater than end (current) time.';
    } else {
      console.info('\t\tTotal time taken: \t' + tm.format(new Date() - time) + '\n');
    }
  }
}
