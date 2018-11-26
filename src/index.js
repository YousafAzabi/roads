//this module calls other modules to filter, pre-process and compare road links.
//input parameters are set in ./bin/run.js file

const {compareData} = require('./comparator/comparator.js');
const {filterOneway} = require('./filter/oneway.js');
const {processArray} = require('./process-features/convert-array.js');

exports.roadFlow = (inputFiles, outputFiles, tempFiles) => {

  console.info('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

  const promise = [ //call oneway filtering for OS and OSM data as array
    filterOneway('OS', inputFiles.OS, tempFiles.OS),
    filterOneway('OSM', inputFiles.OSM, tempFiles.OSM)
  ];

  return Promise.all(promise)
    .then( () => { //call functions for processing arrays after filter promise resolved
      processArray(tempFiles.OS);
      processArray(tempFiles.OSM);
      console.info('FINISHED pre-processing data');
      compareData(tempFiles, outputFiles); //call function for comparing data
    });
}
