const assert = require('assert');
const {expect} = require('chai');
const filter = require('../filter/oneway.js');

describe('filter/oneway.js using ogr2ogr to filter oneway files', () => {
  it('Test with OSM input data. Return true', (done) => {
    const source = 'osm';
    const inputFile = './test/io/testdataOSM.xml';
    const outputFile = './test/io/testoutput.json';
    const expected = true;
    const output = filter.execute(source, inputFile, outputFile);
    done();
    assert.equal(expected, output);
  });

  it('Test with OS input data. Return true', (done) => {
    const source = 'oS';
    const inputFile = './test/io/testdataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = true;
    const output = filter.execute(source, inputFile, outputFile);
    done();
    assert.equal(expected, output);
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

  it.skip('Test if input file name wrong or any ogr2ogr error. Return ERROR', () => {
    const source = 'os';
    const inputFile = './test/io/dataOS.gpkg';
    const outputFile = './test/io/testoutput.json';
    const expected = false;
    const output = filter.execute(source, inputFile, outputFile);
    assert.equal(expected, output);
  });
});
