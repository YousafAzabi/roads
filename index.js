const comparator = require('./comparator/comparator.js');
const filter = require('./filter/oneway.js');
const convertArray = require('./process-features/convert-array.js');
//print time when the script started
console.log('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

let totalTime = new Date(); //save start time to calculate total time
let tempInput = []; //hold output file names from ogr2ogr and input to coparator script
let output = ['./output/onewayUKOS.json', //output files
              './output/onewayUKOSM.json',
              './output/onewayMismatch.json'];

let promise = []; //array to hold promises

//=========== call filter.execute =============
mapFilter = (source, fileName) => {
  const input = './input/' + fileName; //form input path
  const tempOutput = './temp/' + fileName.split('.')[0] + '.json'; //form output path
  console.log('PRE-PROCCING data from ' + source);
  tempInput.push(tempOutput); //push names of outputed files to input files array
  promise.push(filter.execute(source, input, tempOutput)); //push returned promise to promise array
}

//========== start of the code ==========
mapFilter('OS', 'LondonOStest.gpkg'); //call intternal function for OS data
mapFilter('OSM', 'testLondon.pbf'); //call intternal function for OSM data

//wait for all elements in promise array to finish
Promise.all(promise)
  .then( (values) => { //if all promises resolved do
    convertArray.process([tempInput[0], tempInput[0]]);
    convertArray.process([tempInput[0], tempInput[0]]);
  })
  .then( (values) => {
    console.log('FINISHED pre-processing data');
    comparator.start(tempInput, output, totalTime); //call comparator script when files generated
  }, (reason) => { //if some or all promises failed print the error
    console.log(reason);
});
