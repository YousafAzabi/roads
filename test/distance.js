const assert = require('assert');
const distance = require('../src/comparator/distance.js');

describe('distance.js finds if distance between statring points of two links if are in range', () => {
  it('Test when road links in range. Return true', () => {
    const input1 = {"geometry": {"coordinates": [[0.13, 52],[0.1, 53], [0, 54]]}};
    const input2 = {"geometry": {"coordinates": [[0.131, 52],[0.1, 53], [0, 54]]}};;
    const expected = true;
    const output = distance.inRange(input1, input2);
    assert.equal(expected, output);
  });

  it('Test when road links not in range. Return false', () => {
    const input1 = {"geometry": {"coordinates": [[0.15, 52],[0.1, 53], [0, 54]]}};
    const input2 = {"geometry": {"coordinates": [[0.131, 52],[0.1, 53], [0, 54]]}};;
    const expected = false;
    const output = distance.inRange(input1, input2);
    assert.equal(expected, output);
  });

  it('Test when coordnates of 1st input is an empty array. Return false', () => {
    const input1 = {"geometry": {"coordinates": []}};
    const input2 = {"geometry": {"coordinates": [[0.131, 52],[0.1, 53], [0, 54]]}};;
    const expected = false;
    const output = distance.inRange(input1, input2);
    assert.equal(expected, output);
  });

  it('Test when coordnates of 2nd input is an empty array. Return false', () => {
    const input1 = {"geometry": {"coordinates": [[0.131, 52],[0.1, 53], [0, 54]]}};
    const input2 = {"geometry": {"coordinates": []}};
    const expected = false;
    const output = distance.inRange(input1, input2);
    assert.equal(expected, output);
  });

  it('Test when coordnates of 1st input is missing. Return false', () => {
    const input1 = {"geometry": {}};
    const input2 = {"geometry": {"coordinates": [[0.131, 52],[0.1, 53], [0, 54]]}};;
    const expected = false;
    const output = distance.inRange(input1, input2);
    assert.equal(expected, output);
  });

  it('Test when coordnates of 2nd input is missing. Return false', () => {
    const input1 = {"geometry": {"coordinates": [[0.131, 52],[0.1, 53], [0, 54]]}};;
    const input2 = {"geometry": {}};
    const expected = false;
    const output = distance.inRange(input1, input2);
    assert.equal(expected, output);
  });

  it('Test one input is missing. Return false', () => {
    const input1 = {"geometry": {"coordinates": [[0.13, 52],[0.1, 53], [0, 54]]}};
    const input2 = {"geometry": {"coordinates": [[0.131, 52],[0.1, 53], [0, 54]]}};;
    const expected = false;
    const output = distance.inRange(input1);
    assert.equal(expected, output);
  });
});
