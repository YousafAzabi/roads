//module for reading and writing files to disk
const fs = require('fs');

  //========== read files and return array of data in file ==========
  exports.read = (fileOne, fileTwo) => {
    if (!fileOne || !fileTwo) {
      throw 'ERROR! One or both file names are missing';
    }
    let dataOne = fs.readFileSync(fileOne); //read in OS file first
    let dataTwo = fs.readFileSync(fileTwo); //read in OSM file second
    dataOne = JSON.parse(dataOne.toString()); //parse OS data
    dataTwo = JSON.parse(dataTwo.toString()); //parse OSM data
    return [dataOne, dataTwo]; //return promise that is resolved when all files are done loading
  }

  //========== write data to output files ==========
  exports.write = (file = '', data = {}) => {
    if (!file || JSON.stringify(data) == '{}') {
      throw 'ERROR! Either file name or data is missing';
    }
    let output = {
                  "type": "FeatureCollection",
                  "features": data
                  };
    fs.writeFileSync(file, JSON.stringify(output, null, 2));
    return true;
  }
