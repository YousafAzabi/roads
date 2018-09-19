/* script to find roads match between OS and OSM datasets by comparing
Name and if a match found the coordinates are compared to verify the match
then the overlap section length is compared with both roads from OS & OSM
to reduce the posibility of error.
The code extended to compare oneway roads and find directionality mismatch
between the two datasets. The data is saved to output files.
The input files format is JSON and the procdure to produce them is explained
in ReadMe file in the the sub directory InputY.
Input and output files names and folders are defined in comparator-config.js
edit the file to set preferences*/

const turf = require('@turf/turf');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('./comparator-config.json');
const tm = require('./timeprinter'); //to print time in **h:**m:**s format

const distToler = 0.004; //distance tolerance for turf.lineOverlap in kilometers.
const angleTolerance = 170; //tolerance of road vector angles in Degree.
const overlapPercentage = 0.5; //percentage of overlap between OS & OSM.

let dataOS, dataOSM = [];
let onewayArray = [];
let arrayOS = [];
let arrayOSM = [];
let totalTime = new Date();
//uncomment to initialise to use in code to write to file road matches
//let roadMatchesInOSM, matchedData = [];

console.log('\n\t\t*****\t Script started at ' +
            new Date().toTimeString().slice(0,8) + ' \t*****\n');

// === Extract data from file ===========================
readFile = (path) => {
  return fs.readFileAsync(path); //return file data
}

// === Write data to file ================================
writeFile = (path, data) => {
  return fs.writeFileAsync(path, data); //return file data
}

//  === Extract data from each file =======================
readAllFiles = () => {
  var promises = [];
  promises.push(readFile(config.inputFileOS)); //read in OS file first
  promises.push(readFile(config.inputFileOSM)); //read in OSM file second
  return Promise.all(promises); //return promise that is resolved when all files are done loading
}

// === Create or append to output files specified in config file ====
createOutputFiles = () => {
  var promises = [];

  if (config.outputMode === "new") { //if user wants new output files
    promises.push(writeFile(config.outputFile, JSON.stringify({"roads": []}, null, 2)));
    return Promise.all(promises); //create new output files
  } else if (config.outputMode === "append") {
    return Promise.resolve(true); // else files already exist
  } else {
    return console.error("Please enter new or append for output mode.");
  }
}

// === Start comparing data sets ======================
createOutputFiles().then((res) => {
  readAllFiles().then((res) => {

    // counters for number of road matches
    let zeroCounter = oneCounter = multiCounter = noNameCounter = 0;

    //dataOS = JSON.parse(res[0].toString()); //parse OS data
    dataOSM = JSON.parse(res[res.length-1].toString()); //parse OSM data

    console.log("Total nubmer of roads in OS are: " + dataOS.length + //**** features
                ", and in OSM are: " +  dataOSM.features.length);

    // for loop OS road
    for (let roadOS of dataOS) { //**** features
      roadOS = convertToGIS(roadOS); //**** uncomment
      //compare retun number of matches
      switch(compareRoadsName(roadOS)) {
        case -1:
          noNameCounter++;
          break;
        case 0:
          zeroCounter++;
          break;
        case 1:
          oneCounter++;
          //uncomment to write one-match roads to file but change writeOutput
          //writeOutput(matchedData, roadOS, roadMatchesInOSM);
          break;
        default:
          multiCounter++;
          //uncomment to write multi-match roads to file but change writeOutput
          //writeOutput(matchedData, roadOS, roadMatchesInOSM);
      }
    }
    //write data to output file
    //uncomment to write road matches array to file
    //fs.writeFileAsync( config.outputFile, JSON.stringify(matchedData, null, 2));
    fs.writeFileAsync( config.outputFile, JSON.stringify(onewayArray, null, 2));
    //write oneway mismatched OS road
    const outputOS = { "type": "FeatureCollection",
                       "features": arrayOS};
    fs.writeFileAsync(config.mismatchOS, JSON.stringify(outputOS, null, 2));
    //write oneway mismatched OSM road
    const outputOSM = { "type": "FeatureCollection",
                        "features": arrayOSM};  //change arrayOSM with addRoadOSM(null)
    fs.writeFileAsync(config.mismatchOSM, JSON.stringify(outputOSM, null, 2));
    //write on console number of matches report
    printReport(zeroCounter, oneCounter, multiCounter, noNameCounter);
    tm.print('\t\tTotal time taken: \t', new Date() - totalTime);
  });
});

