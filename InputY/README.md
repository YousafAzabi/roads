#Convert OS Data Steps:
##OS Data:
When converting to JSON should choose the right layer by adding the world `roadlink` to the end of the `org2org` command, the layer *roadlink* will be chosen as JSON file supports only one layer. 
Download data from company website or server.
In the terminal run following lines:
To converts data to JSON format.
```
ogr2ogr -f GeoJSON "./output_file_name.json" "./input_file.ext" roadlink
```

To converts the projection system from UK (EPSG 27700) to International (EPSG 4326).
```
ogr2ogr-f GeoJSON -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs EPSG:4326 "./output.json" "./input.json"
```

To crop the map to the coordinates required to cover the area of interest.
```
ogr2ogr —f GeoJSON "./output.json" "./input.json" -clipdst -0.153 51.51 -0.146 51.515
```

* The command lines shown can be merged together. The (-f GeoJSON) code is added in all lines because if not explicitly defined then the file will be saved in the default file format (ESRI Shape-file).

##OS layers:
highwaydedicated, ferry link, ferrynode, hazard, maintenance, reinstatement, restrictionforvehicles, **roadlink**, roadnode, special designation, street, structure, ferryterminal, road, roadjuncion, turnrestriction.

##OSM Data:
To convert OS data follow same as with OS Data steps but second step not required because OSM data is in EPSG 4326 projection system.

##OSM roads: 
primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, motorway, motorway_link, trunk, trunk_link, residential, service, living_street, unclassified.

##Filter OSM links:
Using `ogr2ogr` command to define an SQL query which filters out unwanted links (water, tube, trains, pathway, cycle paths, etc..). 
```
ogr2ogr -f GeoJSON -sql "SELECT * FROM lines WHERE highway in ('motorway', 'trunk', 'motorway_link', 'trunk_link', 'tertiary', 'primary', 'secondary', 'tertiary_link', 'primary_link', 'secondary_link', 'residential', 'service', 'living_street', 'unclassified')" “./OutputFile.json” “./InputFile.json"
```

##For both files (OS and OSM) input files:
When data converted to JSON, all coordinates should be of arrays of two element arrays (longitude and latitude). However in the conversion process some of the arrays have a sub arrays of coordinates. The user should transform the arrays to arrays of arrays with two elements. This is done by running the script `convertArray.js`. The input file should be typed in the `path = "./inputY/inputFile.json";` line of the script. The out put will be the same file with the required format. This process should be run for both files to avoid the possibility of any incorrectly converted coordinates.
When running script `convetArray.js` for a file with large size, an error message is displayed:
>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
The reason is Node JS default allocated memory is 512mb. The memory can be increased by running **node** command line as follows:
```
node --max-old-space-size=4096 convertArray.js
```
Then the `node comparatorY.js` script can be executed.

#Easier way to get data is to combine the commands as follows:
##For OSM run command line:
```
ogr2ogr -f GeoJSON "londonOSM.json" "./greater_london.osm.pbf" -clipdst -0.5 51.3 0.3 51.7 -sql "SELECT * FROM lines WHERE highway in ('motorway', 'trunk', 'motorway_link', 'trunk_link', 'tertiary', 'primary', 'secondary', 'tertiary_link', 'primary_link', 'secondary_link', 'residential', 'service', 'living_street', 'unclassified')"
```

##ForOS run command line:
```
ogr2ogr -f GeoJSON -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 "./londonOSM.json" "./OSMM_HIGHWAYS_June18.gpkg" -clipdst -0.5 51.3 0.3 51.7 roadlink
```