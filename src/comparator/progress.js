//module to calculate how many roads processed and estimate time left

const print = require('./print.js');

const intervalPrintTime = 10000; //time intervals to print progress in millisecond
let startDate;
let lastPrintDate;

init();

//========== initiate function ==========
function init() {
  startDate = new Date();
  lastPrintDate = new Date();
}

exports.init = init;
exports.intervalPrintTime = intervalPrintTime;

exports.calculateProgress = (counters) => {
  let calcObj = {}; //object to hold progress information
  // print only once evere 3000 mills
  if ( (new Date() - lastPrintDate) > intervalPrintTime ) {
    lastPrintDate = new Date();
    const timePassed = lastPrintDate - startDate;
    const roadRatio = (counters.totalLinksOS / counters.processedOS);
    const estimateTimeLeft = (roadRatio - 1) * timePassed;
    const progressPercent = ( 1 / roadRatio) * 100;

    calcObj = {
      toPrint: true,
      timePassed,
      estimateTimeLeft,
      progressPercent
    };
  }
  return calcObj;
}
