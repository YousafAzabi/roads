//module has 2 function: compareOSroadWithOSM that loop through OSM links,
//prepare output data in arrays and returns number of matches found in OSM for OS link
//linkComparisions function compares two links and return true if direction mismatch found

const {inRange} = require('./checker.js');
const {compareNames} = require('./checker.js');
const {isOverlapping} = require('./checker.js');
const {calculateAngle} = require('./direction.js');
const {isMismatch} = require('./direction.js');

let matchesCounter; //counter for howmany matches found in OSM for each OS link

//========== compare links, when match check if opposite direction ==========
linkComparisions = (roadOS, roadOSM) => {
  const osName = roadOS.properties.name.slice(3, (roadOS.properties.name.length - 1));
  if ( compareNames(osName, roadOSM.properties.name) ) { //comapre if names matches
    if ( isOverlapping(roadOS.geometry, roadOSM.geometry) ) { //check if links overlap
      matchesCounter ++; //increment links' match counter
      let angleOS = calculateAngle(roadOS.geometry.coordinates); //find OS angle
      angleOS = roadOS.properties.direction ? angleOS : (angleOS + 180) % 360; //if link direction is opposite rotate 180
      let angleOSM = calculateAngle(roadOSM.geometry.coordinates); //find OSM angle
      return isMismatch(angleOS, angleOSM); //return true if mismatch occure
    }
  }
  return false;
}
exports.linkComparisions = linkComparisions; //export inner function for unit testing

//========== loops through OSM data ==========
exports.compareOSroadWithOSM = (roadOS, dataOSM, outputData) => {
  matchesCounter = 0; //reset counter for number of matches

  dataOSM.features
    .filter(roadOSM => inRange(roadOS, roadOSM))  //filter features that are in range
    .forEach(roadOSM => {  //loop through filter features in range
      if (linkComparisions(roadOS, roadOSM)) { //check return value of call to inner function that compare links
        let data = { //create object for output file
          "roadName": roadOSM.properties.name,
          "OSId": (roadOS.properties.id).toString(),
          "OSMId": (roadOSM.properties.id).toString(),
        };
        outputData.info.push(data);  //push object to info array
        outputData.OS.push(roadOS);  //push OS link to OS array
        outputData.OSM.push(roadOSM);  //push OSM link to OSM array
      }
    });

  if (matchesCounter === 0) { //if number of matches ZERO set to 'noMatch'
    matchesCounter = 'noMatch';
  } else if (matchesCounter === 1) { //if number of matches ONE set to 'oneMatch'
    matchesCounter = 'oneMatch';
  } else { //else set to 'multiMatch'
    matchesCounter = 'multiMatch';
  }
  return matchesCounter; //return string
}
