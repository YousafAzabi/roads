const {compareData} = require('./comparator/comparator.js');
const {filterOneway} = require('./filter/oneway.js');
const {processArray} = require('./process-features/convert-array.js');

exports.roadFlow = (inputFiles, outputFiles, tempFiles) => {

  console.info('***** Start ' + new Date().toLocaleTimeString() + ' *****\n');

  let promise = [
    filterOneway('OS', inputFiles.OS, tempFiles.OS),
    filterOneway('OSM', inputFiles.OSM, tempFiles.OSM)
  ];

  return Promise.all(promise)
    .then( () => {
      processArray(tempFiles.OS);
      processArray(tempFiles.OSM);
    })
    .then( () => {
      console.info('FINISHED pre-processing data');
      compareData(tempFiles, outputFiles);
    })
    .then( () => {
      return true;
    }, () => {
      return false;
  });
}
