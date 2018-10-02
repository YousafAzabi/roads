
process-features folder contains three script files.

* `convert-array.js` which accepts array of two elements which are input and output files. It reads data from input file, process data and then write data to output file.
* `feature-extractor.js` is executed by `convert-array.js` and it sets the type of the features to lineSting.
* `extra-brackets.js` is executed by `feature-extractor.js` and it deletes extra brackets in coordinates array.
