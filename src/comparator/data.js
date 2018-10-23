//module to arrange data in the format required in the output files

exports.format = (roadOS, roadOSM, note) => {
  let data = {
    "roadName": roadOSM.properties.name,
    "OSId": (roadOS.properties.id).toString(),
    "OSMId": (roadOSM.properties.id).toString(),
    "note": note
  };
  return data;
}
