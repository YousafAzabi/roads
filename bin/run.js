const {roadFlow}  = require('../src/index.js')

const inputFiles = {
  "OS": './input/OSMM_HIGHWAYS_June18.gpkg',
  "OSM": './input/UK_OSM.gpkg'
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
