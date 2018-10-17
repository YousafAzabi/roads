## Synopsis

Recording and maintaining the correct direction of traffic for oneway roads is important for routing, and needs to be monitored. The current process for validating the direction is a manual approach, which results in a slow, time-consuming update process where the majority of surveyors will be sent to random locations in order to determine if the directions are valid, most of which will already be correct. There is a clear need for a better suited detection system to reduce wasted time caused by sending surveyors to locations where the directions of roads are likely already correct.

## Proposal

An automated solution should be produced in order to minimize the amount of redundant checks surveyors will have to perform. One proposal for this is to have a system that will compare the OS Road Data with Road Data from other Map companies such as OpenStreetMap. This system should be able to detect any differences in the direction of a given road, and will flag these roads as an area of interest, giving surveyors a more relevant, and less random, list of roads that should be checked.

### Problems

There are several major obstacles involved in this project that need to be considered and overcome before the end product can be functional. These include:

- A means of identifying the same road in both the OS Data and other third party data. Identical roads should be matched and given a unique ID across both data sets.

- Each road should be given a physical value for "direction". The value assigned could be an azimuth bearing e.g (215deg).

- How are checks performed if a road is made up of one OS object but several OSM objects.

- If a change is detected, how are these areas of interest dealt with? Are they added to a new database? Displayed in an app?


## Requirements

The system **must:**
- Identify the same road between two different data sets.
- Assign each road a "direction" key and value calculated from its coordinates.
- Compare the direction attribute between identical roads, and flag and deal with any roads that have a difference in direction.
- Display/store roads that have been flagged so that surveyors can have access to them.

## Usage

There is a general work flow you can follow to get to the point of comparing road direction between OS data and multiple other data sets, which will be explained below.

1. The first step is to collect your data. OS data can be downloaded/purchased from the official [website](https://www.ordnancesurvey.co.uk/business-and-government/products/os-mastermap-highways-network.html) in formats including GML. OSM data can be collected in a number of ways, the method we will focus on is through the website [geofabrik](http://download.geofabrik.de/). From here you can download data for entire countries or cities, in an OSM file format. Once you have downloaded and unzipped your data, you can move onto the next step.

2. Once you have your data files, you can place these in the `input` directory. Once there, you can follow the instructions displayed in the `input` directory's `README.md` file in order to convert your files into JSON format and with a correct coordinate projection. Once your files have been successfully converted, you can move onto the next step.

3. Now that you have your data files in a parsable format, you can compare the two data sets to identify common roads between the two. There are two files that make up the OS & OSM Road Comparison Script, `comparator-config.json` and `comparatorY.js`. `comparator-config.json` is where you will edit the I/O settings for the script, telling the script where your input files are, and where you would like it to output results. Once this file has been configured, you can then run the following command in your terminal, while in the root directory.
```
node comparator.js
```
The output on the terminal shows the total number of roads in OS and OSM, the number of roads with zero, one and multi matches, and how many roads with no name in OS. The last line shows number of oneway mismatches between the two datasets (OS & OSM).

The output files can be imported to QGIS to see the roads mismatch and analyse the correctness of the output.

### Scripts short description:
* `comparator.js` to compare data from OS against OSM data. Configuration file is comparatorY-config.json.
* `process-features` to remove extra brackets from coordinates arrays in input files. Assures that coordinates array is constructed of 2 element arrays. It consists of 3 files (`convert-array.js`, `extra-array.js`, `features-extractor.js`).
* `map-splitter.js` to split map to smaller areas. Configuration file is map-splitter-config.json.
* `map-processing.js` to convert original map data to required format and reduce size of the file.
* `comparatar-reduce.js` to compare links of OS and OSM reduced data by map-processing.js.
* `timeprinter.js` is a module that accepts date value (in milliseconds). Used to calculate and return time in the format of `0h:0m:0s` hours, minutes and seconds. It is implemented in `comparator.js`, `map-splitter.js`, `map-processing.js` and `comparator-reduce.js`.
* folder `standalone-scripts` contains scripts which include all the code where some of them are divided to smaller scripts in other folders.

## Testing
* The code is split into smaller pieces of code modules (functions) to write a test for each part individually.
* The tests are saved in test folder and are implemented using Mocha and Chai.
* The scripts are split in individual folders;
    1. `fliter` folder contains files that use ogr2ogr to filter data.
    2. `process-features` folder contains files that assures input file coordinates are in right format.
    3. `comparator` folder contains files that compare between road links from different data sources.
* Every folder contains a README file which contains more information about the files in a specific folder.
* The scripts should be executed in the order shown in the sublist above (folders).
