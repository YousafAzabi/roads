The tests are based on `Mocha` framework and the `Chai` library.

* The tests in this folder are Integration and Unit Tests.
* When executing the tests a file (`testoutput.json`) will be created in the `./test/io` folder.
* Test can be run by installing `Mocha` and `Chai` and using command line `npm test`. Or use Travis CI which runs automatically online on files pushed to GitHub.

The area used for testing from OS is cropped with these dimensions in `531520, 532260, 182110, 182810` as (x1, x2, y1, y2) based on UK projection system 27700. Area is saved in subfolder `io`.
