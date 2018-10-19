const assert = require('assert');
const generator = require('../src/comparator/note-generator.js');

const input1 = -76;

describe('note-generator.js compare angle are in opposite direction with tolerance range', () => {
  it('Test angle with rotation 180 degrees. Return message', () => {
    const input2 = input1 + 180;
    const expected = 'OS ' + input1 + ' OSM ' + input2 + ' direction mismatch';
    const output = generator.generate(input1, input2);
    assert.equal(expected, output);
  });

  it('Test lower bound range. Return message', () => {
    const input2 = input1 + generator.tolerance;
    const expected = 'OS ' + input1 + ' OSM ' + input2 + ' direction mismatch';
    const output = generator.generate(input1, input2);
    assert.equal(expected, output);
  });

  it('Test upper bound range. Return message', () => {
    const input2 = input1 + (360 - generator.tolerance);
    const expected = 'OS ' + input1 + ' OSM ' + input2 + ' direction mismatch';
    const output = generator.generate(input1, input2);
    assert.equal(expected, output);
  });

  it('Test angle less than lower boound range. Return empty message', () => {
    const input2 = input1 + generator.tolerance - 1;
    const expected = '';
    const output = generator.generate(input1, input2);
    assert.equal(expected, output);
  });

  it('Test angle larger than upper boound range. Return empty message', () => {
    const input2 = input1 + generator.tolerance - 1;
    const expected = '';
    const output = generator.generate(input1, input2);
    assert.equal(expected, output);
  });

  it('Test second angle is not number. Return message', () => {
    const input2 = NaN;
    const expected = 'OS oneway & OSM twoway';
    const output = generator.generate(input1, input2);
    assert.equal(expected, output);
  });
});
