/*
module to delete extra brackets in arrays mainly used for GIS coordinates array
array output format [[X1, Y1], [X2, Y2], [X3, Y3], .....[Xn, Yn]]
*/

exports.delete = (input, output = []) => {
  //if input not an array or array is empty, return 0 (false)
  if ( (!Array.isArray(input)) || (input.length == 0) ) {
    return [];
  }
  //loop through array elements
  for (let temp of input) {
    //check if first element is not array (no extra brucket) push to output array
    if (!Array.isArray(temp[0])) {
      output.push(temp);
    } else { //else element array call function again (recursion)
      output = this.delete(temp, output);
    }
  }
  return output; //return output array
}
