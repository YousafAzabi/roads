const turf = require('@turf/turf');
const _ = require('lodash/core');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const config = require('./direction-config.json');

let dataOS,
    dataOSM = [];

//Extract data from file
readFile = (path) => {
  return fs.readFileAsync(path); //return file data
}

//Write data to file
writeFile = (path, data) => {
  return fs.writeFileAsync(path, data); //return file data
}

//Extract data from each file
readAllFiles = () => {
  var promises = [];
  promises.push(readFile(config.inputFileOS)); //read in OS file first
  promises.push(readFile(config.inputFileOSM)); //read in OSM file second

  return Promise.all(promises); //return promise that is resolved when all files are done loading
}

//Create or append to output files specified in config file
createOutputFiles = () => {
  var promises = [];

  if (config.outputMode === "new") { //if user wants new output files
    promises.push(writeFile(config.outputFile, JSON.stringify({"roads": []}, null, 2)));
    return Promise.all(promises); //create new output files
  } else if (config.outputMode === "append"){
    return Promise.resolve(true); // else files already exist
  } else {
    return console.error("Please enter new or append for output mode on config file.");
  }
}

//Find the bearing angle of a given road segment
bearing = (road, inDirection) => {
  const point1 = turf.point(road.geometry.coordinates[0]) //first coord
  const point2 = turf.point(road.geometry.coordinates[road.geometry.coordinates.length-1]) //last coord
  let bearing; //bearing angle from first to last coord

  if (inDirection) {
    bearing = turf.bearing(point1, point2); //go in order of coordinates
  } else {
    bearing = turf.bearing(point2, point1); //go against order of coordinates
  }
  const newBearing = turf.bearingToAzimuth(bearing); //convert to 360deg angle
  return newBearing;
}

//Start parsing the data
createOutputFiles().then((res) => {
  readAllFiles().then((res) => {
    dataOS = JSON.parse(res[0].toString()); //parse OS data
    dataOSM = JSON.parse(res[res.length-1].toString()); //parse OSM data

    //for every OS road
    for (var i = 0; i < dataOS.roads.length; i++) {
      const roadOS = turf.flip(dataOS.roads[i]); //get coordinates into correct order [lat, long]
      let matchingRoads = []; //matching OSM road segments

      // for every OSM road
      for (var j = 0; j < dataOSM.roads.length; j++) {
        const roadOSM = turf.flip(dataOSM.roads[j]); //get coordinates into correct order [lat, long]
        //find matching road segments
        if (roadOS.properties.commonID === roadOSM.properties.commonID) {
          matchingRoads.push(roadOSM); //add matching road segment to array
        }
      }
      console.log("=============================================");
      console.log(`Comparing road ${i+1}: ${roadOS.properties.roadname}`);
      console.log("=============================================");

      let segmentsMatched = 0; //OSM road segments deemed to be a match
      let segmentsSkipped = 0; //OSM road segments skipped due to match uncertainty

      //for each OSM segmemt
      matchingRoads.map((road, index) => {

        const first = turf.point(road.geometry.coordinates[0]); //get first coord
        const last = turf.point(road.geometry.coordinates[road.geometry.coordinates.length-1]); //get last coord
        const line = turf.lineString(roadOS.geometry.coordinates[0]); //convert OS road to line
        const trimLine = turf.lineSlice(first, last, line); //trim OS line to length of OSM segment

        let osBearing = 0; //angle bearing from 1st to last coord of OS road
        let osmBearing = 0; //angle bearing from 1st to last coord of OSM road

        if (roadOS.properties.directionality === "in direction") { //if road is in same direction
          osBearing = bearing(trimLine, true);
        } else {
          osBearing = bearing(trimLine, false)
        }
        osmBearing = bearing(road, true)

        let diff = Math.abs(osBearing-osmBearing) % 360; //calculate difference between bearing angles
        let difference = diff > 180 ? 360 - diff : diff;

        if (osBearing === 0 || difference > 60) { //if clipped line is invalid or difference is over 90 deg
          segmentsSkipped++; //count segment as invalid and skip
        } else {
          segmentsMatched++; //count segment as a valid match
        }
        console.log(`Comparing Segment ${index+1}`);
        console.log(`OS Bearing: ${osBearing} degrees.`);
        console.log(`OSM Bearing: ${osmBearing} degrees.`);
      })
      console.log("=============================================");
      console.log(`${segmentsSkipped}/${matchingRoads.length} roads skipped. ${segmentsMatched}/${matchingRoads.length} roads matched.`);
      console.log(`=> Matched Segments: ${Math.floor((segmentsMatched/matchingRoads.length)*100)}%.`);
      console.log("=============================================\n\n");


      ////// Output File Formatting ////////
      if (((segmentsMatched/matchingRoads.length)*100)<60) { //if under 60% of segments have matched
        let newDataOS = JSON.parse(fs.readFileSync(config.outputFile).toString()); //read OS output file
        newDataOS.roads.push(dataOS.roads[i]); //push to the existing data
        fs.writeFileSync(config.outputFile, JSON.stringify(newDataOS, null, 2)); //write back to file
      }
      ////// End of Output File Formatting ////////

    }

  });
});
