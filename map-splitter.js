/*
script to preprocess and convert OS and OSM maps to format required then
splits the map to smaller areas fro parallel processing
*/
const {execSync} = require('child_process'); //to run commandline Synchronous
const {exec} = require('child_process'); //to run commandline Asynchronous
const config = require('./map-splitter-config.json'); //configaration file

//record total time for script while running
let totalTimer = new Date();
let stack = 0, index = 0;

//load start and ending coordinates from config file
let long = config.startLong, lat = config.startLat;
let long2 = config.endLong, lat2 = config.endLat;

//calculate  map size in tems of coordinates
const longInc = (long2 - long) / config.longDivision;
const latInc = (lat2 - lat) / config.latDivision;

//output files for whole map and input for splitMap function
const fileTag = config.fileTag;

//number of divisions (small areas)
const numArea = config.latDivision * config.longDivision;

//define ogr2ogr parameters
let ogrCommand = '';
// define output format (JSON)
let ogrJSON = 'ogr2ogr -f GeoJSON ';
//define area coordinates of the map
let ogrClip = ' -clipdst ' + long + ' ' + lat + ' ' + long2 + ' ' + lat2;
//define SQL query for OSM map to select related links
let ogrSQL = " -sql \"SELECT * FROM lines WHERE highway in " +
            "('motorway', 'trunk', 'motorway_link', 'trunk_link', " +
            "'tertiary', 'primary', 'secondary', 'tertiary_link', " +
            "'primary_link', 'secondary_link', 'residential', " +
            "'service', 'living_street', 'unclassified')\" ";
//define projection system for OS map
let ogrProj = ' -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 ' +
            '+x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs ' +
            '+nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 ';

//function to split maps to smaller areas has its paramter INPUT FILE NAME
splitMap = () => {
  stack ++; //increment number of element in stack (area in process)
  if( (index % config.longDivision) == 0 ) { //check to reset latitude when reached most right side
    lat = lat2; //move latitude to next position
    lat2 = lat + latInc;  //end of the map segement latitude
    long = config.startLong; //reset longitude to start from most left side
  }
  index ++; // index for area number
  long2 = long + longInc;  //end of the map segement longitude
  ogrClip = ' -clipdst ' + long + ' ' + lat + ' ' + long2 + ' ' + lat2; //coordinates square
  //let index = j + (i * config.longDivision); // to name files in order
  let output = ' .' + fileTag.split('.')[1] + '_' + index + '.json '; // output file name
  let timer = new Date();
  ogrCommand = ogrJSON + output + fileTag + ogrClip;
  commandLine(index, ogrCommand, function(i, stdout) {
    printTimer('\t\tArea number ' + i + ' took: \t', new Date() - timer);
    stack --;
    //console.log('Stack size is: ' + stack + ' another area is being processed')
    if( (index < numArea) && (config.Async.toLowerCase() == 'yes')) {
      splitMap();
    }
    if ( (stack == 0) && (config.Async.toLowerCase() == 'yes') ){
      printtTotalTime();
    }
  }); // call function
  long = long2; //set start longituide of next map segement
}

//function to execute commandline
commandLine = (i, command, callback) => {
  if(config.Async.toLowerCase() == 'yes') {  //execute commandline Synchronous
    exec(command, (error, stdout, stderr) => {
      if (error) { //check for error
        console.error('exec error: ' + error); // print error
      }
      callback(i, stdout);
    });
  } else {  //execute commandline Asynchronous
    execSync(command);
    callback(i);
  }
}

printTimer = (text, milliseconds) => {
  let time = ''; // reset time to blank string
  let seconds = Math.floor(milliseconds / 1000); // calculate total seconds
  let minutes = Math.floor(seconds / 60); // calculate total minutes
  let hours = Math.floor(minutes / 60); // calculate total hours
  //format time string by checking hours, minutes and seconds
  if (hours > 0) { time = hours + 'h:'; }
  if (minutes > 0) { time = time + (minutes % 60) + 'm:'; } // % 60 to get minutes
  if (seconds > 0) { time = time + (seconds % 60) + 's'; } // % 60 to get seconds
  if (time == '') { time = 'less than a second'; } // if time less than a second
  console.log(text + time); // print time to console
}

printtTotalTime = () => {
  //print total time took the script to run
  console.log('\n\t********************************************');
  printTimer('\t\tTotal time taken: \t', new Date() - totalTimer);
  console.log('\t********************************************\n');
}

//script starts here
let tempString, threads; //variables to initalizing Async or Sync
//output the mode used Asynchronous or Synchronous
if(config.Async.toLowerCase() == 'yes'){ //compare mode if Asynchronous
  tempString = 'As'; //change mode message to Asynchronous
  threads = config.threads; //number of areas to be processed
} else {
  tempString = 'S'; //set mode message to default (Synchronous)
  threads = numArea; //max number of area processed simultaneously
}
console.log('\n \t\t************************\n \t\t** ** ' + tempString +
  'ynchronous ** **\n \t\t************************\n'); //output mode message

//read map source type from config JSON file
tempString = config.map.toUpperCase();
//comapre which map source to use
switch(tempString){
  case 'OS': //case to prepare commandline for OS
    ogrCommand = ogrJSON + ogrClip + fileTag + config.inputOS + ogrProj + ' roadlink';
    break;
  case 'OSM': //case to prepare commandline for OSM
    ogrCommand = ogrJSON + ogrClip + fileTag  + config.inputOSM + ogrSQL;
    console.log(config.inputOSM);
    break;
  default: //default case print error message and exit
    throw 'ERROR! Please choose map source you want to convert: OS or OSM';
}
console.log('\n************* Script is runing for ' + tempString + ' map *************');

commandLine(index, ogrCommand, function() {
  console.log('\nThe pre-processing of main map is done.\n');  //print ID of processed segement
  // output total number of divisions (areas) to console
  console.log(' ********** Now dividing the map to ' + numArea
              + ' areas **********');
  lat2 = lat;  //initial value for programme to run correctly
  for(let i = 0; i < threads; i++){
    splitMap(); //spiltMap function
  }
});

if (config.Async.toLowerCase() != 'yes') {
  printtTotalTime();
}
