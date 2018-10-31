const assert = require('assert');
const {isMismatch} = require('../src/comparator/direction.js');
const {tolerance} = require('../src/comparator/direction.js');

const input1 = -76;

describe('direction.js compare angle are in opposite direction with tolerance range', () => {
  it('Test angle with rotation 180 degrees. Return true', () => {
    const input2 = input1 + 180;
    const expected = true;
    const output = isMismatch(input1, input2);
    assert.equal(expected, output);
  });

  it('Test lower bound range. Return true', () => {
    const input2 = input1 + tolerance;
    const expected = true;
    const output = isMismatch(input1, input2);
    assert.equal(expected, output);
  });

  it('Test upper bound range. Return true', () => {
    const input2 = input1 + (360 - tolerance);
    const expected = true;
    const output = isMismatch(input1, input2);
    assert.equal(expected, output);
  });

  it('Test angle less than lower boound range. Return false', () => {
    const input2 = input1 + tolerance - 1;
    const expected = false;
    const output = isMismatch(input1, input2);
    assert.equal(expected, output);
  });

  it('Test angle larger than upper boound range. Return false', () => {
    const input2 = input1 + tolerance - 1;
    const expected = false;
    const output = isMismatch(input1, input2);
    assert.equal(expected, output);
  });

  it('Test second angle is not number. Return false', () => {
    const input2 = NaN;
    const expected = false;
    const output = isMismatch(input1, input2);
    assert.equal(expected, output);
  });

  it('Test first angle is not number. Return false', () => {
    const input3 = NaN;
    const input2 = 175;
    const expected = false;
    const output = isMismatch(input3, input2);
    assert.equal(expected, output);
  });

  it('Test both angles are not numbers. Return false', () => {
    const input3 = NaN;
    const input2 = NaN;
    const expected = false;
    const output = isMismatch(input3, input2);
    assert.equal(expected, output);
  });
});
