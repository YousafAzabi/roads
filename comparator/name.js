//module to compare names of two road
exports.compare = (roadOne, roadTwo) => {
  roadOne = roadOne ? roadOne : "";
  //OS roads has extra characters so sliced
  roadOne = roadOne.slice(3, (roadOne.length - 1)).toLowerCase();
  roadTwo = roadTwo ? roadTwo.toLowerCase() : "";
  //check names equal and must not be empty
  if ( (roadOne == roadTwo) && (roadOne) ) {
    return true;
  }
  return false;
}
