//main module in comparing links, reads 2 input files, compare links and writes 3 output files

const io = require('./io.js');
const {calculateProgress} = require('./progress.js');
const {compareOSroadWithOSM} = require('./compareOSroadWithOSM.js');
const {filterDuplication} = require('./filter-output.js');
const print = require('./print.js');
const startTime = new Date();

const outputResults = (outputFiles, outputData, roadCounters) => { //function to write output
  print.message('Writing data to files');
  io.write(outputFiles.OS, outputData.OS); //write data to files
  io.write(outputFiles.OSM, outputData.OSM);
  io.write(outputFiles.Info, outputData.info);
  print.report(roadCounters); //print report of number of link matches
  print.footer(startTime); //print time taken
}

//compare names of the roads for match betwwen OS and OSM
exports.compareData = (input, outputFiles) => {
  const roadCounters = {  //object holds counter of road links
    noMatch: 0,  //counter of zero match
    oneMatch: 0,  //counter of one match
    multiMatch: 0,  //counter of multi match
    noName: 0,  //counter of no names links
    processedOS: 0,  //counter for processed OS links
    totalRoadsOS: 0  //counter for total links in OS
  };
  const outputData= { OS: [], OSM: [], info: []}; //object of 3 output data arrays
  [dataOS, dataOSM] = io.read(input); //read input files
  print.header(dataOS.features.length, dataOSM.features.length); //print total links in OS and OSM
  roadCounters.totalRoadsOS = dataOS.features.length; //save total number of OS links to counter
  for (let roadOS of dataOS.features) { //loop through OS links
    roadCounters.processedOS ++; //increase links processed in counter
    if (!roadOS.properties.name) { //check if link has no name, increment counter
      // TODO: consider this case.
      roadCounters.noName ++;
      continue; //no comparision, continue loop
    }
    const key = compareOSroadWithOSM(roadOS, dataOSM, outputData); //compare OS link against OSM links
    roadCounters[key] ++; // increament related counter according to key value
    print.progress(calculateProgress(roadCounters)); //print the progess of the calculation on the run
  }
  outputData.OS = filterDuplication(outputData.OS);
  outputResults(outputFiles, outputData, roadCounters); //call inner function
}
