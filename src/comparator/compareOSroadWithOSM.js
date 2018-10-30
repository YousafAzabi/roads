const distance = require('./distance.js');
const name = require('./name.js');
const overlap = require('./overlap.js');
const angle = require('./angle.js')
const nt = require('./note-generator.js');
const data = require('./data.js');

let matchesCounter;

conditions = (roadOS, roadOSM) => {
  const osName = roadOS.properties.name.slice(3, (roadOS.properties.name.length - 1));
  if ( name.compare(osName, roadOSM.properties.name) ) { //comapre names of OS and OSM
    if ( overlap.compare(roadOS.geometry.coordinates, roadOSM.geometry.coordinates) ) { //check if links overlap
      matchesCounter ++; //increment links' match counter
      let angleOS = angle.calculate(roadOS.geometry.coordinates); //find OS angle
      angleOS = roadOS.properties.direction ? angleOS : (angleOS + 180) % 360; //opposite direction rotate 180
      let angleOSM = angle.calculate(roadOSM.geometry.coordinates); //find OSM angle
      return nt.generate(angleOS, angleOSM); //generate note if mismatch occure
    }
  }
  return false;
}
exports.conditions = conditions;

exports.compare = (roadOS, dataOSM, outputData) => {
  matchesCounter = 0; //reset counter for number of matches
  for (let roadOSM of dataOSM.features) { //loop OSM links
    if (!distance.inRange(roadOS, roadOSM)) { //if links faraway from each other go to next
      continue;
    }
    note = conditions(roadOS, roadOSM);
    if (note) {
      outputData.info.push(data.format(roadOS, roadOSM, note));
      outputData.OS.push(roadOS);
      outputData.OSM.push(roadOSM);
    }
  }
  if (matchesCounter === 0) {
    matchesCounter = 'noMatch';
  } else if (matchesCounter === 1) {
    matchesCounter = 'oneMatch';
  } else {
    matchesCounter = 'multiMatch';
  }
  return matchesCounter;
}
