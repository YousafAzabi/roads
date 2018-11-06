//module to calculate how many roads processed and estimate time left

const print = require('./print.js');

let startDate;
let lastPrintDate;

init();

//========== initiate function ==========
function init() {
  startDate = new Date();
  lastPrintDate = new Date();
}

exports.init = init;

exports.calculateProgress = (counters) => {
  let calcObj = {};
  // print only once evere 3000 mills
  if ( (new Date() - lastPrintDate) > 5000 ) {
    lastPrintDate = new Date();
    let timePassed = lastPrintDate - startDate;
    let roadRatio = (counters.totalRoadsOS / counters.processedOS);
    let estimateTimeLeft = (roadRatio - 1) * timePassed;
    let progressPercent = ( 1 / roadRatio) * 100;

    calcObj = {
      toPrint: true,
      timePassed,
      estimateTimeLeft,
      progressPercent
    };
  }
  return calcObj;
}
