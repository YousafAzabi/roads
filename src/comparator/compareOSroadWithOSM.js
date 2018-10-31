const {inRange} = require('./distance.js');
const {compareNames} = require('./name.js');
const {isOverlapping} = require('./overlap.js');
const {calculateAngle} = require('./findAngle.js')
const {isMismatch} = require('./direction.js');

let matchesCounter;

conditions = (roadOS, roadOSM) => {
  const osName = roadOS.properties.name.slice(3, (roadOS.properties.name.length - 1));
  if ( compareNames(osName, roadOSM.properties.name) ) { //comapre if names matches
    if ( isOverlapping(roadOS.geometry.coordinates, roadOSM.geometry.coordinates) ) { //check if links overlap
      matchesCounter ++; //increment links' match counter
      let angleOS = calculateAngle(roadOS.geometry.coordinates); //find OS angle
      angleOS = roadOS.properties.direction ? angleOS : (angleOS + 180) % 360; //if opposite direction rotate 180
      let angleOSM = calculateAngle(roadOSM.geometry.coordinates); //find OSM angle
      return isMismatch(angleOS, angleOSM); //return true if mismatch occure
    }
  }
  return false;
}
exports.conditions = conditions;

exports.compareOSroadWithOSM = (roadOS, dataOSM, outputData) => {
  matchesCounter = 0; //reset counter for number of matches

  dataOSM.features
    .filter(roadOSM => inRange(roadOS, roadOSM))
    .forEach(roadOSM => {
      if (conditions(roadOS, roadOSM)) {
        let data = {
          "roadName": roadOSM.properties.name,
          "OSId": (roadOS.properties.id).toString(),
          "OSMId": (roadOSM.properties.id).toString(),
        };
        outputData.info.push(data);
        outputData.OS.push(roadOS);
        outputData.OSM.push(roadOSM);
      }
    });

  if (matchesCounter === 0) {
    matchesCounter = 'noMatch';
  } else if (matchesCounter === 1) {
    matchesCounter = 'oneMatch';
  } else {
    matchesCounter = 'multiMatch';
  }
  return matchesCounter;
}
