const {roadFlow}  = require('../src/index.js')

const inputFiles = {
<<<<<<< HEAD
  "OS": './input/London_OS.gpkg',
  "OSM": './input/London_OSM.pbf'
=======
  "OS": './input/OSMM_HIGHWAYS_June18.gpkg',
  "OSM": './input/UK_OSM.pbf'
>>>>>>> e84be09860332fbb03da67008eee7e21354bd778
};

const outputFiles = {
  "OS": './output/onewayUKOS.json',
  "OSM": './output/onewayUKOSM.json',
  "Info":'./output/onewayMismatch.json'
};

const tempFiles = {
  "OS": './temp/OS.json',
  "OSM": './temp/OSM.json'
};

roadFlow(inputFiles, outputFiles, tempFiles);
