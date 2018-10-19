const assert = require('assert');
const print = require('../src/comparator/print.js');

describe('print.js displays information about script time & number of matched roads ', () => {
  it('Test header function with two input parameters. Return true', () => {
    const input1 = 674;
    const input2 = 450;
    const expected = true;
    const output = print.header(input1, input2);
    assert.equal(expected, output);
  });

  it('Test header function if one of input arguments is missing. Return false', () => {
    const input1 = 674;
    const input2 = 450;
    const expected = false;
    const output = print.header(input2);
    assert.equal(expected, output);
  });

  it('Test report function if input array is given. Return true', () => {
    const input = [1, 2, 3, 4];
    const expected = true;
    const output = print.report(input);
    assert.equal(expected, output);
  });

  it('Test report function if no array or empty is given. Return fales', () => {
    const input = [];
    const expected = false;
    const output = print.report();
    assert.equal(expected, output);
  });

  it('Test footer function if input time is given. Return true', () => {
    const input = new Date();
    const expected = true;
    const output = print.report(input);
    assert.equal(expected, output);
  });

  it('Test footer function if input time missing. Return fales', () => {
    const input = new Date();
    const expected = false;
    const output = print.report();
    assert.equal(expected, output);
  });
});
