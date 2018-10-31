const assert = require('assert');
const {expect} = require('chai');
const {calculateAngle} = require('../src/comparator/findAngle.js');

describe('findAngle.js finds the dirction of the road based on angle', () => {
  it('Test when angle in 1st quadrant', () => {
    const input = [[6, 3], [9, 6]];
    const expected = 45;
    const output = calculateAngle(input);
    assert.equal(expected, output);
  });

  it('Test when angle in 2nd quadrant', () => {
    const input = [[-6, 3], [-9, 6]];
    const expected = 135;
    const output = calculateAngle(input);;
    assert.equal(expected, output);
  });

  it('Test when angle in 3rd quadrant', () => {
    const input = [[-6, -3], [-9, -6]];
    const expected = 225;
    const output = calculateAngle(input);;
    assert.equal(expected, output);
  });

  it('Test when angle in 4th quadrant', () => {
    const input = [[6, -3], [9, -6]];
    const expected = 315;
    const output = calculateAngle(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is ZERO', () => {
    const input = [[6, 0], [9, 0]];
    const expected = 0;
    const output = calculateAngle(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is 90 degree', () => {
    const input = [[0, 3], [0, 6]];
    const expected = 90;
    const output = calculateAngle(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is 180 degree', () => {
    const input = [[-6, 0], [-9, 0]];
    const expected = 180;
    const output = calculateAngle(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is 270 degree', () => {
    const input = [[0, 6], [0, 3]];
    const expected = 270;
    const output = calculateAngle(input);
    assert.equal(expected, output);
  });

  it('Test when start and finish points are the same (ie roundabout)', () => {
    const input = [[6, 3], [9, 6], [8, 4], [6, 3]];
    const expected = NaN;
    const output = calculateAngle(input);
    expect(output).to.eql(expected);
  });
});
