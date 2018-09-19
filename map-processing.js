const {exec} = require('child_process'); //to run commandline Asynchronous
const fs = require('fs'); //to use file system
const readline = require('readline'); //to read file lien by line
const stream = require('stream'); //to create stream for read line
const tm = require('./timeprinter.js'); //import file timeprinter.js
const config = require('./map-processing-config.json'); //import configuration file

let mapData = config.map.toUpperCase();
let pathIn =  mapData == 'OS' ? config.inputOS : config.inputOSM;
let pathOut = config.output + mapData + '.json ';
let totalTime = new Date();

// define output format (JSON)
let ogrJSON = 'ogr2ogr -f GeoJSON -skipfailures -dim XY ';
let ogrPath = pathOut + pathIn;

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
console.log(ogrCommand);
//function to execute commandline
commandLine = (command, callback) => {
  exec(command, (error, stdout, stderr) => {
    if (error) { //check for error
      console.error('exec error: ' + error); // print error
    }
    callback(stdout);
  });
}

//read data from input file and parse to JSON object
reduceData = (seg) => {
  let id = 0, name = "", dir = 0, way = 0;
  let coord = [];
  id = seg.properties.i;
  name = name ? (seg.properties.n).toLowerCase() : 0;
  if (mapData = 'OS') {
    name = (name == 0) ?  0 : name.slice(3,name.length-1);
    dir = seg.properties.d;
    way = seg.properties.w;
  } else {
    way = isOneWayOSM(seg.properties.t);
  }
  coord = seg.geometry.coordinates;
  return {"i": id,
          "n": name,
          "d": dir,
          "w": way,
          "c": coord
        };
}

readData = (output, callback) => {
  fs.writeFile( output, '\n[ \n', (err) => {
    if (err) throw err
    console.log('\tOutput file created successfully at: ' + output)
  });
  const instream = fs.createReadStream((pathOut.trim()));
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);
  rl.on('line', function (line) {
    if(line.slice(3, 7) == 'type'){
      if(line[line.length - 1] == ','){
        seg = JSON.parse(line.slice(0, (line.length - 1)), null, 2);
      } else {
        seg = JSON.parse(line, null, 2);
      }
      let data = JSON.stringify(reduceData(seg)) + ',\n';
      fs.appendFile( output, data, (err) => {
        if (err) throw err;
      });
    }
  });
  rl.on('close', function (line) {
    console.log('end of file');
    fs.appendFile( output, ']', (err) => {
      if (err) throw err;
    });
    callback();
  });
}

// find if OSM road is oneway
isOneWayOSM = (tags) => {
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

console.log('\n\t\t*****\t Script started at ' +
            new Date().toTimeString().slice(0,8) + ' \t*****\n');
console.log('\n\tProcessing ' + mapData + ' data.\n'  );

commandLine(ogrCommand, () => {
  tm.print('\tData pre-processing and convertion finished in: \t', new Date() - totalTime);
  readData(config.output.trim() + mapData + '-reduced.json', () => {
    tm.print('\t\tTotal time taken is: \t', new Date() - totalTime);
  });
});
