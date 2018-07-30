const turf = require('@turf/turf');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('./comparator-config.json');

let dataOS, dataOSM, matchedData = [];
let roadMatchesInOSM = [];
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
      //compare retun number of matches
      switch(compareRoadsName(roadOS, numOfRoadsOSM)){
        case -1:
          noNameCounter++;
          break;
        case 0:
          zeroCounter++;
          break;
        case 1:
          oneCounter++;
          writeOutput(matchedData, roadOS, roadMatchesInOSM);
          break;
        default:
          multiCounter++;
          writeOutput(matchedData, roadOS, roadMatchesInOSM);
      }
    }
    //write data to output file
    fs.writeFileAsync( config.outputFile, JSON.stringify(matchedData, null, 2));
    printReport(zeroCounter, oneCounter, multiCounter, noNameCounter);
  });
});

//compare names of the roads for match betwwen OS and OSM
compareRoadsName = (roadOS, numOfRoadsOSM) => {
  let roadNameOS = roadOS.properties.roadname ? roadOS.properties.roadname : "";
  roadNameOS = roadNameOS.slice(3,roadNameOS.length-1).toLowerCase();
  let roadNameOSM;
  let matchNameCounter = matchCoordinatesCounter = 0;

  //if road has no name in OS then retrun without comparing
  if (roadNameOS == ""){
    return -1;
  }
  roadMatchesInOSM = [];
  // for loop every OSM road
  for (var j = 0; j < numOfRoadsOSM; j++) {
    // extract street name in OSM data
    let roadOSM = dataOSM.features[j];
    roadNameOSM = roadOSM.properties.name ? roadOSM.properties.name.toLowerCase() : "";
    //comapre names of OS and OSM, increase NAME counter if matched
    if (roadNameOS == roadNameOSM){
      matchNameCounter ++;
      //compare for overlap, increment COORDINATES counter if matched
      if (compareRoadsForOverlap(roadOS, roadOSM)){
        matchCoordinatesCounter ++;
        roadMatchesInOSM.push(roadOSM.properties.osm_id);
      }
    }
  }
  //return number of road matches from OSM for every OS road
  return matchCoordinatesCounter;
}


//compare roads coordinates for overlap
compareRoadsForOverlap = (roadOS, roadOSM) => {
  if((roadOS.geometry.coordinates != NaN) & (roadOSM.geometry.coordinates != NaN)){
    const turfRoad1 = turf.lineString(roadOS.geometry.coordinates); //convert OS road to turf linestring
    const turfRoad2 = turf.lineString(roadOSM.geometry.coordinates); //convert OSM road to turf linestring
    //comparing roard using turf built-in function lineOverlap with tolerance 4meters
    //if length > 0 means there is match
    if(turf.lineOverlap(turfRoad1, turfRoad2, {tolerance: 0.004}).features.length > 0){
      return true;
    }
  }
  return false;
}

//write data to array then retrun for output file
writeOutput = (array, roadOS, roadsOSM) => {
  let data = [];
  data[0] = roadOS.properties.roadname.slice(3,roadOS.properties.roadname.length-1);
  data[1] = (roadOS.properties.localid).toString();
  data[2] = roadsOSM;
  array.push(data);
}

printReport = (zeroCounter, oneCounter, multiCounter, noNameCounter) => {
  console.log("Number of roads from OS with NO match in OSM: \t\t" + zeroCounter);
  console.log("Number of roads from OS with ONE match in OSM: \t\t" + oneCounter);
  console.log("Number of roads from OS with MULTIPLE match in OSM: \t" + multiCounter);
  console.log("Number of roads without a name in OS: \t\t\t" + noNameCounter);

}
