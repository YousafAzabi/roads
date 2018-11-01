const assert = require('assert');
const {isOverlapping} = require('../src/comparator/checker.js');

describe('overlap.js to find if two GIS segements overlap', () => {
  it('Test two road links that are overlaping. Return ture', () => {
    const input1 = {
      "type": 'LineString',
      "coordinates": [ [-0.1349, 51.5246], [-0.13596, 51.5242], [-0.1372, 51.5237] ]
    };
    const input2 = {
      "type": 'LineString',
      "coordinates": [ [-0.1349, 51.5245], [-0.13595, 51.5242], [-0.1372, 51.5237] ]
    };
    const expected = true;
    const output = isOverlapping(input1, input2);
    assert.equal(expected, output);
  });

  it('Test two road links that are NOT overlaping. Return false', () => {
    const input1 = {
      "type": 'LineString',
      "coordinates":[ [-0.1349, 51.5246], [-0.13596, 51.524], [-0.1372, 51.5237] ]
    };
    const input2 = {
      "type": 'LineString',
      "coordinates":[ [-0.134, 51.5245], [-0.1359, 51.5242], [-0.1372, 51.5237] ]
    };
    const expected = false;
    const output = isOverlapping(input1, input2);
    assert.equal(expected, output);
  });

  it('Test 1st road link large & 2nd small compared to overlap area. Return ture', () => {
    const input1 = {
      "type": 'LineString',
      "coordinates":[ [-0.1, 51.52], [-1, 51.52] ]
    };
    const input2 = {
      "type": 'LineString',
      "coordinates":[ [-0.1, 51.52], [-0.2, 51.52] ]
    };
    const expected = true;
    const output = isOverlapping(input1, input2);
    assert.equal(expected, output);
  });

  it('Test 1st road link small & 2nd large compared to overlap area. Return ture', () => {
    const input1 = {
      "type": 'LineString',
      "coordinates":[ [-0.1, 51.52], [-0.2, 51.52] ]
    };
    const input2 = {
      "type": 'LineString',
      "coordinates":[ [-0.1, 51.52], [-1, 51.52] ]
    };
    const expected = true;
    const output = isOverlapping(input1, input2);
    assert.equal(expected, output);
  });

  it('Test overlap area small compared to both road links. Return false', () => {
    const input1 = {
      "type": 'LineString',
      "coordinates":[ [-0.13497, 51.5246], [-0.134965, 51.5246], [-0.1359, 51.5241], [-0.1372, 51.52371] ]
    };
    const input2 = {
      "type": 'LineString',
      "coordinates":[ [-0.1349, 51.5245], [-0.134964, 51.5246], [-0.1359, 51.5242], [-0.1372, 51.52372] ]
    };
    const expected = false;
    const output = isOverlapping(input1, input2);
    assert.equal(expected, output);
  });
});
