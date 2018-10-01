const assert = require('assert');
const converter = require('../process-features/convert-array.js');

describe('convert-array.js read/write and parse JSON done here.', () => {
  it('Test script with input test file containing correct data format', () => {
    const input = ['./test/testdata.json', './test/testoutput.json']
    const expected = true;
    const output = converter.process(input);
    assert.equal(expected, output);
  });
});
