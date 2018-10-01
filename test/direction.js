const assert = require('assert');
const {expect} = require('chai');
const direction = require('../comparator/direction.js');

describe('direction.js finds the dirction of the road based on angle', () => {
  it('Test when angle in 1st quadrant', () => {
    const input = [[6, 3], [9, 6]];
    const expected = 0.25 * Math.PI;
    const output = direction.find(input);
    assert.equal(expected, output);
  });

  it('Test when angle in 2nd quadrant', () => {
    const input = [[-6, 3], [-9, 6]];
    const expected = 0.75 * Math.PI;
    const output = direction.find(input);;
    assert.equal(expected, output);
  });

  it('Test when angle in 3rd quadrant', () => {
    const input = [[-6, -3], [-9, -6]];
    const expected = - 0.75 * Math.PI;
    const output = direction.find(input);;
    assert.equal(expected, output);
  });

  it('Test when angle in 4th quadrant', () => {
    const input = [[6, -3], [9, -6]];
    const expected = - 0.25 * Math.PI;
    const output = direction.find(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is ZERO', () => {
    const input = [[6, 0], [9, 0]];
    const expected = 0;
    const output = direction.find(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is 90 degree', () => {
    const input = [[0, 3], [0, 6]];
    const expected = Math.PI / 2;
    const output = direction.find(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is 180 degree', () => {
    const input = [[-6, 0], [-9, 0]];
    const expected = Math.PI;
    const output = direction.find(input);;
    assert.equal(expected, output);
  });

  it('Test when angle is 270 degree', () => {
    const input = [[0, 6], [0, 3]];
    const expected = - Math.PI / 2;
    const output = direction.find(input);;
    assert.equal(expected, output);
  });
});
