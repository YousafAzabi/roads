//split maps to smaller areas has its paramter INPUT FILE NAME

exports.setDimensions = (id, arr) => {
  let mid;
  let [x1, y1, x2, y2] = arr;
  if ( (arr.length != 4) || (!Number.isInteger(id)) ) {
    throw 'ERROR! Parameter input error.'
  }
  if ( (x1 > x2) || (y1 > y2) ){
    throw 'ERROR! Second coordinates are smaller than first one.';
  }
  if ( ! (Math.floor(Math.log2(id)) % 2) ) { //testing number in which 2^x group
    mid = (y1 + y2) / 2;
  } else{
    mid = (x1 + x2) / 2;
  }
  arr.push(mid);
  return (id, arr); //return segemenet id and coordinates array with mid valuea
}
