const fs = require('fs');
const util = require('util');
const process = require('process');
const _ = require('lodash/core');

const uploadFile = process.argv[2]; //get upload file from cmd arguments
const outputFile = process.argv[3]; //upload new file with filtered data

if (!uploadFile) {
  console.error("\nPlease provide an upload file.\nFollow the format: node bulk.js path/uploadFile path/outputFile");
  process.exit(1);
}

//Function for filtering out bi-directional roads
isOneWay = (road) => {
  if (road.properties.other_tags) {
    return road.properties.other_tags.oneway === "yes";
  } else {
    return false;
  }
}

//Handle OSM xml tags that can't be converted to JSON (other_tags)
convertToValidJson = (roads) => {
  roads.map((road, index) => {
    let other = {};

    if (road.properties.other_tags) {
      let split_tags = road.properties.other_tags.split(','); //split tags

      split_tags.map((kv) => {
        let step1 = kv.replace(/"/g,""); //remove quotation marks
        let split = step1.split("=>"); //remove array symbols
        other[split[0]]=split[1]; //set object key value in array
      })
      road.properties["other_tags"] = other; //add array of key values to road object
    }
  })

  return roads;
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

  const newRoads = convertToValidJson(res.features); //convert other_tags xml to valid json
  const filteredRoads = newRoads.filter(isOneWay); //filter bi-directional roads

  writeFile(filteredRoads); //upload data to file
})
