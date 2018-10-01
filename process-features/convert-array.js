/*
Read GIS data from input file
calls module with parameter (features) to process coordinates array
returns output GIS data with processed coordinates
write data to output file
*/

const fs = require('fs');
const extractor = require('./feature-extractor.js')

exports.process = (input, output) => {
//read data from input file and parse to JSON object
let data = JSON.parse(fs.readFileSync(input).toString());
console.log("Data is read from file: " + input);
//call module to convert array with parameter features
data.features = extractor.filter(data.features);

console.log("Writing data to the file: " + output);
//write JSON data of orginized coordinates array to same input file
fs.writeFileSync( output, JSON.stringify(data, null, 2));
console.log("Data is saved to: " + output);
//return true when no error incountered
return true;
}
