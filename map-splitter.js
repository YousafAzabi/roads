/*
script to preprocess and convert OS and OSM maps to format required then
splits the map to smaller areas fro parallel processing
*/
const {execSync} = require('child_process'); //to run commandline Synchronous
const config = require('./map-splitter-config.json'); //configaration file

//record total time for script while running
let totalTimer = new Date();

//load start and ending coordinates from config file
let long = config.startLong, lat = config.startLat;
let long2 = config.endLong, lat2 = config.endLat;

//calculate  map size in tems of coordinates
const longInc = (long2 - long) / config.longDivision;
const latInc = (lat2 - lat) / config.latDivision;

//output files for whole map and input for splitMap function
const fileTag = config.fileTag;

//define ogr2ogr parameters
let ogrJSON = 'ogr2ogr -f GeoJSON ';
let ogrClip = ' -clipdst ' + long + ' ' + lat + ' ' + long2 + ' ' + lat2;
let ogrSQL = " -sql \"SELECT * FROM lines WHERE highway in " +
            "('motorway', 'trunk', 'motorway_link', 'trunk_link', " +
            "'tertiary', 'primary', 'secondary', 'tertiary_link', " +
            "'primary_link', 'secondary_link', 'residential', " +
            "'service', 'living_street', 'unclassified')\" ";
let ogrProj = ' -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 ' +
            '+x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs ' +
            '+nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 ';

//function to split maps to smaller areas has its paramter INPUT FILE NAME
splitMap = () => {
  //loop for division in y-direction
  for(let i = 0; i < config.latDivision; i++){
    lat2 = lat + latInc;  //end of the map segement latitude
    long = config.startLong; //reset longitude to start from most left side
    //loop for division in x-direction
      for (let j = 1; j <= config.longDivision; j++) {
        long2 = long + longInc;  //end of the map segement longitude
        box = long + ' ' + lat + ' ' + long2 + ' ' + lat2; //coordinates square
        let index = j + (i * config.longDivision); // to name files in order
        let output = ' .' + fileTag.split('.')[1] + '_' + index + '.json '; // output file name
        let timer = new Date();
        commandLine(index, ogrJSON + output + fileTag + ' -clipdst ' + box); // call function
        printTimer('\t Area number ' + index + ' took: \t', new Date() - timer);
        long = long2; //set start longituide of next map segement
      }
    lat = lat2; //set start latitude of next map segement
  }
}

commandLine = (index, command) => {
  execSync(command);
  //check to call splitMap only once at first call to commandLine
  if(index == 0) {
    console.log('The preprocessing of map is done.\n');  //print ID of processed segement
    console.log('***** Now dividing the map to ' + config.latDivision * config.longDivision + ' areas *****');
    splitMap(); //spiltMap function
  }
}

printTimer = (text, milliseconds) => {
  let time = '';
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  if (hours > 0) { time = hours + 'h:'; }
  if (minutes > 0) { time = time + (minutes % 60) + 'm:'; }
  if (seconds > 0) { time = time + (seconds % 60) + 's.'; }
  if (time == '') { time = 'less than a second.'; }
  console.log(text + time);
}

if (config.map == 'OS') {
  console.log('********** Script is runing for OS map **********');
  commandLine(0, ogrJSON + ogrClip + fileTag + config.inputOS);
} else if (config.map == 'OSM') {
  console.log('********** Script is runing for OSM maps. **********');
  commandLine(0, ogrJSON + ogrClip + fileTag  + config.inputOSM + ogrSQL);
} else {
  console.log('ERROR! Please choose map source you want to convert: OS or OSM');
}

console.log('************************************');
printTimer('Total time taken to run script is: \t', new Date() - totalTimer);
