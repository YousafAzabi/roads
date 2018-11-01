//module to generate and return a message based on angles if are opposite direction

const tolerance = 170; //tolerance of road vector angles in Degree.
exports.tolerance = tolerance;

//========== format data to be written to file ==========
exports.isMismatch = (angleOne, angleTwo) => {
    //compare angle differnce falls in range to be considered opposite direction
    if ( (Math.abs(angleOne - angleTwo) >= tolerance )
      && (Math.abs(angleOne - angleTwo) <= (360 - tolerance)  ) ) {
      return true;
    }
  return false;
}
