//module compares road links with 3 functions compareNames, isOverlapping and inRange,
//all return boolean

const stringSimilarity = require('string-similarity');
const turf = require('@turf/turf');
const _ = require('lodash');

exports.compareNames  = (nameOne, nameTwo) => {  //function compares two road names
  nameOne = nameOne ? nameOne : ''; //if 1st name empty set it to empty string
  nameTwo = nameTwo ? nameTwo : ''; //if 2nd name empty set it to empty string
  //check if both strings have simliarity greater than 60% then set it true
  const similarRtn = stringSimilarity.compareTwoStrings(nameOne, nameTwo) > 0.6;
  return similarRtn && !!nameOne ; // return true if simlirity > 60% and name not empty
}

exports.isOverlapping = (geometryOne, geometryTwo) => { //function comapres overlap between 2 road links
  //distToler is tolerance in km, overlapPercent is min acceptance ratio between overlap and road link
  const distToler = 0.004, overlapPercent = 0.5;
  //calculate the overlap sections between OS and OSM road links
  const overlap = turf.lineOverlap(geometryOne, geometryTwo, {tolerance: distToler});
  //calculate length of overlap, OS and OSM links
  const len = turf.length(overlap);
  const lengthOne = turf.length(geometryOne);
  const lengthTwo = turf.length(geometryTwo);
  //compare length percentage of overlap of OS & OSM  roads if > overlapPercent return true
  if ( ((len / lengthOne) > overlapPercent) || ((len / lengthTwo) > overlapPercent)) {
    return true;
  }
  return false;
}

exports.inRange = (roadOne, roadTwo, range = 1) => { //function compares if 2 road links are close together
  const pointOne = roadOne.geometry.coordinates[0]; //get 1st point in 1st road
  const pointTwo = roadTwo.geometry.coordinates[0]; //get 1st point in 2nd road
  const distance = turf.distance(pointOne, pointTwo); //calculate distance
  if (distance < range) { //if in range (in km) return true
    return true;
  }
  return false;
}
