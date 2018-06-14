## Data

### Formatting

In order to be eligible for parsing, OS and OSM data sets need to be converted into JSON format. Once you have your original GML/OSM files, these can be converted into JSON by running the following command.

```
ogr2ogr -dim 2 -f GeoJSON -s_srs "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +units=m +no_defs +nadgrids=./OSTN15_NTv2_OSGBtoETRS.gsb" -t_srs EPSG:4326 "./name_of_output.json" "./name_of_input.gml"
```

Once a file has been successfully converted, these files can then be parsed to extract all of the one-way roads so that they can be compared across data sets in order to determine identical roads.
