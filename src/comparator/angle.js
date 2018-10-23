//module to calculate and return angle in degrees

const direction = require('./direction.js');
const toDegree = require('./to-degree.js');

exports.calculate = (coordinates) => {
  const angle = direction.find(coordinates); //find angle
  if ( isNaN(angle) ) { //check if not a number
    return NaN;
  }
  return toDegree.convert(angle); //convert to degree
}
