//compare roads coordinates for overlap
const turf = require('@turf/turf');

//input coordinates of two roads, distance tolerance for turf.lineOverlap in kilometers, and
//percentage of overlap between OS & OSM.
exports.isOverlapping = (geometryOne, geometryTwo) => {
  const distToler = 0.004, overlapPercentage = 0.5;
  //calculate the overlap sections between OS and OSM road links
  const overlap = turf.lineOverlap(geometryOne, geometryTwo, {tolerance: distToler});
  //calculate length of overlap, OS and OSM links
  const len = turf.length(overlap);
  const lengthOne = turf.length(geometryOne);
  const lengthTwo = turf.length(geometryTwo);
  //compare length percentage of overlap of OS & OSM  roads if > overlapPercentage
  if ( ((len / lengthOne) > overlapPercentage) || ((len / lengthTwo) > overlapPercentage)) {
    return true;
  }
  return false;
}
