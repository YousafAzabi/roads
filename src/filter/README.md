## filter folder content

### `oneway.js`
A script to execute command line ogr2ogr. It requires three input String values;
* source data ('OS' or 'OSM').
* input file names.
* output file names.
The command filters oneway road links, converts projection system and data format to JSON and extract only required data. The filtering and extraction is done through SQL query within ogr2ogr command.
