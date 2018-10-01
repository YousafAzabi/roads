module.exports{
  // find if OS road is oneway
  OS = (road) => {
    let direction = road.properties.directionality ? roadOS.properties.directionality : "";
    if ( (direction.search("in") != -1) && (road.properties.formofway.search("Single") != -1) ) {
      //onewayCounterOS ++;
      let angle = findDirectionAngle(road.geometry.coordinates);
      if(road.properties.directionality.search("opposite") != -1) {
        //opposite direction so add 180 to change directionilty, % 360 to range (0-360)
        angle = (angle + 180) % 360;
      }
      return angle;
    }
    return NaN;
  }

  // find if OSM road is oneway
  OSM = (road) => {
    // find oneway tag and extract it from the string "other_tags" in OSM JSON data
    if(road.properties.other_tags) {
      // check if private vehicles restricted from accessing road
      if(road.properties.other_tags.search('motor_vehicle"=>"no') != -1) {
        return NaN;
      }
      //set index to point at oneway word
      let index = road.properties.other_tags.search("oneway\"=>");
      //check if search finds "oneway" substring and if first letter is n or y for no and yes respectively.
      if(index != -1 && road.properties.other_tags.charAt(index+10).toLowerCase() == "y") {
        return findDirectionAngle(road.geometry.coordinates);
      }
    }
      //return NaN to function call so the road is not oneway
      return NaN;
  }
};
