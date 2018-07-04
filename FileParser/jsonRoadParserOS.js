const fs = require('fs');
const util = require('util');
const process = require('process');

const uploadFile = process.argv[2]; //get upload file from cmd arguments
const outputFile = process.argv[3]; //upload new file with filtered data

if (!uploadFile) {
  console.error("\nPlease provide an upload file.\nFollow the format: node bulk.js path/uploadFile path/outputFile");
  process.exit(1);
}

//Function for filtering out bi-directional roads
isOneWay = (road) => {
  return road.properties.directionality !== "both directions";
}

//Write data to output file
writeFile = (roads) => {
  let data = `{"roads": ${JSON.stringify(roads)}}`;
  fs.writeFile(outputFile, data, (err) => {
    if (err) {
      console.error("There was an error uploading your file.");
    } else {
      console.log("File successfully uploaded.");
    }
  });
}

//Read in existing road data
fs.readFile(uploadFile, (err, data) => {
  if (err) {
    return console.error(err);
  }
  const res = JSON.parse(data.toString()); //parse data as JSON
  let arr = res.features.filter(isOneWay); //filter to only have oneway roads

  writeFile(arr); //write data to output file
})
