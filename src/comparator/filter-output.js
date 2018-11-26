//module to filter (delete duplicated data) output data (features) when duplication
// are next to each other. For random scattered duplication the code should include
// two for loops

const fs = require('fs');

exports.filterDuplication = (features) => {
  let i = 1; //index for loop
  while (i < features.length) { //loop till last element
    //compare id with perivious one, if identical delete and keep checking with next element
    if (features[i].properties.id === features[i-1].properties.id) {
      features.splice(i, 1); //delete element at position i
    } else {  //increament i only when id different
      i++;
    }
  }
  return features; //return processed features
}
