const {exec} = require('child_process'); //to run commandline Asynchronous
const fs = require('fs'); //to use file system
const readline = require('readline'); //to read file lien by line
const stream = require('stream'); //to create stream for read line
const tm = require('./timeprinter.js'); //import file timeprinter.js
const config = require('./map-processing-config.json'); //import configuration file

let mapData = config.map.toUpperCase(); //convert choice to upper case for comparison
let pathIn =  (mapData == 'OS') ? config.inputOS : config.inputOSM; //choose input OS or OSM
let pathOut = config.output + mapData + '.json '; //construct output path
let totalTime = new Date(); //read date to calculate time of script

//set ogr2ogr output format (JSON) and reduce coordinates to [longitude, latitude]
let ogrJSON = 'ogr2ogr -f GeoJSON -skipfailures -dim XY ';
let ogrPath = pathOut + pathIn; //output and input files of ogr2ogr

//define SQL query for OS map to select related data
let ogrSQLOS = ' -sql "SELECT localid as i, ' +
               'CASE ' +
               'WHEN roadname = \'null\' THEN 0 ' +
               'ELSE roadname END as n, ' +
               'CASE ' +
               'WHEN directionality = \'both directions\' THEN 0 ' +
               'WHEN directionality = \'in direction\' THEN 1 ' +
               'WHEN directionality = \'in opposite direction\' THEN -1 ' +
               'ELSE 5 END as d,' +
               'CASE ' +
               'WHEN formofway = \'Single Carriageway\' THEN 1 ' +
               'WHEN formofway = \'Dual Carriageway\' THEN 2 ' +
               'ELSE 0 END as w, ' +
               'geom ' +
               'FROM roadlink " ';

//define projection system for OS map
let ogrProj = ' -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 ' +
           '+x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs ' +
           '+nadgrids=./InputY/OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 ';

//define SQL query for OSM map to select related data
let ogrSQLOSM = " -sql \"SELECT osm_id as i, name as n, other_tags as t " +
                "FROM lines WHERE highway in " +
                "('motorway', 'trunk', 'motorway_link', 'trunk_link', " +
                "'tertiary', 'primary', 'secondary', 'tertiary_link', " +
                "'primary_link', 'secondary_link', 'residential', " +
                "'service', 'living_street', 'unclassified')\" ";

//constracting the ogr2ogr command string
ogrCommand = ogrJSON + ogrPath;
ogrCommand = ogrCommand + (mapData == 'OS' ? ogrSQLOS + ogrProj : ogrSQLOSM);

//function to execute commandline
const commandLine = (command, callback) => {
  exec(command, (error, stdout, stderr) => {
    if (error) { //check for error
      console.error('exec error: ' + error); // print error
    }
    callback(stdout);
  });
}

//reduce data size and save as object to be converted to JSON
const reduceData = (seg) => {
  let id = 0, name = "", dir = 0, way = 0; //parameters to save data
  let coord = []; //array for saving coordinates
  id = seg.properties.i; //read id fromf ile
  name = seg.properties.n ? (seg.properties.n).toLowerCase() : 0; //check name if exist
  if (mapData == 'OS') { //check data source, set OS informatin if true
    name = (name == 0) ?  0 : name.slice(3,name.length-1); //check name exist then process
    dir = seg.properties.d; //save dirictionality in parameter
    way = seg.properties.w;//save dirictionality in parameter
  } else { //if not then set OSM information
    way = isOneWayOSM(seg.properties.t); //call function to extract paramter from data
  }
  coord = seg.geometry.coordinates; //save coordinates to parameter.
  obj = { "i": id, //return object contains data of the road link
          "n": name,
          "w": way,
          "c": coord
        };
  if (mapData == 'OS'){
    obj.d = dir;
  }
  return obj;
}

//read data from input file line by line
const readData = (output, callback) => {
  const instream = fs.createReadStream((pathOut.trim())); //create input stream
  const outstream = new stream(); // create output stream
  const rl = readline.createInterface(instream, outstream); //create channel to read lines
  rl.on('line', function (line) { //read line by line function
    if(line.slice(3, 7) == 'type'){ //check if line is road link
      if(line[line.length - 1] == ','){ //check if line containes comma at the end
        seg = JSON.parse(line.slice(0, (line.length - 1)), null, 2); //delete comma and parse
      } else {
        seg = JSON.parse(line, null, 2); //parse data to JSON
      }
      let data = JSON.stringify(reduceData(seg)) + ',\n'; //call reduceData and convert to string
      fs.appendFile( output, data, (err) => { //write line to the output file
        if (err) throw err; //check if error throw error
      });
    }
  });
  rl.on('close', function (line) { //function close the read line channel
    console.log('end of file'); //print "end of file" message
    fs.appendFile( output, ']', (err) => { //write closing tags to file
      if (err) throw err; //check if error throw error
    });
    callback();
  });
}

// find if OSM road is oneway
const isOneWayOSM = (tags) => {
  // find oneway tag and extract it from the string "other_tags" in OSM JSON data
  if(tags) {
    // check if private vehicles restricted from accessing road
    if(tags.search('motor_vehicle"=>"no') != -1) {
      return 0;
    }
    //set index to point at oneway word
    let index = tags.search("oneway\"=>");
    //check if search finds "oneway" substring and if first letter is n or y for no and yes respectively.
    if(index != -1 && tags.charAt(index + 10).toLowerCase() == "y") {
      return 1;
    }
  }
    //return 0 to function call so the road is not oneway
    return 0;
}

//print messages to indicate script started running
console.log('\n\t\t*****\t Script started at ' +
            new Date().toTimeString().slice(0,8) + ' \t*****\n');
console.log('\n\tProcessing ' + mapData + ' data.\n'  );

//commandLine(ogrCommand, () => { //call commandLine, main code functionality starts here
  tm.print('\tData pre-processing and convertion finished in: \t', new Date() - totalTime); //prinet time of converison
  let output = config.output.trim() + mapData + '-reduced.json';
  fs.writeFile(output, '[ \n', (err) => { //creat file and write required opening tags
    if (err) throw err //check error and throw error
    console.log('\tOutput file created successfully at: ' + output); //confirmation message
    readData(output, () => { //call readData with string (file name) as paramter
      tm.print('\t\tTotal time taken is: \t', new Date() - totalTime); //print total time of script
    });
  });
//});