//compare names of the roads for match betwwen OS and OSM
compareRoadsName = (roadOS) => {
  let roadNameOS = roadOS.properties.roadname ? roadOS.properties.roadname : "";
  // extract name and convert to lower case
  // roadNameOS = roadNameOS.slice(3,roadNameOS.length-1).toLowerCase(); //**** comment
  let roadNameOSM;
  let matchNameCounter = matchCoordinatesCounter = 0;
  //if road has no name in OS then retrun without comparing
  //comment this IF statement to compare names without names as well.
  if (roadNameOS == "") {
    return -1;
  }
  //uncomment to reset for use in code to write to file road matches
  //roadMatchesInOSM = [];
  // for loop every OSM road
  for (let roadOSM of dataOSM.features) {
    // extract street name in OSM data
    //let roadOSM = dataOSM.features[j];
    roadNameOSM = roadOSM.properties.name ? roadOSM.properties.name.toLowerCase() : "";
    //comapre names of OS and OSM, increase NAME counter if matched
    if (roadNameOS == roadNameOSM) {
      matchNameCounter ++;
      //compare for overlap, increment COORDINATES counter if matched
      if ( compareRoadsForOverlap(roadOS, roadOSM) ) {
        matchCoordinatesCounter ++;
        let angleOS = isOnewayOS(roadOS);
        let angleOSM = isOneWayOSM(roadOSM);
        //compare angle presence for road segments from OS & OSM
        if ((angleOS != NaN) && (angleOSM == NaN)) {
          writeOutput(onewayArray, roadOS, roadOSM, "OS oneway & OSM twoway");
        } else if((angleOS == NaN) && (angleOSM != NaN)) {
          writeOutput(onewayArray, roadOS, roadOSM, "OS twoway & OSM oneway");
        } else if((angleOS != NaN) && (angleOSM != NaN)) {
          //compare angle differnce falls in range to be considered opposite direction
          if ( (Math.abs(angleOS - angleOSM) > angleTolerance)
            && (Math.abs(angleOS - angleOSM) < (360 - angleTolerance)) ) {
            writeOutput(onewayArray, roadOS, roadOSM, "OS " + angleOS + "  OSM " +
                  angleOSM + "  direction mismatch");
            onewayMismatchCount(1);
          }
        }
        //uncomment to write osm_id of roads to relevant match in OS in file
        //roadMatchesInOSM.push(roadOSM.properties.osm_id);
      }
    }
  }
  //return number of road matches from OSM for every OS road
  // can be changed to matchNameCounter to get report about NAME matches
  return matchCoordinatesCounter;
}

//compare roads coordinates for overlap
compareRoadsForOverlap = (roadOS, roadOSM) => {
  if((roadOS.geometry.coordinates != NaN) && (roadOSM.geometry.coordinates != NaN)) {
    const turfRoad1 = turf.lineString(roadOS.geometry.coordinates); //convert OS road to turf linestring
    const turfRoad2 = turf.lineString(roadOSM.geometry.coordinates); //convert OSM road to turf linestring
    //calculate the overlap between roads, if length > 0 means there is match
    overlap = turf.lineOverlap(turfRoad1, turfRoad2, {tolerance: distToler});
    if(overlap.features.length > 0){
      let len = 0;
      //loop to calcuate the length of overlap segements of same road
      for (let i = 0; i < overlap.features.length; i++) {
        len += turf.length(overlap);
      }
      //calculate length of OS and OSM roads
      let lengthOS = turf.length(roadOS);
      let lengthOSM = turf.length(roadOSM);
      //compare length percentage of overlap of OS & OSM  roads if > overlapPercentage
      if( ((len / lengthOS) > overlapPercentage) || ((len / lengthOSM) > overlapPercentage)) {
        return true;
      }
    }
  }
  return false;
}

// find if OS road is oneway
isOnewayOS = (roadOS) => {
  let direction = roadOS.properties.directionality ? roadOS.properties.directionality : "";
  if ( (direction.search("in") != -1) && (roadOS.properties.formofway.search("Single") != -1) ) {
    //onewayCounterOS ++;
    let angle = findDirectionAngle(roadOS.geometry.coordinates);
    if(roadOS.properties.directionality.search("opposite") != -1) {
      //opposite direction so add 180 to change directionilty, % 360 to range (0-360)
      angle = (angle + 180) % 360;
    }
    return angle;
  }
  return NaN;
}

// find if OSM road is oneway
isOneWayOSM = (roadOSM) => {
  // find oneway tag and extract it from the string "other_tags" in OSM JSON data
  if(roadOSM.properties.other_tags) {
    // check if private vehicles restricted from accessing road
    if(roadOSM.properties.other_tags.search('motor_vehicle"=>"no') != -1) {
      return NaN;
    }
    //set index to point at oneway word
    let index = roadOSM.properties.other_tags.search("oneway\"=>");
    //check if search finds "oneway" substring and if first letter is n or y for no and yes respectively.
    if(index != -1 && roadOSM.properties.other_tags.charAt(index+10).toLowerCase() == "y") {
      return findDirectionAngle(roadOSM.geometry.coordinates);
    }
  }
    //return NaN to function call so the road is not oneway
    return NaN;
}

