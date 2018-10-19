
## process-features folder content

### `convert-array.js`
A script that accepts array of two elements which are input and output files. It reads data from input file, process data and then write data to output file.

### `feature-extractor.js`
It is executed by `convert-array.js` and it sets the type of the features to lineSting.

### `extra-brackets.js`
It is executed by `feature-extractor.js` and it deletes extra brackets in coordinates array.

### README.md
This file which includes explanation of the files in the folder.

The scripts in this file requires to be called from another script to be executed. The call should be to `convert-array.js` that calls `feature-extractor.js` which will in turn call `extra-brackets.js`.
