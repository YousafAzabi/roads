const comparator = require('./comparator/comparator.js');
const filter = require('./filter/oneway.js');
const convertArray = require('./process-features/convert-array.js');

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
  promise.push(filter.execute(source, input, tempOutput));
}

//========== start of the code ==========
mapFilter('OS', 'LondonOStest.gpkg');
mapFilter('OSM', 'testLondon.pbf');

Promise.all(promise)
  .then( () => {
    convertArray.process([tempInput[0], tempInput[0]]);
    convertArray.process([tempInput[1], tempInput[1]]);
  })
  .then( () => {
    console.info('FINISHED pre-processing data');
    comparator.start(tempInput, output, totalTime);
  }, (reason) => {
  throw reason;
});
