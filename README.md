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

2. Once you have your data files, you can place these in the `Data` directory. Once there, you can follow the instructions displayed in the `Data` directory's `README.md` file in order to convert your files into JSON format and with a correct coordinate projection. Once your files have been successfully converted, you can move onto the next step.

3. Now that you have your data files in a parsable format, you can follow the instructions in the `FileParser` directory's `README.md` file on how to run the command to extract all of the oneway roads from your data sets. Once you have successfully run the command and filtered your data, you can move onto the next step.

4. Now that you have all of the one way roads, you can compare the two data sets to identify common roads betwee the two. There are two files that make up the OS & OSM Road Comparison Script, `comparator-config.json` and `comparator.js`. `comparator-config.json` is where you will edit the I/O settings for the script, telling the script where your input files are, and where you would like it to output results. Once this file has been configured, you can then run the following command in your terminal, while in the root directory.
```
node comparator.js
```
Once you have run this, you will begin to see output displayed in the terminal as the script iterates through the OS Roads and displays possible road matches found in the OSM Data set. These results will also be saved into an output file saved in your **Output** folder. Once the script has finished running, you can move onto the final step.

5. You will now have two files in your **Output** folder that contain matched roads between the two data sets with unique IDs. You can now use the script `direction.js` to compare these matched roads and determine whether the direction of traffic is the same. You can edit the config settings for this script in the `direction-config.json` file. Once this file has been configured, you can run the following command in your terminal, when in the root directory.
```
node direction.js
```
Once the script has finished running, you will see a new output file in the root directory that contains all of the roads that were flagged when running `direction.js`.
