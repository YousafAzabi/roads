const comparator = require('./comparator/comparator.js');
const filter = require('./filter/oneway.js');

console.log('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

let totalTime = new Date();
let tempInput = [];
let output = ['./output/onewayUKOS.json',
              './output/onewayUKOSM.json',
              './output/onewayMismatch.json'];

let promise = [];

mapFilter = (source, fileName) => {
  const input = './input/' + fileName;
  const tempOutput = './temp/' + fileName.split('.')[0] + '.json';
  console.log('PRE-PROCCING data from ' + source);
  tempInput.push(tempOutput);
  promise.push(filter.execute(source, input, tempOutput));
}

//========== start of the code ==========
mapFilter('OS', 'testdataOS.gpkg');
mapFilter('OSM', 'exiOSM.xml');

Promise.all(promise).then( values => {
  console.log('FINISHED pre-processing data');
  comparator.start(tempInput, output, totalTime);
}, reason => {
  console.log(reason);
});
