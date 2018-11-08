/*
module to delete extra brackets in arrays. used to convert multiLineString to lineString
array output format [[X1, Y1], [X2, Y2], [X3, Y3], .....[Xn, Yn]]
*/

exports.delete = (input) => {
  let output = [];
  if (!Array.isArray(input)) { //if input not an array return empty array []
    return output;
  }
  //loop through array elements
  for (let temp of input) {
    //check if first element is not array (no extra brucket) push to output array
    if (!Array.isArray(temp[0])) {
      output.push(temp);
    } else { //else element is array, cocatenate to output array
      output = output.concat(temp);
    }
  }
  return output; //return output array
}
