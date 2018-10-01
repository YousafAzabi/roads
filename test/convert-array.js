const assert = require('assert');
const converter = require('../process-features/convert-array.js');

describe('convert-array.js read/write and parse JSON done here.', () => {
  it('Test script with input test file containing correct data format', () => {
    const inputFile = './test/testdata.json';
    const outputFile = './test/testoutput.json';
    const output = converter.process(inputFile, outputFile);
    const expected = true;
    assert.equal(expected, output);
  });
});