//  ==== Start finding Direction of oneway roads ==================
findDirectionAngle = (roadCoordinates) => {
      /*//choose coordinate which overlap only.
      let newRoad = mapCoordiante(roadCoordinates);
      let newCoordinates = newRoad.geometry.coordinates;
      let index = newCoordinates.length - 1;*/
  let index =roadCoordinates.length - 1;
  //calculate difference in x and y coordinates between 1st and last points of link
  let xDifference = roadCoordinates[index][0] - roadCoordinates[0][0];
  let yDifference = roadCoordinates[index][1] - roadCoordinates[0][1];
  //calculate angle of link using INVERSEtan()
  let tanTheta = Math.atan(Math.abs(yDifference/xDifference));
  //switch to check in which quadrant the angle is so execute the right formula
  switch(true){
    case (xDifference >= 0 && yDifference >= 0):  //angle in 1st quadrant
      return convertToDegree(tanTheta);
      break;
    case (xDifference < 0 && yDifference >= 0):  //angle in 2nd quadrant
      return convertToDegree(Math.PI - tanTheta);
      break;
    case (xDifference < 0 && yDifference < 0):  //angle in 3rd quadrant
      return convertToDegree(tanTheta - Math.PI);
      break;
    case (xDifference >= 0 && yDifference < 0):  //angle in 4th quadrant
      return convertToDegree(-tanTheta);
      break;
  }
}

/*//map coordinates of road to overlap overlapSection
mapCoordiante = (roadCoordinates) => {
  let indexOverlap = overlap.features.length - 1;
  let indexCoordinate = overlap.features[indexOverlap].geometry.coordinates.length - 1;
  let startPoint = overlap.features[0].geometry.coordinates[0];
  let endPoint = overlap.features[indexOverlap].geometry.coordinates[indexCoordinate];
  let line = turf.lineString(roadCoordinates);
  let pointOne = turf.nearestPointOnLine(line, startPoint);
  let pointTwo = turf.nearestPointOnLine(line, endPoint);
  return turf.lineSlice(pointOne, pointTwo, line);
//let temp = turf.lineSlice(pointOne, pointTwo, line);
  //console.log("\n\n"+ JSON.stringify(temp) +" \n\t "+ pointOne.geometry.coordinates + "\n\t" + pointTwo.geometry.coordinates);
}*/

//convert angle from radian to degree
convertToDegree = (angle) => {
  //convert to Degree then add 360 and % 360 to convert value in range (0-360)
  return (((angle * (180 / Math.PI)) + 360 ) % 360);
}

//write data to array then retrun for output file
writeOutput = (array, roadOS, roadOSM, Note) => {
  let data = {
    "roadName": roadOS.properties.roadname.slice(3,roadOS.properties.roadname.length-1),
    "OSId": (roadOS.properties.localid).toString(),
    "OSMId": roadOSM.properties.osm_id,
    "note": Note
  };

  array.push(data);
  arrayOS.push(roadOS);
  arrayOSM.push(roadOSM);
  //addRoadOSM(roadOSM);
}

printReport = (zeroCounter, oneCounter, multiCounter, noNameCounter) => {
  console.log("Number of roads from OS with NO match in OSM: \t\t" + zeroCounter);
  console.log("Number of roads from OS with ONE match in OSM: \t\t" + oneCounter);
  console.log("Number of roads from OS with MULTIPLE match in OSM: \t" + multiCounter);
  console.log("Number of roads without a name in OS: \t\t\t" + noNameCounter);
  console.log("Number of ONEWAY mismatchbetween OS and OSM: \t\t" + onewayMismatchCount());
}

/*var addRoadOSM = (function() {
                var arrayOSM = [];
                return function(roadOSM) {
                        if (roadOSM != null){
                          arrayOSM.push(roadOSM)
                        }
                        return arrayOSM;
                      }
})();*/

//closure to keep track of oneway road mismatches
var onewayMismatchCount = ( () => {
                        var count = 0;
                        return (value) => {
                            if(value) count += value;
                            return count;
                          }
})();

//****
convertToGIS = (road) => {
  switch (road.way){
    case 1:
      way = 'Single Carriageway';
      break;
    case 2:
      way = 'Dual Carriageway';
      break;
    case 0:
      way = '';
  }
  switch (road.dir){
    case 1:
      dir = 'in direction';
      break;
    case -1:
      dir = 'in opposite direction';
      break;
    case 0:
      dir = 'both directions';
      break;
    default :
      dir = '';
  }
  return ({
    "type": "Feature",
    "properties": {
      "localid": road.i,
      "roadname": road.n,
      "formofway": way,
      "directionality": dir
    },
    "geometry": {
      "type": "LineString",
      "coordinates": road.coor
    }
  });
}
