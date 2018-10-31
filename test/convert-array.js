const assert = require('assert');
const {expect} = require('chai');
const {processArray} = require('../src/process-features/convert-array.js');

describe('convert-array.js read/write and parse JSON done here.', () => {
  it('Test script with input test file containing correct OSM data format', () => {
    const input = ['./test/io/testdataOSM.json', './test/io/testoutput.json']
    const expected = true;
    const output = processArray(input);
    assert.equal(expected, output);
  });

  it('Test script with input test file containing correct OS data format', () => {
    const input = ['./test/io/testdataOS.json', './test/io/testoutput.json']
    const expected = true;
    const output = processArray(input);
    assert.equal(expected, output);
  });

  it('Test when only one file name is given in parameter input array.', () => {
    const input = ['./test/io/testdataOSM.json'];
    const expected = 'ERROR! Parameter array must include 2 values:\n' +
                     '\tInput and Output file names';
    expect( () => { processArray(input) } ).throw(expected);
  });

  it('Test when only NONE of file names are given in parameter input array.', () => {
    const input = [];
    const expected = 'ERROR! Parameter array must include 2 values:\n' +
                     '\tInput and Output file names';
    expect( () => { processArray(input) } ).throw(expected);
  });

  it('Test when NO input is given to the function.', () => {
    const input = [];
    const expected = 'ERROR! Parameter array must include 2 values:\n' +
                     '\tInput and Output file names';
    expect( () => { processArray() } ).throw(expected);
  });
});
