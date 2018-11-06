//module to print information through out the programme

const tm = require('../time.js');

exports.message = (text) => {
    console.info(text);
}

//========== print info at start of programe ==========
exports.header = (lengthOS, lengthOSM) => {
  console.info('\n\t\t*****\t comparator Script started at ' +
            new Date().toLocaleTimeString() + ' \t*****\n');
  console.info('Nubmer of roads OS= ' + lengthOS + ', and OSM= ' + lengthOSM);
}

//========== print info about link matche at end of programe ==========
exports.report = (counter) => {
  console.info('Number of OS links with NONE match in OSM: ' + counter.noMatch);
  console.info('Number of OS links with ONE  match in OSM: ' + counter.oneMatch);
  console.info('Number of OS links with MULTImatch in OSM: ' + counter.multiMatch);
  console.info('Number of road links without a Name in OS: ' + counter.noName);
}

//========== print progress info at set intervals ==========
exports.progress = (obj) => {
  if (obj.toPrint) { //check if toPrint is true
    console.info('Time passed: ' + tm.format(obj.timePassed));
    console.info('Estimate Time Left: ' + tm.format(obj.estimateTimeLeft));
    console.info('Progress: ' + obj.progressPercent.toFixed(2) + '%');
  }
}

//========== print info at end of programe ==========
exports.footer = (time) => {
  console.info('\t***************************************\n');
  console.info('\t\tTotal time taken: \t' + tm.format(new Date() - time) + '\n');
}
