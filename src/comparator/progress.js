//module to calculate how many roads processed and estimate time left

const print = require('./print.js');

let startDate = new Date();
let lastPrintDate = new Date()

exports.calculate = (counters) => {
  if (!counters) {
    print.message('ERROR! Counters input is missing.');
  }
  if ( (new Date() - lastPrintDate) > 3000 ) {
    lastPrintDate = new Date();
    let timePassed = lastPrintDate - startDate;
    let roadRatio = (counters.totalRoadsOS / counters.processedOS);
    let estimateTimeLeft = (roadRatio - 1) * timePassed;
    let progressPercent = ( 1 / roadRatio) * 100;
    return [timePassed, estimateTimeLeft, progressPercent];
  } else {
    return false;
  }
}
