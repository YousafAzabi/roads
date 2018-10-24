//module to find distance between first node of two links

const turf = require('@turf/turf');
const _ = require('lodash');

exports.inRange = (roadOne, roadTwo, range = 1) => {
    if ( _.has(roadOne , "geometry.coordinates[0]") && _.has(roadTwo , "geometry.coordinates[0]")) {
      // find 1 point in first road
      const pointOne = roadOne.geometry.coordinates[0];
      // find 1 point in second road
      const pointTwo = roadTwo.geometry.coordinates[0];
      // find distance
      const distance = turf.distance(pointOne, pointTwo);
      // if longer than the range (in km) return false
      if (distance < range) {
        return true;
      }
    }
  return false;
}
