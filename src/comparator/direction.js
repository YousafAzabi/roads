//module has 2 function calculateAngle (calculates angle from coordinates)
//and isMismatch (checks if angles has opposite directions)

const turf = require('@turf/turf');

const tolerance = 170; //tolerance of road vector angles in Degree.
exports.tolerance = tolerance;

exports.calculateAngle = (coordinates) => {
  let index = coordinates.length - 1; //index points to last element in array
  let angle;
  //calculate difference in x and y coordinates between 1st and last points of link
  let xDifference = coordinates[index][0] - coordinates[0][0];
  let yDifference = coordinates[index][1] - coordinates[0][1];
  //calculate angle of link using INVERSEtan()
  let tanTheta = Math.atan( Math.abs(yDifference / xDifference) );
  //switch to check in which quadrant the angle is so execute the right formula
  switch(true){
    case (xDifference >= 0 && yDifference >= 0):  //angle in 1st quadrant
      angle = tanTheta
      break;
    case (xDifference < 0 && yDifference > 0):  //angle in 2nd quadrant
      angle = (Math.PI - tanTheta);
      break;
    case (xDifference <= 0 && yDifference <= 0):  //angle in 3rd quadrant
      angle = (tanTheta - Math.PI);
      break;
    case (xDifference > 0 && yDifference < 0):  //angle in 4th quadrant
      angle = (-tanTheta);
  }
  return ((angle * 180 / Math.PI) + 360 ) % 360;
}

exports.isMismatch = (angleOne, angleTwo) => {
    //compare angle differnce falls in range to be considered opposite direction
    if ( (Math.abs(angleOne - angleTwo) >= tolerance )
      && (Math.abs(angleOne - angleTwo) <= (360 - tolerance)  ) ) {
      return true;
    }
  return false;
}
