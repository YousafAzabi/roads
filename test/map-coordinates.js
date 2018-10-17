const assert = require('assert');
const {expect} = require('chai');
const coordinates = require('../map-splitter/map-coordinates.js');

describe('map-coordinates.js sets coordinates of divided new maps', () => {
  it('Test if mid value is calculated correctly. Return (array fifth element) is 3.5', () => {
    const input = [1, 2, 6, 5]; // format [x1, y1, x2, y2]
    const expected = 3.5;
    const output = coordinates.setDimensions(1, input);
    assert.equal(expected, output[4]);
  });

  it('Should return ERROR if fisrt value of coordinates larger than second', () => {
    const input = [1, 6, 6, 5]; // format [x1, y1, x2, y2]
    const expected = 'ERROR! Second coordinates are smaller than first one.';
    expect(() => {coordinates.setDimensions(1, input)}).throw(expected);
  });

  it('Should return ERROR if input array size is not 4', () => {
    const input = [1, 3, 6]; // format [x1, y1, x2, y2]
    const expected = 'ERROR! Parameter input error.';
    expect(() => {coordinates.setDimensions(1, input)}).throw(expected);
  });

  it('Should return ERROR if input id is not Integer', () => {
    const input = [1, 3, 5, 6]; // format [x1, y1, x2, y2]
    const expected = 'ERROR! Parameter input error.';
    expect(() => {coordinates.setDimensions(1.6, input)}).throw(expected);
  });

});
