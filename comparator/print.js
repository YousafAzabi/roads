const tm = require('../time.js');

exports.header = (lengthOS = NaN, lengthOSM = NaN) => {
  console.log('\n\t\t*****\t comparator Script started at ' +
            new Date().toLocaleTimeString() + ' \t*****\n');
  if (isNaN(lengthOS) || isNaN(lengthOSM)) {
    console.log('ERROR! One value is sent to function print.header');
    return false;
  } else {
    console.log("Nubmer of roads OS= " + lengthOS + ", and OSM= " + lengthOSM);
    return true;
  }
}

exports.report = (counter = []) => {
  if (counter.length == 0) {
    console.log('ERROR! The input is empty no values to print');
    return false;
  } else {
    console.log("Number of OS links with NO match in OSM: \t\t" + counter[0]);
    console.log("Number of OS links with ONE match in OSM: \t\t" + counter[1]);
    console.log("Number of OS links with MULTIPLE match in OSM: \t" + counter[2]);
    console.log("Number of roads with No-Name in OS: \t\t\t" + counter[3]);
    return true;
  }
}

exports.footer = (time) => {
  if (time == -1) {
    console.log('ERROR! time cannot be calcualted. No input (start) time provided');
    return true;
  } else {
    console.log('\t\tTotal time taken: \t' + tm.format(new Date() - time) + '\n');
    return false;
  }
}
