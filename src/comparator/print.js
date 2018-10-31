const tm = require('../time.js');

exports.message = (text) => {
    console.info(text);
}

exports.header = (lengthOS, lengthOSM) => {
  console.info('\n\t\t*****\t comparator Script started at ' +
            new Date().toLocaleTimeString() + ' \t*****\n');
  console.info('Nubmer of roads OS= ' + lengthOS + ', and OSM= ' + lengthOSM);
}

exports.report = (counter) => {
  console.info('Number of OS links with NONE match in OSM: ' + counter.noMatch);
  console.info('Number of OS links with ONE  match in OSM: ' + counter.oneMatch);
  console.info('Number of OS links with MULTImatch in OSM: ' + counter.multiMatch);
  console.info('Number of road links without a Name in OS: ' + counter.noName);
}

exports.progress = (obj) => {
  if (obj.toPrint) {
    console.info('Time passed: ' + tm.format(obj.timePassed));
    console.info('Estimate Time Left: ' + tm.format(obj.estimateTimeLeft));
    console.info('Progress: ' + obj.progressPercent.toFixed(2) + '%');
  }
}

exports.footer = (time) => {
  let duration = new Date() - time;
  console.info('\t***************************************\n');
  console.info('\t\tTotal time taken: \t' + tm.format(new Date() - time) + '\n');
}
