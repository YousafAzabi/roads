//convert angle from radian to degree
exports.convert = (angle) => {
  if( isNaN(angle) ) {
    throw 'ERROR! Input parameter must be a number (angle).';
  }
  //convert to Degree then add 360 and % 360 to convert value in range (0-360)
  return ((angle * 180 / Math.PI) + 360 ) % 360;
}
