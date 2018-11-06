//this module calls other modules to filter, pre-process and compare road links.
//input parameters are set in ./bin/run.js file

const {compareData} = require('./comparator/comparator.js');
const {filterOneway} = require('./filter/oneway.js');
const {processArray} = require('./process-features/convert-array.js');

exports.roadFlow = (inputFiles, outputFiles, tempFiles) => {

  console.info('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

  let promise = [ //call oneway filtering for OS and OSM data as array
    filterOneway('OS', inputFiles.OS, tempFiles.OS),
    filterOneway('OSM', inputFiles.OSM, tempFiles.OSM)
  ];

  return Promise.all(promise)
    .then( () => { //call functions for processing arrays after filter promise resolved
      processArray(tempFiles.OS);
      processArray(tempFiles.OSM);
    })
    .then( () => { //call function for comparing data after array processed promise resolved
      console.info('FINISHED pre-processing data');
      compareData(tempFiles, outputFiles);
    })
    .then( () => { //if all promises resolved return true
      return true;
    }, () => { //if any of the promises is rejected return false
      return false;
  });
}
