const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

path = "./inputY/codeOSM2.json";

//read data from input file and parse to JSON object
data = JSON.parse(fs.readFileSync(path).toString());
//loop through all elements (features) in JSON data
for(let i = 0 ; i < data.features.length - 1 ; i++){
  //delete extra brackets in coordinates array and save them
  data.features[i].geometry.coordinates =
    deleteExtraBrackets(data.features[i].geometry.coordinates);
}
console.log("writing data to the file.");
//write JSON data of orginized coordinates array to same input file
fs.writeFileSync( path, JSON.stringify(data, null, 2));
console.log("Data saved at: " + path;

// function to delete extra brackets in coordinates arrays
function deleteExtraBrackets(inputArray){
  let newCoordinates = [];
  //loop through array elements
  for (let i = 0 ; i < inputArray.length ; i++) {
    let temp = inputArray[i];
    //check if first element is not array (no extra brucket) push to new array
    if (!Array.isArray(temp[0])) {
      newCoordinates.push(inputArray[i]);
    } else { // if first element array loop through sub-array
      for (let j = 0 ; j < temp.length ; j++) {
        newCoordinates.push(temp[j]);
      }
    }
  }
  return newCoordinates;
}
