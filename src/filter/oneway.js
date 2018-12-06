const {exec} = require('child_process'); //to run commandline Asynchronous

//set ogr2ogr output format (JSON) and reduce coordinates to [longitude, latitude]
const ogrJSON = "ogr2ogr -f GeoJSON -dim XY ";
//define SQL query for OS map to select related data
const ogrSQLOS = " -sql \"SELECT localid AS id, roadname AS name, " +
               "CASE directionality WHEN 'in direction' THEN 1 " +
               "WHEN 'in opposite direction' THEN -1 " +
               "ELSE 0 END AS direction, geom " +
               "FROM roadlink " +
               "WHERE formofway LIKE '%Single%' \" ";
//define projection system for OS map
const ogrProj = " -s_srs \"+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 " +
              "+x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs " +
              "+nadgrids=./input/OSTN15_NTv2_OSGBtoETRS.gsb\" -t_srs Epsg:4326 ";
//define SQL query for OSM map to select related data
const ogrSQLOSM = " -sql \"SELECT osm_id AS id, name, " +
                "CASE WHEN other_tags LIKE '%oneway_=>_yes%' THEN 1 " +
                "ELSE 0 END AS direction, geom " +
                "FROM lines " +
                "WHERE (other_tags NOT LIKE '%motor_vehicle_=>_no%' OR " +
                "other_tags IS NULL) AND " +
                "highway in ('motorway', 'motorway_link', 'trunk_link', " +
                "'tertiary', 'primary', 'secondary', 'tertiary_link', " +
                "'primary_link', 'secondary_link', 'residential', 'trunk', " +
                "'service', 'living_street', 'unclassified')\" ";

exports.filterOneway = (source, input, output) => {
  source = source.toUpperCase(); //convert string to Upper Case for comparsion
  const ogrCommand = ogrJSON +  output + ' ' + input +
                (source === 'OS' ? ogrSQLOS + ogrProj : ogrSQLOSM); //construct the command
  return new Promise((resolve, reject) => { //return promise either resolved or rejected
    exec(ogrCommand, (error, stdout, stderr) => { //execute ogrCommand in the commandline (bash)
      if (error) { //check for error
        console.error(error); // print error
        reject(false); // if error reject promise with false value
      }
      resolve(true); // if no error, promise resolved with true value
    });
  });
}
