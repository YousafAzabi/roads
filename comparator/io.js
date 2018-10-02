const fs = require('fs');

module.exports{

  //========== read files and return array of data in file ==========
  read = (fileOne, fileTwo) => {
    let dataOne = fs.readFileAsync(fileOne); //read in OS file first
    let dataTwo = fs.readFileAsync(fileTwo); //read in OSM file second
    dataOne = JSON.parse(dataOne.toString()); //parse OS data
    dataTwo = JSON.parse(dataTwo.toString()); //parse OSM data
    return [dataOne, dataTwo]; //return promise that is resolved when all files are done loading
  }

  //========== write data to output files ==========
  write = (file, data) => {
    data = JSON.stringify(data);
    const data = {
                  "type": "FeatureCollection",
                  "features": data
                  };
    fs.writeFileAsync(file, data);
  }
};
