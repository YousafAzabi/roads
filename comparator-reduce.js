/*
script to find roads match between OS and OSM datasets by comparing
Name and if a match found the coordinates are compared to verify the match
then the overlap section length is compared with both roads from OS & OSM
to reduce the posibility of error.
The code extended to compare oneway roads and find directionality mismatch
between the two datasets. The data is saved to output files.
The input files format is JSON and the procdure to produce them is explained
in ReadMe file in the the sub directory InputY.
Input and output files names and folders are defined in comparator-config.js
edit the file to set preferences.
*/

const turf = require('@turf/turf');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs')); //to use file system
const readline = require('readline'); //to read file lien by line
const stream = require('stream'); //to create stream for read line
const config = require('./comparator-config.json');
const tm = require('./timeprinter'); //to print time in **h:**m:**s format

const distToler = 0.004; //distance tolerance for turf.lineOverlap in kilometers.
const angleTolerance = 170; //tolerance of road vector angles in Degree.
const overlapPercentage = 0.5; //percentage of overlap between OS & OSM.

let dataOSM = [];
let onewayArray = [];
let arrayOS = [];
let arrayOSM = [];
let totalTime = new Date();
//uncomment to initialise to use in code to write to file road matches
//let roadMatchesInOSM, matchedData = [];

console.log('\n\t\t*****\t Script started at ' +
            new Date().toTimeString().slice(0,8) + ' \t*****\n');

//  === Extract data from each file =======================
readAllFiles = (callback) => {
  fs.readFile(config.inputFileOSM, (err, data) => {
    if (err) throw err;
    dataOSM = JSON.parse(data); //read in OSM file second
    callback();
  });
}

// === Create or append to output files specified in config file ====
createOutputFiles = () => {
  var promises = [];
  if (config.outputMode === "new") { //if user wants new output files
    promises.push(fs.writeFileAsync(config.outputFile, JSON.stringify({"roads": []}, null, 2)));
    return Promise.all(promises); //create new output files
  } else if (config.outputMode === "append") {
    return Promise.resolve(true); // else files already exist
  } else {
    return console.error("Please enter new or append for output mode.");
  }
}

// === Start comparing data sets ======================
createOutputFiles().then((res) => {
  readAllFiles(() => {
    const instream = fs.createReadStream(config.inputFileOS); //create input stream
    const outstream = new stream(); // create output stream
    const rl = readline.createInterface(instream, outstream); //create channel to read lines

    // counters for number of road matches
    let zeroCounter = oneCounter = multiCounter = noNameCounter = 0;
    let roadOS = "";
    //dataOS = JSON.parse(res[0].toString()); //parse OS data
    //dataOSM = res[0].toString(); //parse OSM data

    //console.log("Total nubmer of roads in OSM are: " +  dataOSM.features.length);

    rl.on('line', function (line) { //read line by line function
      if(line[2] == 'i'){ //check if line is road link
        if(line[line.length - 1] == ','){ //check if line containes comma at the end
          roadOS = JSON.parse(line.slice(0, (line.length - 1)), null, 2); //delete comma and parse
        } else {
          roadOS = JSON.parse(line, null, 2); //parse data to JSON
        }
        //roadOS = convertToGIS(roadOS); //**** uncomment
        //compare and return number of matches
        switch(compareRoadsName(roadOS)) {
          case -1:
            noNameCounter++;
            break;
          case 0:
            zeroCounter++;
            break;
          case 1:
            oneCounter++;
            break;
          default:
            multiCounter++;
          }
      }
    });
    rl.on('close', function (line) { //function close the read line channel
      console.log('\n\t writing files to disk.... \n')
    });
    //write data to output file
    fs.writeFileAsync(config.outputFile, JSON.stringify(onewayArray, null, 2));
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
  });
});

//compare names of the roads for match betwwen OS and OSM
compareRoadsName = (roadOS) => {
  let roadNameOS = roadOS.n;
  // extract name and convert to lower case
  // roadNameOS = roadNameOS.slice(3,roadNameOS.length-1).toLowerCase(); //**** comment
  let roadNameOSM;
  let matchNameCounter = matchCoordinatesCounter = 0;
  //if road has no name in OS then retrun without comparing
  //comment this IF statement to compare names without names as well.
  if (roadNameOS == 0) {
    return -1;
  }
  // for loop every OSM road
  //console.log(typeof(dataOSM));
  for (let roadOSM of dataOSM) {
    roadNameOSM = roadOSM.n;
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
      }
    }
  }
  //return number of road matches from OSM for every OS road
  // can be changed to matchNameCounter to get report about NAME matches
  return matchCoordinatesCounter;
}

//compare roads coordinates for overlap
compareRoadsForOverlap = (roadOS, roadOSM) => {
  if((roadOS.c != NaN) && (roadOSM.c != NaN)) {
    const turfRoadOS = turf.lineString(roadOS.c); //convert OS road to turf linestring
    const turfRoadOSM = turf.lineString(roadOSM.c); //convert OSM road to turf linestring
    //calculate the overlap between roads, if length > 0 means there is match
    overlap = turf.lineOverlap(turfRoadOS, turfRoadOSM, {tolerance: distToler});
    if(overlap.features.length > 0){
      let len = 0;
      //loop to calcuate the length of overlap segements of same road
      for (let i = 0; i < overlap.features.length; i++) {
        len += turf.length(overlap);
      }
      //calculate length of OS and OSM roads
      let lengthOS = turf.length(turfRoadOS);
      let lengthOSM = turf.length(turfRoadOSM);
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
  if ( (roadOS.d) && (roadOS.w == 1) ) { //w=1 for Single Carriageway
    let angle = findDirectionAngle(roadOS.c);
    if(roadOS.d == -1) {
      //opposite direction so add 180 to change directionilty, % 360 to range (0-360)
      angle = (angle + 180) % 360;
    }
    return angle;
  }
  return NaN;
}

// find if OSM road is oneway
isOneWayOSM = (roadOSM) => {
  //check if search finds "oneway" substring and if first letter is n or y for no and yes respectively.
  if(roadOSM.t) {
    return findDirectionAngle(roadOSM.c);
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
  arrayOS.push(convertToGIS(roadOS));
  arrayOSM.push(convertToGIS(roadOSM));
  //addRoadOSM(roadOSM);
}

printReport = (zeroCounter, oneCounter, multiCounter, noNameCounter) => {
  console.log("Number of roads from OS with NO match in OSM: \t\t" + zeroCounter);
  console.log("Number of roads from OS with ONE match in OSM: \t\t" + oneCounter);
  console.log("Number of roads from OS with MULTIPLE match in OSM: \t" + multiCounter);
  console.log("Number of roads without a name in OS: \t\t\t" + noNameCounter);
  console.log("Number of ONEWAY mismatchbetween OS and OSM: \t\t" + onewayMismatchCount());
  console.log("\n\t***********************************\n");
  tm.print('\t\tTotal time taken: \t', new Date() - totalTime);
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
  return ({
    "type": "Feature",
    "properties": {
      "localid": road.i,
      "roadname": road.n,
    },
    "geometry": {
      "type": "LineString",
      "coordinates": road.coor
    }
  });
}

// const showProgress = () => {
//
// }
