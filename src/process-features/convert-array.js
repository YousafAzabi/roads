/*
Read GIS data from input file
calls module with parameter (features) to process coordinates array
returns output GIS data with processed coordinates
write data to output file
*/

const fs = require('fs');
const extractor = require('./feature-extractor.js');
const print = require('../comparator/print.js');

exports.processArray = (fileName) => {
  //read data from input file and parse to JSON object
  let data = JSON.parse(fs.readFileSync(fileName).toString());
  print.message("Data is read from file: " + fileName);
  //call module to convert array with parameter features
  data.features = extractor.filter(data.features);
  print.message("Writing data to the file: " + fileName);
  //write JSON data of orginized coordinates array to same input file
  fs.writeFileSync( fileName, JSON.stringify(data, null, 2));
  print.message("Data is saved to: " + fileName);
}
