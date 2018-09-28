/*
input value is GIS data (features)
calls module to process coordinates array
returns output GIS data with processed coordinates array
*/

const fs = require('fs');
const brackets = require('./extra-brackets')
//this is the input file to be fixed
let path = "./InputY/codeOSM5.json";

//read data from input file and parse to JSON object
let data = JSON.parse(fs.readFileSync(path).toString());
let features = data.features;
console.log("Data is read from file: " + path);
//loop through all elements (features) in JSON data

for (let i = 0; i < features.length; i++) {
  // check if type is MultiLineString convert it to LineString
  if (features[i].geometry.type == "MultiLineString"){
    features[i].geometry.type = "LineString";
  }

  let coordinates = brackets.delete(features[i].geometry.coordinates);
  //check if coordinates are empty delete entry
  if (coordinates) {
    //delete extra brackets in coordinates array and save them
    data.features[i].geometry.coordinates = coordinates;
  } else {
    //delete element i form features
    data.features.splice(i,1);
  }
}

console.log("Writing data to the file: " + path);
//write JSON data of orginized coordinates array to same input file
fs.writeFileSync( path, JSON.stringify(data, null, 2));
console.log("Data is saved to: " + path);
