//module to delete extra brackets in coordinates arrays
let output = [];
exports.delete = (input) => {
  //if input not an array or array is empty, return 0 (false)
  if ( (!Array.isArray(input)) || (input.length == 0) ) {
    return 0;
  }
  //loop through array elements
  for (let temp of input) {
    //check if first element is not array (no extra brucket) push to output array
    if (!Array.isArray(temp[0])) {
      output.push(temp);
    } else { //else element array call function again (recursion)
      delete(temp);
    }
  }
  return output; //return output array
}
