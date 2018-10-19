const assert = require('assert');
const overlap = require('../src/comparator/overlap.js');

describe('overlap.js to find if two GIS segements overlap', () => {
  it('Test two segements that are overlaping. Return ture', () => {
    const input1 = [ [-0.1349, 51.5246], [-0.13596, 51.5242], [-0.1372, 51.5237] ];
    const input2 = [ [-0.1349, 51.5245], [-0.13595, 51.5242], [-0.1372, 51.5237] ];
    const expected = true;
    const output = overlap.compare(input1, input2);
    assert.equal(expected, output);
  });

  it('Test two segements that are NOT overlaping. Return false', () => {
    const input1 = [ [-0.1349, 51.5246], [-0.13596, 51.524], [-0.1372, 51.5237] ];
    const input2 = [ [-0.134, 51.5245], [-0.1359, 51.5242], [-0.1372, 51.5237] ];
    const expected = false;
    const output = overlap.compare(input1, input2);
    assert.equal(expected, output);
  });

  it('Test if one segement is empty. Return false', () => {
    const input1 = [ ];
    const input2 = [ [-0.134, 51.5245], [-0.1359, 51.5242], [-0.1372, 51.5237] ];
    const expected = false;
    const output = overlap.compare(input1, input2);
    assert.equal(expected, output);
  });
});
