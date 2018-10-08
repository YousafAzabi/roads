/*
script to preprocess and convert OS and OSM maps to format required then
splits the map to smaller areas for parallel processing
*/
const {execSync} = require('child_process'); //to run commandline Synchronous
const {exec} = require('child_process'); //to run commandline Asynchronous
const config = require('./map-splitter-config.json'); //configaration file
const tm = require('./time'); //to print time in **h:**m:**s format

console.log('\n**********\t Script started at ' +
            new Date().toTimeString().slice(0,8) + ' \t**********\n');

//record total time for script while running
let totalTime = new Date();

//load start and ending coordinates from config file
let long1 = config.startLong, lat1 = config.startLat;
let long2 = config.endLong, lat2 = config.endLat;

//output files for whole map and input for splitMap function
const fileTag = config.fileTag;
const outPath = config.outPath;
const asyncTag = config.Async.toLowerCase();
const segements = Math.pow(2, (config.stages));

let segArray = [];
let timer = [];
let checkFile = new Array(segements).fill(0);

//define ogr2ogr parameters
let ogrCommand = '';
// define output format (JSON)
let ogrJSON = 'ogr2ogr -f GeoJSON -skipfailures -dim XY ';
//define area coordinates of the map
let ogrClip = ' -clipdst ' + long1 + ' ' + lat1 + ' ' + long2 + ' ' + lat2;
//define SQL query for OSM map to select related links
let ogrSQLOSM = " -sql \"SELECT * FROM lines WHERE highway in " +
            "('motorway', 'trunk', 'motorway_link', 'trunk_link', " +
            "'tertiary', 'primary', 'secondary', 'tertiary_link', " +
            "'primary_link', 'secondary_link', 'residential', " +
            "'service', 'living_street', 'unclassified')\" ";
//define SQL query for OS map to select related data
let ogrSQLOS = ' -sql "SELECT localid, roadname, directionality, formofway, geom ' +
            'FROM roadlink " ';
//define projection system for OS map
let ogrProj = ' -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 ' +
            '+x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs ' +
            '+nadgrids=./InputY/OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 ';

//function to execute commandline
commandLine = (id, command, callback) => {
  if(asyncTag == 'yes') {  //execute commandline Synchronous
    exec(command, (error, stdout, stderr) => {
      if (error) { //check for error
        console.error('exec error: ' + error); // print error
      }
      callback(id);
    });
  } else {  //execute commandline Asynchronous
    execSync(command);
    callback(id);
  }
}

//
splitMap = (id, arr) => {
  timer[id] = new Date();
  let [x1, y1, x2, y2] = arr;
  let ogrClip = ' -clipdst ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
  let output = outPath.trim() + fileTag + id + '.json '; // output file name
  let input = outPath.trim() + fileTag + Math.floor(id / 2) + '.json';
  ogrCommand = ogrJSON + output + input + ogrClip;
  segArray[id] = arr
  console.log( ' Now processing Area: ' + id);
  commandLine(id, ogrCommand, function(i) {
    console.log(' Area number ' + i + ' finished in: \t' +
                  tm.format(new Date() - timer[i]) + '\n');
    if (i < segements) {
      setMapDimensions(i);
    }
    //check file to be deleted
    let tempIndex = Math.floor(i / 2);
    if ( (++ checkFile[tempIndex]) == 2) {
      let file = outPath.trim() + fileTag + tempIndex + '.json';
      exec('rm ' + file, (error,stdout,stderr) => {
        if (error) {
          console.error('exec error: ' + error);
        }
        console.log('File ' + file +  'has been deleted.');
      });
    }
    if(++ checkFile[0] >= (Math.pow(2, segements + 1) - 2) ) {
      tm.format('\t\tTotal time taken: \t', new Date() - totalTime);
    }
  }); // call function
}

//split maps to smaller areas has its paramter INPUT FILE NAME
setMapDimensions = (id) => {
  let mid;
  let [x1, y1, x2, y2] = segArray[id];
  if ( ! (Math.floor(Math.log2(id)) % 2) ) { //testing number in which 2^x group
    mid = (y1 + y2) / 2;
    splitMap((2 * id), [x1, y1, x2, mid]);
    splitMap((2 * id + 1), [x1, mid, x2, y2]);
  } else{
    mid = (x1 + x2) / 2;
    splitMap((2 * id), [x1, y1, mid, y2]);
    splitMap((2 * id + 1), [mid, y1, x2, y2]);
  }
}

//script starts here
let tempString;
//output the mode used Asynchronous or Synchronous
if(asyncTag == 'yes'){ //compare mode if Asynchronous
  tempString = 'As'; //change mode message to Asynchronous
} else {
  tempString = 'S'; //set mode message to default (Synchronous)
}
console.log(' \t\t************************\n \t\t** ** ' + tempString +
  'ynchronous ** **\n \t\t************************'); //output mode message

//read map source type from config JSON file
tempString = config.map.toUpperCase();
ogrCommand = ogrJSON + ogrClip + outPath + fileTag + '1.json';
//comapre which map source to use
switch(tempString){
  case 'OS': //case to prepare commandline for OS
    ogrCommand =  ogrCommand + config.inputOS + ogrSQLOS + ogrProj;
    break;
  case 'OSM': //case to prepare commandline for OSM
    ogrCommand = ogrCommand + config.inputOSM + ogrSQLOSM;
    break;
  default: //default case print error message and exit
    throw 'ERROR! Map source error. In config file map should be: OS or OSM';
}
console.log('\n************* Script is runing for ' + tempString + ' map *************');

commandLine(1, ogrCommand, function(id) {
  console.log('\nThe pre-processing of main map is done. It took: '
              + tm.format(new Date() - totalTime) + '\n');
  // output total number of divisions (areas) to console
  console.log('********** Now dividing the map to ' + segements
              + ' areas **********');
  segArray[id] = [long1, lat1, long2, lat2];
  setMapDimensions(id); //
});
