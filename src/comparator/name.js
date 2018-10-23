//module to compare names of two road
const stringSimilarity = require('string-similarity');

exports.compare = (nameOne, nameTwo) => {
  nameOne = nameOne ? nameOne : '';
  nameTwo = nameTwo ? nameTwo : '';
  const similarRtn = stringSimilarity.compareTwoStrings(nameOne, nameTwo) > 0.6;
  return similarRtn && !!nameOne ;
}
