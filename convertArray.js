/* Script to convert coordinates array to be constructed of 2 element arrays.
   Reads data from file and make changes then save to the same file.
   The data is manpulated in the function deleteExtraBrackets */
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
//this is the input file to be fixed
path = "./inputY/test.json";

//read data from input file and parse to JSON object
data = JSON.parse(fs.readFileSync(path).toString());
console.log("Data is read from file: " + path);
//loop through all elements (features) in JSON data
for (let element of data.features) { 
  var newCoordinates = [];
  //delete extra brackets in coordinates array and save them
  deleteExtraBrackets(element.geometry.coordinates);
  element.geometry.coordinates = newCoordinates;
}
console.log("Writing data to the file: " + path);
//write JSON data of orginized coordinates array to same input file
fs.writeFileSync( path, JSON.stringify(data, null, 2));
console.log("Data is saved to: " + path);

// function to delete extra brackets in coordinates arrays
function deleteExtraBrackets(inputArray){
  //loop through array elements
  for (let temp of inputArray) {
    //check if first element is not array (no extra brucket) push to new array
    if (!Array.isArray(temp[0])) {
      newCoordinates.push(temp);
    } else { // if first element array loop call function again (recursion)
      deleteExtraBrackets(temp);
    }
  }
}
