const assert = require('assert');
const {isOppositeDirection} = require('../src/comparator/direction.js');
const {tolerance} = require('../src/comparator/direction.js');

const input1 = -76;
const input2 = input1 + 180;

describe('direction.js compare angle are in opposite direction with tolerance range', () => {
  it('Test angle with rotation 180 degrees. Return true', () => {
    const expected = true;
    const output = isOppositeDirection(input1, input2);
    assert.equal(expected, output);
  });

  it('Test lower bound range. Return true', () => {
    const input3 = input2 - tolerance;
    const expected = true;
    const output = isOppositeDirection(input1, input3);
    assert.equal(expected, output);
  });

  it('Test upper bound range. Return true', () => {
    const input3 = input2 + tolerance;
    const expected = true;
    const output = isOppositeDirection(input1, input3);
    assert.equal(expected, output);
  });

  it('Test angle less than lower boound range. Return false', () => {
    const input3 = input2 - tolerance - 1;
    const expected = false;
    const output = isOppositeDirection(input1, input3);
    assert.equal(expected, output);
  });

  it('Test angle larger than upper boound range. Return false', () => {
    const input3 = input2 + tolerance + 1;
    const expected = false;
    const output = isOppositeDirection(input1, input3);
    assert.equal(expected, output);
  });

  it('Test second angle is not number. Return false', () => {
    const input3 = NaN;
    const expected = false;
    const output = isOppositeDirection(input1, input3);
    assert.equal(expected, output);
  });

  it('Test first angle is not number. Return false', () => {
    const input3 = NaN;
    const expected = false;
    const output = isOppositeDirection(input3, input1);
    assert.equal(expected, output);
  });

  it('Test both angles are not numbers. Return false', () => {
    const input3 = NaN;
    const input4 = NaN;
    const expected = false;
    const output = isOppositeDirection(input3, input4);
    assert.equal(expected, output);
  });

  it('Test angles above and below zero crossing (extreme case). Return false', () => {
    const input3 = 3;
    const input4 = 357;
    const expected = false;
    const output = isOppositeDirection(input3, input2);
    assert.equal(expected, output);
  });
});
