//module contains 3 functions compareNames, isOverlapping and inRange,
//all return boolean
const stringSimilarity = require('string-similarity');
const turf = require('@turf/turf');
const _ = require('lodash');

exports.compareNames  = (nameOne, nameTwo) => {
  nameOne = nameOne ? nameOne : '';
  nameTwo = nameTwo ? nameTwo : '';
  const similarRtn = stringSimilarity.compareTwoStrings(nameOne, nameTwo) > 0.6;
  return similarRtn && !!nameOne ;
}

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

exports.inRange = (roadOne, roadTwo, range = 1) => {
    if ( _.has(roadOne , "geometry.coordinates[0]") && _.has(roadTwo , "geometry.coordinates[0]")) {
      const pointOne = roadOne.geometry.coordinates[0]; // 1st point in 1st road
      const pointTwo = roadTwo.geometry.coordinates[0]; // 1st point in 2nd road
      const distance = turf.distance(pointOne, pointTwo); // calculate distance
      if (distance < range) { // if in range (in km) return true
        return true;
      }
    }
  return false;
}
