//module to find road segement direction

exports.find = (coordinates) => {
  //index points to last element in array
  let index = coordinates.length - 1;
  //calculate difference in x and y coordinates between 1st and last points of link
  let xDifference = coordinates[index][0] - coordinates[0][0];
  let yDifference = coordinates[index][1] - coordinates[0][1];
  //calculate angle of link using INVERSEtan()
  let tanTheta = Math.atan( Math.abs(yDifference / xDifference) );
  //switch to check in which quadrant the angle is so execute the right formula
  switch(true){
    case (xDifference >= 0 && yDifference >= 0):  //angle in 1st quadrant
      return tanTheta;
    case (xDifference < 0 && yDifference >= 0):  //angle in 2nd quadrant
      return (Math.PI - tanTheta);
    case (xDifference < 0 && yDifference < 0):  //angle in 3rd quadrant
      return (tanTheta - Math.PI);
    case (xDifference >= 0 && yDifference < 0):  //angle in 4th quadrant
      return (-tanTheta);
  }
}
