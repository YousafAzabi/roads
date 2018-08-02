/* script to find roads match between OS and OSM dtatsets by comparing
Name and if a match found the coordinates are compared to verify the match.
The code extended to compare oneway roads and find directionality mismatch
betwwen to datasets. The data is saved to output file.
The input file format is JSON and the procdure to produce the data is explained
in ReadMe file in the the sub directory InputY*/

const turf = require('@turf/turf');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('./comparator-config.json');

const distToler = 0.004; //distance tolerance for turf.lineOverlap in kilometers.
const angleTolerance = 170; //tolerance of road vector angles in Degree

let onewayMismatchCount = 0;
let dataOS, dataOSM = [];
let onewayArray = [];
let arrayOS = [];
let arrayOSM = [];
//uncomment to initialise to use in code to write to file road matches
//let roadMatchesInOSM, matchedData = [];
let angleOS;
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
  } else if (config.outputMode === "append"){
    return Promise.resolve(true); // else files already exist
  } else {
    return console.error("Please enter new or append for output mode.");
  }
}

// === Start comparing data sets ======================
createOutputFiles().then((res) => {
  readAllFiles().then((res) => {

    dataOS = JSON.parse(res[0].toString()); //parse OS data
    dataOSM = JSON.parse(res[res.length-1].toString()); //parse OSM data

    const numOfRoadsOS = dataOS.features.length; //number of OS roads to check
    const numOfRoadsOSM = dataOSM.features.length; //number of OS roads to check

    console.log("Total numer of roads in OS are: " + numOfRoadsOS + ", and in OSM are: " +  numOfRoadsOSM);

    // counters for number of road matches
    let zeroCounter = oneCounter = multiCounter = noNameCounter = 0;

    // for loop OS road
    for (var i = 0; i < numOfRoadsOS; i++) {
      let roadOS = dataOS.features[i];
      angleOS = isOnewayOS(roadOS);
      //compare retun number of matches
      switch(compareRoadsName(roadOS, numOfRoadsOSM)) {
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
      //uncomment this line to show roads comapred progess on screen
      console.log( "Progress: " + (i+1) + " of " + numOfRoadsOS);
    }
    //write data to output file
    //uncomment to write road matches array to file
    //fs.writeFileAsync( config.outputFile, JSON.stringify(matchedData, null, 2));
    fs.writeFileAsync( config.outputFile, JSON.stringify(onewayArray, null, 2));
    fs.writeFileAsync(config.mismatchOS,'{\n\t"type": "FeatureCollection",\n\t"features": ' +
                      JSON.stringify(arrayOS, null, 2) + '}');
    fs.writeFileAsync(config.mismatchOSM,'{\n\t"type": "FeatureCollection",\n\t"features": ' +
                      JSON.stringify(arrayOSM, null, 2) + '}');
    printReport(zeroCounter, oneCounter, multiCounter, noNameCounter);
  });
});

//compare names of the roads for match betwwen OS and OSM
compareRoadsName = (roadOS, numOfRoadsOSM) => {
  let roadNameOS = roadOS.properties.roadname ? roadOS.properties.roadname : "";
  // extract name and convert to lower case
  roadNameOS = roadNameOS.slice(3,roadNameOS.length-1).toLowerCase();
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
  for (var j = 0; j < numOfRoadsOSM; j++) {
    // extract street name in OSM data
    let roadOSM = dataOSM.features[j];
    roadNameOSM = roadOSM.properties.name ? roadOSM.properties.name.toLowerCase() : "";
    //comapre names of OS and OSM, increase NAME counter if matched
    if (roadNameOS == roadNameOSM) {
      matchNameCounter ++;
      //compare for overlap, increment COORDINATES counter if matched
      if ( compareRoadsForOverlap(roadOS, roadOSM) ) {
        matchCoordinatesCounter ++;
        let angleOSM = isOneWayOSM(roadOSM);
        //compare angle presence for road segments from OS & OSM
        if ((angleOS != NaN) && (angleOSM == NaN)) {
          writeOutput(onewayArray,roadOS,roadOSM,"OS oneway & OSM twoway");
        } else if((angleOS == NaN) && (angleOSM != NaN)){
          writeOutput(onewayArray,roadOS,roadOSM,"OS twoway & OSM oneway");
        } else if((angleOS != NaN) && (angleOSM != NaN)){
          //compare angle differnce falls in range to be considered opposite direction
          if ( (Math.abs(angleOS - angleOSM) > angleTolerance)
            && (Math.abs(angleOS - angleOSM) < (360 - angleTolerance)) ) {
            writeOutput(onewayArray,roadOS,roadOSM,"OS " + angleOS + "  OSM " +
                  angleOSM + "  direction mismatch");
            onewayMismatchCount++;
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
  if((roadOS.geometry.coordinates != NaN) && (roadOSM.geometry.coordinates != NaN)){
    const turfRoad1 = turf.lineString(roadOS.geometry.coordinates); //convert OS road to turf linestring
    const turfRoad2 = turf.lineString(roadOSM.geometry.coordinates); //convert OSM road to turf linestring
    //if length > 0 means there is match
    let overlap = turf.lineOverlap(turfRoad1, turfRoad2, {tolerance: distToler});
    if(overlap.features.length > 0){
      //let line = turf.lineString(overlap.features[0].geometry.coordinates);
      //let len = turf.length(line, {unit: 'kilometers'});
      //if(len > 0.005){
        return true;
      //}
    }
  }
  return false;
}

// find if OS road is oneway
isOnewayOS = (roadOS) => {
  let direction = roadOS.properties.directionality ? roadOS.properties.directionality : "";
  if( (direction.slice(0,2) == "in") && (roadOS.properties.formofway == "Single Carriageway")){
    //onewayCounterOS ++;
    let angle = onewayDirection(roadOS.geometry.coordinates);
    if(roadOS.properties.directionality == "in opposite direction"){
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
  if(roadOSM.properties.other_tags){
    //set index to point at oneway word
    let index = roadOSM.properties.other_tags.search('oneway"=>');
    //check if search finds "oneway" substring and if first letter is n or y for no and yes respectively.
    if(index != -1 && roadOSM.properties.other_tags.charAt(index+10).toLowerCase() == "y"){
      return onewayDirection(roadOSM.geometry.coordinates);
    }
  }
    return NaN;
}

//  ==== Start finding Direction of oneway roads ==================
onewayDirection = (roadCoordinates) => {
  let index = roadCoordinates.length - 1;
  //calculate difference in x and y coordinates between 1st and last points of link
  let xDifference = roadCoordinates[1][0] - roadCoordinates[0][0];
  let yDifference = roadCoordinates[1][1] - roadCoordinates[0][1];
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

//convert angle from radian to degree
convertToDegree = (angle) => {
  //convert to Degree then add 360 and % 360 to convert value in range (0-360)
  return (((angle * (180 / Math.PI)) + 360 ) % 360);
}

//write data to array then retrun for output file
writeOutput = (array, roadOS, roadOSM,Note) => {
  let data = {
    "roadName": roadOS.properties.roadname.slice(3,roadOS.properties.roadname.length-1),
    "OSId": (roadOS.properties.localid).toString(),
    "OSMId": roadOSM.properties.osm_id,
    "note": Note
  };

  array.push(data);
  arrayOS.push(roadOS);
  arrayOSM.push(roadOSM);
}

printReport = (zeroCounter, oneCounter, multiCounter, noNameCounter) => {
  console.log("Number of roads from OS with NO match in OSM: \t\t" + zeroCounter);
  console.log("Number of roads from OS with ONE match in OSM: \t\t" + oneCounter);
  console.log("Number of roads from OS with MULTIPLE match in OSM: \t" + multiCounter);
  console.log("Number of roads without a name in OS: \t\t\t" + noNameCounter);
  console.log("Number of ONEWAY mismatchbetween OS and OSM: \t\t" + onewayMismatchCount);
}
