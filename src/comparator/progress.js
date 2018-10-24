//module to calculate how many roads processed and estimate time left
const print = require('./print.js');

let lastPrintDate = new Date();

exports.calculate = (start, counters) => {
  if ( (new Date() - lastPrintDate) > 3000) {
    lastPrintDate = new Date();
    let timePassed = lastPrintDate - start;
    let roadRatio = (counters.totalRoadsOS / counters.processedOS);
    let estimateTimeLeft = (roadRatio - 1) * timePassed;
    let progressPercentage = ( 1 / roadRatio) * 100;
    print.progress(timePassed, estimateTimeLeft, progressPercentage);
  }
}
