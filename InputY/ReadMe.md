Convert OS Data Steps:
OS Data:
When converting to JSON should choose the right layer by adding the world “roadlink” to the end of the OGR2OGR command, the layer roadlink will be chosen as JSON file supports only one layer.
Download data from company website or server.
In the terminal run following lines:
	1.	ogr2ogr -f GeoJSON "./output_file_name.json" "./input_file.ext" roadlink
	this converts data to JSON format.
	2.	ogr2ogr-f GeoJSON "./output.json" "./input.json" -s_srs EPSG:27700 -t_srs EPSG:4326
	this converts the projection system from UK (EPSG 27700) to International (EPSG 4326).
	3.	ogr2ogr —f GeoJSON "./output.json" "./input.json" clipdst -0.153 51.51 -0.146 51.515
	•	crop the map to the coordinates required to cover the area of interest.
	•	The command lines can be merged together. The (-f GeoJSON) code is added in all lines because if not explicitly defined then the file will be saved in the default file format (ESRI Shape-file).

OS layers:
highwaydedicated, ferry link, ferrynode, hazard, maintenance, reinstatement, restrictionforvehicles, roadlink, roadnode, special designation, street, structure, ferryterminal, road, roadjuncion, turnrestriction.

OSM Data:
To convert OS data follow same as with OS Data steps but second step not required because OSM data is in EPSG 4326 projection system.

For both files (OS and OSM) input files:
When data converted to JSON, all coordinates should be of arrays of two element arrays (longitude and latitude). However in the conversion process some of the arrays have a sub arrays of coordinates. The user should transform the arrays to arrays of arrays with two elements. This is done by running the script “convertArray.js”. The input file should be typed in the 4th line of the script in variable “path”. The out put will be the same file with the required format. Then the “comparatorY.js” script can be executed.
