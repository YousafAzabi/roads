const comparator = require('./comparator/comparator.js');
const filter = require('./filter/oneway.js');
const convertArray = require('./process-features/convert-array.js');

console.log('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

let totalTime = new Date();
let tempInput = [];
let output = {"outputFileOS": './output/onewayUKOS.json',
              "outputFileOSM": './output/onewayUKOSM.json',
              "outputFileInfo":'./output/onewayMismatch.json'};

let promise = [];

mapFilter = (source, fileName) => {
  const input = './input/' + fileName;
  const tempOutput = './temp/' + fileName.split('.')[0] + '.json';
  console.log('PRE-PROCCING data from ' + source);
  tempInput.push(tempOutput);
  promise.push(filter.execute(source, input, tempOutput));
}

//========== start of the code ==========
mapFilter('OS', 'LondonOStest.gpkg');
mapFilter('OSM', 'testLondon.pbf');

Promise.all(promise)
  .then( (values) => {
    convertArray.process([tempInput[0], tempInput[0]]);
  })
  .then( (values) => {
    convertArray.process([tempInput[1], tempInput[1]]);
  })
  .then( (values) => {
    console.log('FINISHED pre-processing data');
    comparator.start(tempInput, output, totalTime);
  }, reason => {
  console.log(reason);
});
