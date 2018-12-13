//module has 2 function: compareOSroadWithOSM that loop through OSM links,
//prepare output data in arrays and returns number of matches found in OSM for OS link
//isMismatch function compares two links and return true either if direction mismatch
//found or one link is two-way and other is one-way.

const {inRange, compareNames, isOverlapping} = require('./checker.js');
const {calculateAngle, isOppositeDirection} = require('./direction.js');

let matchesCounter; //counter for howmany matches found in OSM for each OS link
let angleOS, angleOSM;
//========== compare links, when match check if opposite direction ==========
isMismatch = (roadOS, roadOSM) => {
  const isOnewayOS = !!roadOS.properties.direction;
  const isOnewayOSM = !!roadOSM.properties.direction;
  if (!isOnewayOS && !isOnewayOSM) {
    matchesCounter = -1; //set value to increment two-way counter
    return false;
  }
  const osName = roadOS.properties.name.slice(3, (roadOS.properties.name.length - 1));
  if ( compareNames(osName, roadOSM.properties.name) ) { //comapre if names matches
    if ( isOverlapping(roadOS.geometry, roadOSM.geometry) ) { //check if links overlap
      matchesCounter ++; //increment links' match counter
      if (isOnewayOS ^ isOnewayOSM) {
        return true;
      } else {
        angleOS = calculateAngle(roadOS.geometry.coordinates); //find OS angle
        angleOS = (roadOS.properties.direction == 1) ? angleOS : (angleOS + 180) % 360; //if link direction is opposite rotate 180
        angleOSM = calculateAngle(roadOSM.geometry.coordinates); //find OSM angle
        return isOppositeDirection(angleOS, angleOSM); //return true if mismatch occure
      }
    }
  }
  return false;
}
exports.isMismatch = isMismatch; //export inner function for unit testing

//========== loops through OSM data ==========
exports.compareOSroadWithOSM = (roadOS, dataOSM, outputData) => {
  matchesCounter = 0; //reset counter for number of matches

  dataOSM.features
    .filter(roadOSM => inRange(roadOS, roadOSM))  //filter features that are in range
    .forEach(roadOSM => {  //loop through filter features in range
      if (isMismatch(roadOS, roadOSM)) { //check return value of call to inner function that compare links
        const data = { //create object for output file
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
  } else if (matchesCounter === -1) { //if -1 set to 'twowayRoad'
    matchesCounter = 'twoway';
  } else { //else set to 'multiMatch'
    matchesCounter = 'multiMatch';
  }
  return matchesCounter; //return string
}
