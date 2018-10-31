const {compare} = require('./comparator/comparator.js');
const {filterOneway} = require('./filter/oneway.js');
const {processArray} = require('./process-features/convert-array.js');

console.info('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

let totalTime = new Date();
let tempInput = [], promise = [];
let output = {
  "outputFileOS": './output/onewayUKOS.json',
  "outputFileOSM": './output/onewayUKOSM.json',
  "outputFileInfo":'./output/onewayMismatch.json'
};

mapFilter = (source, fileName) => {
  const input = './input/' + fileName;
  const tempOutput = './temp/' + fileName.split('.')[0] + '.json';
  console.info('PRE-PROCCING data from ' + source);
  tempInput.push(tempOutput);
  promise.push(filterOneway(source, input, tempOutput));
}

//========== start of the code ==========
mapFilter('OS', 'LondonOStest.gpkg');
mapFilter('OSM', 'testLondon.pbf');

Promise.all(promise)
  .then( () => {
    processArray([tempInput[0], tempInput[0]]);
    processArray([tempInput[1], tempInput[1]]);
  })
  .then( () => {
    console.info('FINISHED pre-processing data');
    compare(tempInput, output, totalTime);
  }, (reason) => {
  throw reason;
});
