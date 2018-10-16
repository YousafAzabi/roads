const filter = require('./oneway.js');

const source = 'OSM';
const input = './input/Geovation.xml';
const output = './output/map/oneway' + source + '.json';

filter.execute(source, input, output);
