//module to compare names of two road

exports.compare = (nameOne, nameTwo) => {
  nameOne = nameOne ? nameOne : '';
  //OS roads has extra characters so sliced
  nameOne = nameOne.slice(3, (nameOne.length - 1)).toLowerCase();
  nameTwo = nameTwo ? nameTwo.toLowerCase() : '';
  //check names equal and must not be empty
  if ( (nameOne == nameTwo) && (nameOne) ) {
    return true;
  }
  return false;
}

exports.trim = (name) => {
  return name.slice(3, (name.length - 1));
}

exports.canonical = (name) => {
  const words = name.split(' ');
  const key = words[words.length - 1];
}
