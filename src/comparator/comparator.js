const io = require('./io.js');
const progress = require('./progress.js');
const compareOSroadWithOSM= require('./compareOSroadWithOSM.js');
const print = require('./print.js');

//compare names of the roads for match betwwen OS and OSM
loop = (input) => {
  let roadCounters = {  //object holds counter of road links
    noMatch: 0,  //counter of zero match
    oneMatch: 0,  //counter of one match
    multiMatch: 0,  //counter of multi match
    noName: 0,  //counter of no names links
    processedOS: 0,  //counter for processed OS roads
    totalRoadsOS: 0
  };
  let outputData= {
    OS: [],
    OSM: [],
    info: []
  };
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
    let key = compareOSroadWithOSM.compare(roadOS, dataOSM, outputData);
    roadCounters[key] ++;
    returnProgress = progress.calculate(roadCounters);
    if (returnProgress) {
      print.progress(returnProgress);
    }
  }
  return [outputData, roadCounters];
}

//========== script start here ==========
exports.start = (input, output, startTime = new Date()) => {
  return promise = new Promise((resolve, reject) => {
      resolve(loop(input));
  });

  promise.then( (values) => { //call main function loop
    print.message('Writing data to files');
    io.write(output.outputFileOS, values[0].OS); //write data to files
    io.write(output.outputFileOSM, values[0].OSM);
    io.write(output.outputFileInfo, values[0].info);
    print.report(values[1]); //print report of number of link matches
    print.footer(startTime); //print time taken
  });
}
