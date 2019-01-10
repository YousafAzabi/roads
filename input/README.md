When converting to JSON should choose the right layer by adding the layer name (`roadlink` for OS and `lines` for OSM) to `ogr2ogr` command, the layer *roadlink* will be chosen as JSON file supports only one layer.

# Convert OS Data Steps:
Do not execute the step till you read all the text because the beginning is an explanation to clarify the steps which will be all combined in one line or run from the script.

The input files should be download and saved in the input folder of the project. Before starting executing the lines of code in this text.

## OS Data:
In the terminal run following lines:

To converts data to JSON format use `-f GeoJSON`, `-f ` is used to specify the output format for more choices check official website for `ogr2ogr` command.
```
ogr2ogr -f GeoJSON "./output_file_name.json" "./input_file.ext" roadlink
```

To converts the projection system from UK (EPSG 27700) to International (EPSG 4326) only done to OS data the file `OSTN15_NTv2_OSGBtoETRS.gsb` should be in the same folder or change path accordingly to the folder where it is saved.
```
ogr2ogr -f GeoJSON -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs EPSG:4326 "./output.json" "./input.json"
```

To crop the map to the coordinates required to cover the area of interest use `-clipdst Xmin Ymin Xmax Ymax`
```
ogr2ogr —f GeoJSON "./output.json" "./input.json" -clipdst -0.153 51.51 -0.146 51.515
```

* The command lines shown can be merged together. The (-f GeoJSON) code is added in all lines because if not explicitly defined then the file will be saved in the default file format (ESRI Shape-file).

### OS layers:
highwaydedicated, ferry link, ferrynode, hazard, maintenance, reinstatement, restrictionforvehicles, **roadlink**, roadnode, special designation, street, structure, ferryterminal, road, roadjuncion, turnrestriction.

## OSM Data:
To convert OS data follow same steps as with OS data but second step is not required because OSM data already in EPSG 4326 projection system, in first step choose `lines` layer and NOT `roadlink` as OSM does not have the latter layer.

### OSM links inside lines layer:
primary, primary_link, secondary, secondary_link, tertiary, tertiary_link, motorway, motorway_link, trunk, trunk_link, residential, service, living_street, unclassified.

### Filter OSM links:
Using `ogr2ogr` command to define an SQL query which filters out unwanted links (water, tube, trains, pathway, cycle paths, etc..).
```
ogr2ogr -f GeoJSON -sql "SELECT * FROM lines WHERE highway in ('motorway', 'trunk', 'motorway_link', 'trunk_link', 'tertiary', 'primary', 'secondary', 'tertiary_link', 'primary_link', 'secondary_link', 'residential', 'service', 'living_street', 'unclassified')" “./OutputFile.json” “./InputFile.json"
```

### For both files (OS and OSM) input files:
When data converted to JSON, all coordinates should be of arrays of two element arrays (longitude and latitude). However in the conversion process some of the arrays have a sub arrays of coordinates, multiLineString. The user should transform the arrays to arrays of arrays with two elements. This is done by running the script `convert-array.js`. The input file name is input parameter of function `processArray`. This process should be run for both files to avoid the possibility of any incorrectly transformed coordinates. This script improved to delete empty entries (coordinates of empty array) in the features array because they cause errors when running `comparator.js` script.
When running script `convet-array.js` for a file with large size, if an error message is displayed:

>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory

The reason is Node JS default allocated memory size is 512MB. The memory can be increased by running **node** command as follows:
```
node --max-old-space-size=4096 convert-array.js
```

The `--max-old-space-size` can have a value of `1024`, `2048`, `3072`, `4096`, `5120`, `6144`, `7168` or `8192`.

# Easier way to process the data is to combine all commands in one line as follows:
### For OSM run command line:
```
ogr2ogr -f GeoJSON "londonOSM.json" "./greater_london.osm.pbf" -clipdst -0.5 51.3 0.3 51.7 -sql "SELECT * FROM lines WHERE highway in ('motorway', 'trunk', 'motorway_link', 'trunk_link', 'tertiary', 'primary', 'secondary', 'tertiary_link', 'primary_link', 'secondary_link', 'residential', 'service', 'living_street', 'unclassified')"
```

### For OS run command line:
```
ogr2ogr -f GeoJSON -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs Epsg:4326 "./londonOSM.json" "./OSMM_HIGHWAYS_June18.gpkg" -clipdst -0.5 51.3 0.3 51.7 roadlink
```

The both last command lines the `-clipdst -0.5 51.3 0.3 51.7` can be removed if you need all the map or change the coordinates if you require different area.

### Reduce Input File
Run script below to reduce size of input file by choosing only the required information for one-way roads. First script for OS and second for OSM.
```
ogr2ogr -f GeoJSON -sql "SELECT localid, roadname, directionality, formofway FROM roadlink" "./lonOS.json" "./londonOS.json"
```
```
ogr2ogr -f GeoJSON -sql "SELECT osm_id, name, other_tags FROM lines" "./lonOSM.json" "./londonOSM.json"
```

# Run ogr2ogr Automatically from script
The script `oneway.js` runs all of the above procedure automatically. The same lines of code are defined in the script and sent to the command line for execution. The user does not have to run `oneway.js` script because it is called from the main script `run.js`.
