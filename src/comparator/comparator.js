const io = require('./io.js');
const {calculateProgress} = require('./progress.js');
const {compareOSroadWithOSM}= require('./compareOSroadWithOSM.js');
const print = require('./print.js');
const startTime = new Date();

const outputResults = (output, outputData, roadCounters) => {
  print.message('Writing data to files');
  io.write(output.outputFileOS, outputData.OS); //write data to files
  io.write(output.outputFileOSM, outputData.OSM);
  io.write(output.outputFileInfo, outputData.info);
  print.report(roadCounters); //print report of number of link matches
  print.footer(startTime); //print time taken
}

outputResults = (output, outputData, roadCounters, startTime) => {
  print.message('Writing data to files');
  io.write(output.outputFileOS, outputData.OS); //write data to files
  io.write(output.outputFileOSM, outputData.OSM);
  io.write(output.outputFileInfo, outputData.info);
  print.report(roadCounters); //print report of number of link matches
  print.footer(startTime); //print time taken
}

//compare names of the roads for match betwwen OS and OSM
exports.compare = (input, output) => {
  let roadCounters = {  //object holds counter of road links
    noMatch: 0,  //counter of zero match
    oneMatch: 0,  //counter of one match
    multiMatch: 0,  //counter of multi match
    noName: 0,  //counter of no names links
    processedOS: 0,  //counter for processed OS roads
    totalRoadsOS: 0
  };
  let outputData= { OS: [], OSM: [], info: []};
  let i = 0;
  [dataOS, dataOSM] = io.read(input[0], input[1]); //read input files
  print.header(dataOS.features.length, dataOSM.features.length);
  roadCounters.totalRoadsOS = dataOS.features.length;
  for (let roadOS of dataOS.features) { //loop through OS links
    roadCounters.processedOS ++;
    if (!roadOS.properties.name) { //check if no name increment counter
      // TODO: consider this case.
      roadCounters.noName ++;
      continue;
    }
    let key = compareOSroadWithOSM(roadOS, dataOSM, outputData);
    roadCounters[key] ++;
    print.progress(calculateProgress(roadCounters));
  }
outputResults(output, outputData, roadCounters);
}
