const assert = require('assert');
const {expect} = require('chai');
const degree = require('../comparator/to-degree.js');

describe('to-degree.js converts angle from radian to degree', () => {
  it('Test if input is not a number throw error', () => {
    const input = 'Anything which is not a number';
    const expected = 'ERROR! Input parameter must be a number (angle).';
    expect(() => {degree.convert(input)}).throw(expected);
  });

  it('Test when input is PI, Return value is 180', () => {
    const input = Math.PI;
    const expected = 180;
    const output = degree.convert(input);
    assert.equal(expected, output);
  });

  it('Test when input is -PI/2, Return value is 270', () => {
    const input = ( - Math.PI) / 2;
    const expected = 270;
    const output = degree.convert(input);
    assert.equal(expected, output);
  });

  it('Test when input is ZERO, Return value is ZERO', () => {
    const input = 0;
    const expected = 0;
    const output = degree.convert(input);
    assert.equal(expected, output);
  });
});
