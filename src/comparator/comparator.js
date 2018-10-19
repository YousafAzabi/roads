const io = require('./io.js');
const name = require('./name.js');
const overlap = require('./overlap.js');
const direction = require('./direction.js');
const toDegree = require('./to-degree.js');
const nt = require('./note-generator.js');
const print = require('./print.js');
const turf = require('@turf/turf');

//compare names of the roads for match betwwen OS and OSM
loop = (input) => {
  let mismatch = [];
  let arrayOS = [];
  let arrayOSM = [];
  //counter for number of [0, 1, Multi matchs & NoName roads] respectively
  let roadCounter = [0, 0, 0, 0];
  [dataOS, dataOSM] = io.read(input[0], input[1]); //read input files
  if (!print.header(dataOS.features.length, dataOSM.features.length)) {
      throw 'ERROR! Input files length error.'
  }
  for (let roadOS of dataOS.features) { //loop through OS links
    if (!roadOS.properties.name) { //check if no name increment counter
      roadCounter[3] ++;
      continue;
    }
    let index = 0; //reset counter for number of matches
    for (let roadOSM of dataOSM.features) { //loop OSM links

      // find 1 point in roadOSM
      const roadOSMPoint = roadOSM.geometry.coordinates[0];
      // find 1 point in roadOS
      const roadOSPoint = roadOS.geometry.coordinates[0];
      // find distance
      const distance = turf.distance(roadOSPoint,roadOSMPoint);
      // ingore if longer than the longest segment
      if (distance > 1) continue;

      // cleaning up OS names: removing 1.()
      const osName = roadOS.properties.name.slice(3, (roadOS.properties.name.length - 1))

      if ( name.compare(osName, roadOSM.properties.name) ) { //comapre names of OS and OSM
        if ( overlap.compare(roadOS.geometry.coordinates, roadOSM.geometry.coordinates) ) { //check if links overlap
          index ++; //increment links' match counter
          let angleOS = calculateAngle(roadOS.geometry.coordinates); //find OS angle
          angleOS = roadOS.properties.direction ? angleOS : (angleOS + 180) % 360; //opposite direction rotate 180
          let angleOSM = calculateAngle(roadOSM.geometry.coordinates); //find OSM angle
          let note = nt.generate(angleOS, angleOSM); //generate note if mismatch occure
          if (note) { //if mismatch add data to arrays
            mismatch.push(format(roadOS, roadOSM, note));
            arrayOS.push(roadOS);
            arrayOSM.push(roadOSM);
          }
        }
      }
    }
    if (index > 1) { //check link match counter if > 1
      index = 2; // 2 refers to multimatch
    }
    roadCounter[index] ++; //increment related (index) counter
  }
  return [arrayOS, arrayOSM, mismatch, roadCounter];
}

calculateAngle = (coordinates) => {
  angle = direction.find(coordinates); //find angle
  if ( isNaN(angle) ) { //check if not a number
    return NaN;
  }
  return toDegree.convert(angle); //convert to degree
}

//========== format data to be written to file ==========
format = (roadOS, roadOSM, note) => {
  let data = {
    "roadName": roadOSM.properties.name,
    "OSId": (roadOS.properties.id).toString(),
    "OSMId": roadOSM.properties.id,
    "note": note
  };
  return data;
}

//========== script start here ==========
exports.start = (input, output, time = new Date()) => {
  let promise = new Promise((resolve, reject) => {
    resolve(loop(input));
  });

  promise.then( (values) => { //call main function loop
    console.log(values[3]);
    console.log('Writing data to files');
    //write data to files
    io.write(output[0], values[0]);
    io.write(output[1], values[1]);
    io.write(output[2], values[2]);
    print.report(values[3]); //print report of number of matches of links
    print.footer(time); //print time taken
  });
}
