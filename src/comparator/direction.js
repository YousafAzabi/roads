//module has 2 function calculateAngle (calculates angle from coordinates)
//and isMismatch (checks if angles has opposite directions)

const turf = require('@turf/turf');

const tolerance = 10; //deviation from 180 degree.
exports.tolerance = tolerance; //export tolerance

//========== calculates angle from coordinates ==========
exports.calculateAngle = (coordinates) => {
  let index = coordinates.length - 1; //index points to last element in array
  //calculate difference in x and y coordinates between 1st and last points of link
  const xDifference = coordinates[index][0] - coordinates[0][0];
  const yDifference = coordinates[index][1] - coordinates[0][1];
  //calculate angle of link using INVERSEtan()
  let tanTheta = Math.atan( Math.abs(yDifference / xDifference) );
  //switch to check in which quadrant the angle is so execute the right formula
  switch(true){
    case (xDifference >= 0 && yDifference >= 0):  //angle in 1st quadrant
      tanTheta = tanTheta;
      break;
    case (xDifference < 0 && yDifference > 0):  //angle in 2nd quadrant
      tanTheta = (Math.PI - tanTheta);
      break;
    case (xDifference <= 0 && yDifference <= 0):  //angle in 3rd quadrant
      tanTheta = (tanTheta - Math.PI);
      break;
    case (xDifference > 0 && yDifference < 0):  //angle in 4th quadrant
      tanTheta = (-tanTheta);
  }
  //convert radian to degree, add 360 to convert -ve to +ve, and %360 to range 0 to 360
  return ((tanTheta * 180 / Math.PI) + 360 ) % 360;
}

//========== compare if two angles are in opposite direction ==========
exports.isOppositeDirection = (angleOne, angleTwo) => {
    //compare angle differnce falls in range to be considered opposite direction
    if ( (Math.abs(angleOne - angleTwo) >= (180 - tolerance) )
      && (Math.abs(angleOne - angleTwo) <= (180 + tolerance)  ) ) {
      return true;
    }
  return false;
}
