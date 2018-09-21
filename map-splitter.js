/*
script to preprocess and convert OS and OSM maps to format required then
splits the map to smaller areas for parallel processing
*/
const {execSync} = require('child_process'); //to run commandline Synchronous
const {exec} = require('child_process'); //to run commandline Asynchronous
const config = require('./map-config.json'); //configaration file
const tm = require('./timeprinter'); //to print time in **h:**m:**s format

//record total time for script while running
let totalTime = new Date();

//load start and ending coordinates from config file
let long = config.startLong, lat = config.startLat;
let long2 = config.endLong, lat2 = config.endLat;

//calculate  map size in tems of coordinates
const longInc = (long2 - long) / config.longDivision;
const latInc = (lat2 - lat) / config.latDivision;

//output files for whole map and input for splitMap function
const fileTag = config.fileTag;
const asyncTag = config.Async.toLowerCase();

//number of divisions (small areas)
const numArea = config.latDivision * config.longDivision;

//define ogr2ogr parameters
let ogrCommand = '';
// define output format (JSON)
let ogrJSON = 'ogr2ogr -f GeoJSON -skipfailures -dim XY';
//define area coordinates of the map
let ogrClip = ' -clipdst ' + long + ' ' + lat + ' ' + long2 + ' ' + lat2;
//define SQL query for OSM map to select related links
let ogrSQLOSM = " -sql \"SELECT * FROM lines WHERE highway in " +
            "('motorway', 'trunk', 'motorway_link', 'trunk_link', " +
            "'tertiary', 'primary', 'secondary', 'tertiary_link', " +
            "'primary_link', 'secondary_link', 'residential', " +
            "'service', 'living_street', 'unclassified')\" ";
//define SQL query for OS map to select related data
let ogrSQLOS = ' -sql "SELECT localid,roadname,directionality,formofway,geom ' +
            'FROM roadlink " ';
//define projection system for OS map
let ogrProj = ' -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 ' +
            '+x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs ' +
            '+nadgrids=./InputY/OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 ';

//closure to split maps to smaller areas has its paramter INPUT FILE NAME
splitMap = (() => {
  var stack = 0, index = 0; //this sentance only executed once.
  return () => {
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
      tm.print('\t\tArea number ' + i + ' took: \t', new Date() - timer);
      stack ++; //increment number of element in stack (area in process)
      //console.log('Stack size is: ' + stack + ' another area is being processed')
      if( (index < numArea) && (config.Async.toLowerCase() == 'yes')) {
        splitMap();
      }
      if ( (stack == numArea) ){
        printTotalTime();
      }
    }); // call function
    long = long2; //set start longituide of next map segement
  }
})();

//function to execute commandline
commandLine = (i, command, callback) => {
  if(asyncTag == 'yes') {  //execute commandline Synchronous
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

printTotalTime = () => {
  //print total time took the script to run
  console.log('\n\t********************************************');
  tm.print('\t\tTotal time taken: \t', new Date() - totalTime);
  console.log('\t********************************************\n');
}

//script starts here
let tempString, threads; //variables to initalizing Async or Sync
//output the mode used Asynchronous or Synchronous
if(asyncTag == 'yes'){ //compare mode if Asynchronous
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
    ogrCommand = ogrJSON + ogrClip + fileTag + config.inputOS + ogrSQLOS + ogrProj;
    break;
  case 'OSM': //case to prepare commandline for OSM
    ogrCommand = ogrJSON + ogrClip + fileTag  + config.inputOSM + ogrSQLOSM;
    break;
  default: //default case print error message and exit
    throw 'ERROR! Please choose map source you want to convert: OS or OSM';
}
console.log('\n************* Script is runing for ' + tempString + ' map *************');

commandLine(0, ogrCommand, function() {
  console.log('\nThe pre-processing of main map is done.\n');  //print ID of processed segement
  // output total number of divisions (areas) to console
  console.log(' ********** Now dividing the map to ' + numArea
              + ' areas **********');
  lat2 = lat;  //initial value for programme to run correctly
  for(let i = 0; i < threads; i++){
    splitMap(); //spiltMap function
  }
});
