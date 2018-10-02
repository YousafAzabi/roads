const angleTolerance = 170; //tolerance of road vector angles in Degree.

module.exports{

  //========== format data to be written to file ==========
  format = (angleOne, angleTwo) => {
    //compare angle presence for road segments from OS & OSM
    let note = "";
    if ((angleOne != NaN) && (angleTwo == NaN)) {
      note =  "OS oneway & OSM twoway";
    } else if((angleOne == NaN) && (angleTwo != NaN)) {
      note =  "OS twoway & OSM oneway";
    } else if((angleOne != NaN) && (angleTwo != NaN)) {
      //compare angle differnce falls in range to be considered opposite direction
      if ( (Math.abs(angleOne - angleTwo) > angleTolerance)
        && (Math.abs(angleOne - angleTwo) < (360 - angleTolerance)) ) {
        note = "OS " + angleOne + "  OSM " + angleOSM + "  direction mismatch";
      }
    }
    return note;
  }

  //========== format data to be written to file ==========
  writeOutput = (array, roadOS, roadOSM, Note) => {
    let data = {
      "roadName": roadOS.properties.roadname.slice(3,roadOS.properties.roadname.length-1),
      "OSId": (roadOS.properties.localid).toString(),
      "OSMId": roadOSM.properties.osm_id,
      "note": Note
    };
    array.push(data);
    arrayOS.push(roadOS);
    arrayOSM.push(roadOSM);
  }
};
