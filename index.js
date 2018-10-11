const comparator = require('./comparator/comparator.js');
const filter = require('./filter/oneway.js');

console.log('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

let totalTime = new Date();
let tempInput = [];
let output = ['./output/onewayUKOS.json',
              './output/onewayUKOSM.json',
              './output/onewayMismatch.json'];

mapFilter = (source, fileName) => {
  const input = './input/' + fileName;
  const tempOutput = './temp/' + fileName.split('.')[0] + '.json';
  console.log('PRE-PROCCING data from ' + source);
  filter.execute(source, input, tempOutput, () => {
    console.log('FINISHED pre-processing data from ' + source);
    tempInput.push(tempOutput);
    if(tempInput.length == 2){
      console.log('STARTING comparartor Script.');
      comparator.start(tempInput, output, totalTime);
    }
  });
}

//========== start of the code ==========
mapFilter('OS', 'OSMM_HIGHWAYS_June18.gpkg');
mapFilter('OSM', 'testUK.pbf');
