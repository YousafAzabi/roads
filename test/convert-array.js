const assert = require('assert');
const {expect} = require('chai');
const converter = require('../process-features/convert-array.js');

describe('convert-array.js read/write and parse JSON done here.', () => {
  it('Test script with input test file containing correct data format', () => {
    const input = ['./test/testdata.json', './test/testoutput.json']
    const expected = true;
    const output = converter.process(input);
    assert.equal(expected, output);
  });

  it('Test when only one file name is given in parameter input array.', () => {
    const input = ['./test/testdata.json'];
    const expected = 'ERROR! Parameter array must include 2 values:\n' +
                     '\tInput and Output file names';
    expect(() => {converter.process(input)}).throw(expected);
  });
});
