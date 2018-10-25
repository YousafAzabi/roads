const tm = require('../time.js');

exports.message = (text) => {
    console.log(text);
}

exports.header = (lengthOS = NaN, lengthOSM = NaN) => {
  if (isNaN(lengthOS) || isNaN(lengthOSM)) {
    throw 'ERROR! Parameter sent to function print.header are not numbers.';
  } else {
    console.log('\n\t\t*****\t comparator Script started at ' +
              new Date().toLocaleTimeString() + ' \t*****\n');
    console.log('Nubmer of roads OS= ' + lengthOS + ', and OSM= ' + lengthOSM);
  }
}

exports.report = (counter = []) => {
  if (counter.length === 0) {
    console.log('ERROR! The input is empty no values to print');
  } else {
    console.log('Number of OS links with NO match in OSM: \t\t' + counter.noMatch);
    console.log('Number of OS links with ONE match in OSM: \t\t' + counter.oneMatch);
    console.log('Number of OS links with MULTIPLE match in OSM: \t\t' + counter.multiMatch);
    console.log('Number of roads with No-Name in OS: \t\t\t' + counter.noName);
  }
}

exports.progress = ([timePassed, estimateTimeLeft, Progresspercentage]) => {
  if (!timePassed || !estimateTimeLeft || !Progresspercentage) {
    console.log('ERROR! One or more of input values are missing.');
  } else {
    console.log('Time passed: ', tm.format(timePassed));
    console.log('Estimate Time Left: ', tm.format(estimateTimeLeft));
    console.log('Progress: ', Progresspercentage.toFixed(2), '%');
  }
}

exports.footer = (time = -1) => {
  if (time === -1) {
    console.log('ERROR! time cannot be calcualted. No starting (input) time provided');
  } else {
    let duration = new Date() - time;
    console.log('\t***************************************\n');
    if (duration < 0) {
      console.log('ERROR! starting (input) time is greater than end (current) time.');
    } else {
      console.log('\t\tTotal time taken: \t' + tm.format(new Date() - time) + '\n');
    }
  }
}
