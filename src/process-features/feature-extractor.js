/*
input value is GIS data (features)
calls module to process coordinates array
returns output GIS data with processed coordinates array
*/

const brackets = require('./extra-brackets')

//this is the input file to be fixed
exports.filter = (features) => {
  for (let i = 0; i < features.length; i++) {
    // check if type is MultiLineString convert it to LineString
    if (features[i].geometry.type == "MultiLineString"){
      features[i].geometry.type = "LineString";
    }

    let coordinates = brackets.delete(features[i].geometry.coordinates);
    //check if coordinates are empty delete entry
    if (coordinates.length > 0) {
      //delete extra brackets in coordinates array and save them
      features[i].geometry.coordinates = coordinates;
    } else {
      //delete element i form features
      features.splice(i, 1);
    }
  }
  return features; //return feature which has non-empty coordinates in right format
}
