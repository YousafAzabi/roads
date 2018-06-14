## OS & OSM Road Parser

Once you have both your OS and OSM data sets in JSON format, the following scripts can be used to extract every oneway road and output them into a new file in a format ready for comparison.

## Usage

### Requirements

In order to parse road data, you must have a road data source file in the valid, JSON format. Data sets from both Ordnance Survey and OpenSteetMap are generally downloaded in GML or OSM files respectively, and so need to be converted into JSON. Instructions for converting these files into JSON can be found within the *Data* folder. There are two different parsers, one for Ordnance Survey Data and one for OpenStreetMap data, named `jsonRoadParserOS.js` and `jsonRoadParserOSM.js`respectively.

### OS Data Parsing

To extract all of the oneway roads from the OS Data set, we will be using the `jsonRoadParserOS.js` file. In order to parse your file, you should enter the following command while in the `FileParser` directory.

```
node jsonRoadParserOS.js ..\Data\name_of_input.json ..\Input\name_of_output.json
```

After running the command, you will either get a success or error message displayed in the terminal.

### OSM Data Parsing

To extract all of the oneway roads from the OSM Data set, we will be using the `jsonRoadParserOSM.js` file. In order to parse your file, you should enter the following command while in the `FileParser` directory.

```
node jsonRoadParserOSM.js ..\Data\name_of_input.json ..\Input\name_of_output.json
```

After running the command, you will either get a success or error message displayed in the terminal.
