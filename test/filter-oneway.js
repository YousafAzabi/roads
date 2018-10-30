const chai = require('chai');
const expect = chai.expect;
const chaiAsPromsied = require('chai-as-promised');
chai.use(chaiAsPromsied);
const filter = require('../src/filter/oneway.js');

describe('filter/oneway.js using ogr2ogr to filter oneway road links', () => {
  it('Test with OSM input data. Return true', async () => {
    const source = 'osm';
    const inputFile = './test/io/testdataOSM.xml';
    const outputFile = './test/io/testoutput.json';
    const expected = true;
    const output = await filter.execute(source, inputFile, outputFile);
    expect(output).to.equal(expected);
  });

  it('Test with OS input data. Return true', async () => {
    const source = 'oS';
    const inputFile = './test/io/testdataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = true;
    const output = await filter.execute(source, inputFile, outputFile);
    expect(output).to.equal(expected);
  });

  it.skip('Test if input file name wrong or any ogr2ogr error.', () => {
    const source = 'os';
    const inputFile = './test/io/dataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = 'hi';
    return expect(filter.execute(source, inputFile, outputFile)).to.be.rejectedWith(expected);
  });

  it('Test with none valid source name. Return ERROR', () => {
    const source = 'om';
    const inputFile = './test/io/testdataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = 'ERROR! Data source must be from OS or OSM';
    expect( () => { filter.execute(source, inputFile, outputFile) }).throw(expected);
  });

  it('Test with one empty function input parameter. Return ERROR', () => {
    const source = 'os';
    const inputFile = '';
    const outputFile = './test/io/testoutput.json';
    const expected = 'ERROR! Please input three paramters to function call';
    expect( () => { filter.execute(source, inputFile, outputFile) }).throw(expected);
  });

  it('Test with one missing function input parameter. Return ERROR', () => {
    const source = 'os';
    const inputFile = './test/io/testdataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = 'ERROR! Please input three paramters to function call';
    expect( () => { filter.execute(source, outputFile) }).throw(expected);
  });
});
