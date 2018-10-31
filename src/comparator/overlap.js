//compare roads coordinates for overlap
const turf = require('@turf/turf');

//input coordinates of two roads, distance tolerance for turf.lineOverlap in kilometers, and
//percentage of overlap between OS & OSM.
exports.isOverlapping = (coordinatesOne, coordinatesTwo, distToler = 0.004, overlapPercentage = 0.5) => {
  if (coordinatesOne.length && coordinatesTwo.length) { //check coordinates array not empty
    const turfRoad1 = turf.lineString(coordinatesOne); //convert OS coordinates to turf lineString
    const turfRoad2 = turf.lineString(coordinatesTwo); //convert OSM coordinates to turf lineString
    //calculate the overlap between roads, if length > 0 means there is match
    overlap = turf.lineOverlap(turfRoad1, turfRoad2, {tolerance: distToler});
    if (overlap.features.length > 0) {
      let len = 0;
      //loop to calcuate the length of overlap segements of same road
      for (let i = 0; i < overlap.features.length; i++) {
        len += turf.length(overlap);
      }
      //calculate length of OS and OSM roads
      let lengthOne = turf.length(turfRoad1);
      let lengthTwo = turf.length(turfRoad2);
      //compare length percentage of overlap of OS & OSM  roads if > overlapPercentage
      if ( ((len / lengthOne) > overlapPercentage) || ((len / lengthTwo) > overlapPercentage)) {
        return true;
      }
    }
  }
  return false;
}
