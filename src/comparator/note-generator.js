//module to generate and return a message based on angles if are opposite direction

const tolerance = 170; //tolerance of road vector angles in Degree.
exports.tolerance = tolerance;

//========== format data to be written to file ==========
exports.generate = (angleOne, angleTwo) => {
  //compare angle presence for road segments from OS & OSM
  let text = '';
  if ( !isNaN(angleOne) && isNaN(angleTwo) ) {
    text =  'OS oneway & OSM twoway';
  } else if( isNaN(angleOne) && !isNaN(angleTwo) ) {
    text =  'OS twoway & OSM oneway';
  } else if( !isNaN(angleOne) && !isNaN(angleTwo) ) {
    //compare angle differnce falls in range to be considered opposite direction
    if ( (Math.abs(angleOne - angleTwo) >= tolerance )
      && (Math.abs(angleOne - angleTwo) <= (360 - tolerance)  ) ) {
      text = 'OS ' + angleOne + ' OSM ' + angleTwo + ' direction mismatch';
    }
  }
  return text;
}
