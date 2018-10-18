const {exec} = require('child_process'); //to run commandline Asynchronous

exports.execute = (source, input, output) => {
  source = source.toUpperCase();
  if (!source || !input || !output) {
    throw 'ERROR! Please input three paramters to function call'
  }
  if ( (source != 'OS') && (source != 'OSM') ) {
    throw 'ERROR! Data source must be from OS or OSM'
  }
  //set ogr2ogr output format (JSON) and reduce coordinates to [longitude, latitude]
  const ogrJSON = "ogr2ogr -f GeoJSON -skipfailures -dim XY ";
  //define SQL query for OS map to select related data
  const ogrSQLOS = " -sql \"SELECT localid as id, roadname as name, " +
                 "CASE WHEN directionality = 'in direction' THEN 1 " +
                 "WHEN directionality = 'in opposite direction' THEN 0 " +
                 "END as direction, geom FROM roadlink " +
                 "WHERE directionality LIKE 'in%direction' " +
                 "AND formofway = 'Single Carriageway' \" ";
  //define projection system for OS map
  const ogrProj = " -s_srs \"+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 " +
                "+x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs " +
                "+nadgrids=./input/OSTN15_NTv2_OSGBtoETRS.gsb\" -t_srs Epsg:4326 ";
  //define SQL query for OSM map to select related data
  const ogrSQLOSM = " -sql \"SELECT osm_id as id, name, other_tags as direction " +
                  "FROM lines " +
                  "WHERE other_tags NOT LIKE '%motor_vehicle%no%' AND " +
                  "other_tags LIKE '%oneway%=>%' AND " +
                  "highway in ('motorway', 'trunk', 'motorway_link', 'trunk_link', " +
                  "'tertiary', 'primary', 'secondary', 'tertiary_link', " +
                  "'primary_link', 'secondary_link', 'residential', " +
                  "'service', 'living_street', 'unclassified')\" ";

  const ogrCommand = ogrJSON +  output + ' ' + input +
                (source == 'OS' ? ogrSQLOS + ogrProj : ogrSQLOSM);

  return new Promise((resolve, reject) => {
    exec(ogrCommand, (error, stdout, stderr) => {
      if (error) { //check for error
        console.error(error); // print error
        reject(false); //if exec fail, Promise rejcet and retutn false
      }
      resolve(true); //Promise resolve and return true
    });
  });
}
