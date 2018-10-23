const assert = require('assert');
const {expect} = require('chai');
const angle = require('../src/comparator/angle.js');

describe('angle.js to calculate and return angle in degrees', () => {
  it('Test when angle is possitive. Return angle in degree', () => {
    const input = [[1, 1], [2, 3], [4, 4]];
    const expected = 45;
    const output = angle.calculate(input);
    assert.equal(expected, output);
  });

  it('Test when angle is negative. Return angle in degree', () => {
    const input = [[-1, -1], [-2, -3], [-4, -4]];
    const expected = 225;
    const output = angle.calculate(input);
    assert.equal(expected, output);
  });

  it('Test when road like is circle first and last point is the same. Return NaN', () => {
    const input = [[1, 2], [2, 4], [4, 3], [1, 2]];
    const expected = NaN;
    const output = angle.calculate(input);
    expect(output).to.eql(expected);
  });
});
