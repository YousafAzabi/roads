//module to round coordinates to 7 decimal points

exports.roundNumbers = (coordinates) => {
  for(let i = 0; i < coordinates.length; i++) { //loop through coordinates of a link
    coordinates[i][0] = round(coordinates[i][0]); //round longitude of i point
    coordinates[i][1] = round(coordinates[i][1]); //round latitude of i point
  }
  return coordinates; //return rounded coordinates
}

round = (n) => { //inner function that rounds numbers
  return Math.round( n * 1e7 ) / 1e7;  //round to 7 decimal points
}
