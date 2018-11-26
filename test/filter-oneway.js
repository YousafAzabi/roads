const chai = require('chai');
const expect = chai.expect;
const chaiAsPromsied = require('chai-as-promised');
chai.use(chaiAsPromsied);
const {filterOneway} = require('../src/filter/oneway.js');

describe('filter/oneway.js using ogr2ogr to filter oneway road links', () => {
  it('Test with OSM input data. Return true', async () => {
    const source = 'osm';
    const inputFile = './test/io/testdataOSM.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = true;
    const output = await filterOneway(source, inputFile, outputFile);
    expect(output).to.equal(expected);
  });

  it('Test with OS input data. Return true', async () => {
    const source = 'oS';
    const inputFile = './test/io/testdataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = true;
    const output = await filterOneway(source, inputFile, outputFile);
    expect(output).to.equal(expected);
  });

  it('Test if input file name wrong or any ogr2ogr error.', () => {
    const source = 'os';
    const inputFile = './test/io/dataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = false;
    return expect(filterOneway(source, inputFile, outputFile)).to.be.rejectedWith(expected);
  });
});
