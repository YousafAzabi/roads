//compare roads coordinates for overlap
const turf = require('@turf/turf');

const distToler = 0.004; //distance tolerance for turf.lineOverlap in kilometers.
const overlapPercentage = 0.5; //percentage of overlap between OS & OSM.

exports.compare = (roadOne, roadTwo) => {
  if (roadOne.length && roadTwo.length) { //check coordinates array not empty
    const turfRoad1 = turf.lineString(roadOne); //convert OS coordinates to turf lineString
    const turfRoad2 = turf.lineString(roadTwo); //convert OSM coordinates to turf lineString
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
