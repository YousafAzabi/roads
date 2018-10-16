# Convert OS Data Steps:
### OS Data:
When converting to JSON should choose the right layer by adding the world `roadlink` for OS data (and `lines` for OSM) to the end of the `org2org` command, the layer *roadlink* will be chosen as JSON file supports only one layer.
Download data from company website or server.
In the terminal run following lines:
To converts data to JSON format.
```
ogr2ogr -f GeoJSON "./output_file_name.json" "./input_file.ext" roadlink
```

To converts the projection system from UK (EPSG 27700) to International (EPSG 4326) only done to OS data the file `OSTN15_NTv2_OSGBtoETRS.gsb` should be in the folder or change path accordingly to the folder where it is saved.
```
ogr2ogr -f GeoJSON -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs EPSG:4326 "./output.json" "./input.json"
```

To crop the map to the coordinates required to cover the area of interest.
```
ogr2ogr —f GeoJSON "./output.json" "./input.json" -clipdst -0.153 51.51 -0.146 51.515
```

* The command lines shown can be merged together. The (-f GeoJSON) code is added in all lines because if not explicitly defined then the file will be saved in the default file format (ESRI Shape-file).

### OS layers:
highwaydedicated, ferry link, ferrynode, hazard, maintenance, reinstatement, restrictionforvehicles, **roadlink**, roadnode, special designation, street, structure, ferryterminal, road, roadjuncion, turnrestriction.

### OSM Data:
To convert OS data follow same as with OS Data steps but second step not required because OSM data is in EPSG 4326 projection system, in first step choose `lines` layer and not `roadlink` as OSM does not have the latter layer.

### OSM roads:
primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, motorway, motorway_link, trunk, trunk_link, residential, service, living_street, unclassified.

### Filter OSM links:
Using `ogr2ogr` command to define an SQL query which filters out unwanted links (water, tube, trains, pathway, cycle paths, etc..).
```
ogr2ogr -f GeoJSON -sql "SELECT * FROM lines WHERE highway in ('motorway', 'trunk', 'motorway_link', 'trunk_link', 'tertiary', 'primary', 'secondary', 'tertiary_link', 'primary_link', 'secondary_link', 'residential', 'service', 'living_street', 'unclassified')" “./OutputFile.json” “./InputFile.json"
```

### For both files (OS and OSM) input files:
When data converted to JSON, all coordinates should be of arrays of two element arrays (longitude and latitude). However in the conversion process some of the arrays have a sub arrays of coordinates. The user should transform the arrays to arrays of arrays with two elements. This is done by running the script `convert-array.js`. The input and output file are input files to function `process`. This process should be run for both files to avoid the possibility of any incorrectly converted coordinates. This script improved to delete empty entries (coordinates of empty array) in features array because they cause errors when running `comparatorY.js` script.
When running script `convet-array.js` for a file with large size, an error message is displayed:
>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
The reason is Node JS default allocated memory is 512mb. The memory can be increased by running **node** command line as follows:
```
node --max-old-space-size=4096 convert-array.js
```

The `--max-old-space-size` can have a value of `1024`, `2048`, `3072`, `4096`, `5120`, `6144`, `7168` or `8192`.
Then the `node comparatorY.js` script can be executed, however when file size is large the command should be `node --max-old-space-size=4096 comparatorY.js`.

# Easier way to get data is to combine the commands as follows:
### For OSM run command line:
```
ogr2ogr -f GeoJSON "londonOSM.json" "./greater_london.osm.pbf" -clipdst -0.5 51.3 0.3 51.7 -sql "SELECT * FROM lines WHERE highway in ('motorway', 'trunk', 'motorway_link', 'trunk_link', 'tertiary', 'primary', 'secondary', 'tertiary_link', 'primary_link', 'secondary_link', 'residential', 'service', 'living_street', 'unclassified')"
```

### ForOS run command line:
```
ogr2ogr -f GeoJSON -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 "./londonOSM.json" "./OSMM_HIGHWAYS_June18.gpkg" -clipdst -0.5 51.3 0.3 51.7 roadlink
```

### Reduce Input File
Run script below to reduce size of input file by choosing only the required information for oneway roads. First script for OS and second for OSM.
```
ogr2ogr -f GeoJSON -sql "SELECT localid,roadname,directionality,formofway FROM roadlink" "./lonOS.json" "./londonOS.json"
```
```
ogr2ogr -f GeoJSON -sql "SELECT osm_id,name,other_tags FROM lines" "./lonOSM.json" "./londonOSM.json"
```

# Script (map-splitter.js): Run ogr2ogr Automatically
This is an explanation for the script `map-splitter.js` which runs the above procedure all automatically. The script converts the map and subdivides the map to small areas. The script has a configuration file `map-splitter-config.json` which has all the input parameters for the script. The inputs are explained in the table shown:

| Key          | possible value                               |
|--------------|:--------------------------------------------:|
| map          | `OS` or `OSM` to run relevant code           |
| Async        | `yes` for Asynchronous, otherwise Synchronous|
| stages       | Total number of smaller areas = 2^stages     |
| fileTag      | fileTag + area number used for saving files  |
| outPath      | Directory in which output files are saved    |
| inputOS      | OS input file (must start with a space)      |
| inputOSM     | OSM input file (must start with a space)     |
| startLong    | smallest longitude of map                    |
| startLat     | smallest latitude of map                     |
| endLong      | largest longitude of map                     |
| endLat       | largest latitude of map                      |

The script first preprocessing (convert projection system, filters the information using SQL query and reducing coordinates from 3D to 2D) of the whole input map and generate output file in JSON format. Then calls functions `setMapDimensions` and `splitMap` to split the map to `2^stages` areas by dividing every are to two subdivisions and so on. This script only works correctly in asynchronous mode for now.
The script has been tested for the whole UK data with `stages = 4` on a macBook Pro with 16GB DDR3 RAM and 2.5GHz Intel iCore 7 processor. The script took around 2h:30m to process OS data and 45min for OSM data.
