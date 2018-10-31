//module for reading and writing files to disk 
const fs = require('fs');

  //========== read files and return array of data in file ==========
  exports.read = (fileOne, fileTwo) => {
    if (!fileOne || !fileTwo) { //check file names are given
      throw 'ERROR! One or both file names are missing'; //throw error
    }
    let dataOne = fs.readFileSync(fileOne); //read in OS file first
    let dataTwo = fs.readFileSync(fileTwo); //read in OSM file second
    dataOne = JSON.parse(dataOne.toString()); //parse OS data
    dataTwo = JSON.parse(dataTwo.toString()); //parse OSM data
    return [dataOne, dataTwo]; //return array of data from both files
  }

  //========== write data to output files ==========
  exports.write = (file = '', data = {}) => {
    if (!file || JSON.stringify(data) == '{}') { //check file name given & data not empty
      throw 'ERROR! Either file name or data is missing'; //throw error
    }
    let output = { //add "type" and "feature" keys to make data readible by GIS programmes
                  "type": "FeatureCollection",
                  "features": data
                  };
    fs.writeFileSync(file, JSON.stringify(output, null, 2)); //write data to file
    return true; //return true
  }
