const io = require('./io.js');
const distance = require('./distance.js');
const name = require('./name.js');
const overlap = require('./overlap.js');
const angle = require('./angle.js')
const nt = require('./note-generator.js');
const data = require('./data.js');
const print = require('./print.js');

//compare names of the roads for match betwwen OS and OSM
loop = (input) => {
  let mismatch = [], arrayOS = [], arrayOSM = [];
  let tempTime = new Date();
  let roadCounter = {  //object holds counter of road links
    noMatch: 0,  //counter of zero match
    oneMatch: 0,  //counter of one match
    multiMatch: 0,  //counter of multi match
    noName: 0,  //counter of no names links
    roadsSkipped: 0,
    totalRoadsProcceses: 0
  };

  let i = 0;
  [dataOS, dataOSM] = io.read(input[0], input[1]); //read input files
  if (!print.header(dataOS.features.length, dataOSM.features.length)) {
      throw 'ERROR! Input files length error.'
  }
  for (let roadOS of dataOS.features) { //loop through OS links
    if (!roadOS.properties.name) { //check if no name increment counter
      // TODO: consider this case.
      roadCounter.noName ++;
      continue;
    }

    compareOSroadWithOSM(roadOS, dataOSM, roadCounter, mismatch, arrayOS, arrayOSM);

    if ( i++ % 100 == 0 ) {
      console.log(roadCounter, ' time ', print.footer(tempTime));
    }
  }
  return [arrayOS, arrayOSM, mismatch, roadCounter];
}

compareOSroadWithOSM = (roadOS, dataOSM, roadCounter, mismatch, arrayOS, arrayOSM) => {
  let index = 0; //reset counter for number of matches
  for (let roadOSM of dataOSM.features) { //loop OSM links
    roadCounter.totalRoadsProcceses ++;

    if (!distance.inRange(roadOS, roadOSM)) {
      roadCounter.roadsSkipped++;
      continue;
    }

    // cleaning up OS names: removing 1.()
    const osName = roadOS.properties.name.slice(3, (roadOS.properties.name.length - 1))

    if ( name.compare(osName, roadOSM.properties.name) ) { //comapre names of OS and OSM
      if ( overlap.compare(roadOS.geometry.coordinates, roadOSM.geometry.coordinates) ) { //check if links overlap
        index ++; //increment links' match counter
        let angleOS = angle.calculate(roadOS.geometry.coordinates); //find OS angle
        angleOS = roadOS.properties.direction ? angleOS : (angleOS + 180) % 360; //opposite direction rotate 180
        let angleOSM = angle.calculate(roadOSM.geometry.coordinates); //find OSM angle
        let note = nt.generate(angleOS, angleOSM); //generate note if mismatch occure
        if (note) { //if mismatch add data to arrays
          mismatch.push(data.format(roadOS, roadOSM, note));
          arrayOS.push(roadOS);
          arrayOSM.push(roadOSM);
        }
      }
    }
  }
  if (index == 0) { //check link match counter if > 1
    roadCounter.noMatch ++;
  } else if (index == 1) {
    roadCounter.oneMatch ++;
  } else {
    roadCounter.multiMatch ++;
  }

}

//========== script start here ==========
exports.start = (input, output, time = new Date()) => {
  let promise = new Promise((resolve, reject) => {
    resolve(loop(input));
  });

  promise.then( (values) => { //call main function loop
    console.log('Writing data to files');
    io.write(output[0], values[0]); //write data to files
    io.write(output[1], values[1]);
    io.write(output[2], values[2]);
    print.report(values[3]); //print report of number of link matches
    print.footer(time); //print time taken
  });
}
