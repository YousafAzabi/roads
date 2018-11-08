/*
input value is GIS data (features)
calls module to process coordinates array
returns output GIS data with processed coordinates array
*/

const deleteBrackets = require('./extra-brackets').delete

//this is the input file to be fixed
exports.filter = (features) => {
  for (let i = 0; i < features.length; i++) {
    let geometry = features[i].geometry;
    // check if type is MultiLineString convert it to LineString
    if (geometry.type == "MultiLineString"){
      geometry.type = "LineString";
    }

    const coordinates = deleteBrackets(geometry.coordinates);
    geometry.coordinates = coordinates;
    //check if coordinates are empty delete entry
    if (coordinates.length === 0) {
      //delete element i form features
      delete features[i];
    }
  }
  return features; //return feature which has non-empty coordinates in right format
}
