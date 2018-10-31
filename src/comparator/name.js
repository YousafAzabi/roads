//module to compare names of two road
const stringSimilarity = require('string-similarity');

exports.compareNames  = (nameOne, nameTwo) => {
  nameOne = nameOne ? nameOne : '';
  nameTwo = nameTwo ? nameTwo : '';
  const similarRtn = stringSimilarity.compareTwoStrings(nameOne, nameTwo) > 0.6;
  return similarRtn && !!nameOne ;
}
