/*
Read GIS data from input file
calls module with parameter (features) to process coordinates array
returns output GIS data with processed coordinates
write data to output file
*/

const fs = require('fs');
const extractor = require('./feature-extractor.js')

//input variable is array of 2 elements [inputFile, outputFile]
exports.process = (file = []) => {
//read data from input file and parse to JSON object
let data = JSON.parse(fs.readFileSync(file[0]).toString());
console.log("Data is read from file: " + file[0]);
//call module to convert array with parameter features
data.features = extractor.filter(data.features);

console.log("Writing data to the file: " + file[1]);
//write JSON data of orginized coordinates array to same input file
fs.writeFileSync( file[1], JSON.stringify(data, null, 2));
console.log("Data is saved to: " + file[1]);
//return true when no error incountered
return true;
}
