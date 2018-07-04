## OS & OSM Road Parser

Once you have both your OS and OSM data sets in JSON format, the following scripts can be used to extract every oneway road and output them into a new file in a format ready for comparison. Due to the format of OS and OSM files, two separate parsers are needed.

## Usage

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
