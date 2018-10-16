const assert = require('assert');
const time = require('../time.js');

describe('Script to convert input (date) in milliseconds to time format 0h:0m:0s', () => {
  it('Test if hours converted correctly. Return string "1h:0m:0s"', () => {
    const input = 3600000;
    const expected = '1h:0m:0s';
    const output = time.format(input);
    assert.equal(expected, output);
  });
  it('Test if minutes converted correctly. Return string "10m:0s"', () => {
    const input = 600000;
    const expected = '10m:0s';
    const output = time.format(input);
    assert.equal(expected, output);
  });
  it('Test if seconds converted correctly. Return string "15s"', () => {
    const input = 15000;
    const expected = '15s';
    const output = time.format(input);
    assert.equal(expected, output);
  });
  it('Test if date in millseconds < 1000. Return string "less than a second"', () => {
    const input = 900;
    const expected = 'less than a second';
    const output = time.format(input);
    assert.equal(expected, output);
  });
  it('Test if input value is negative. Return string "ERROR! negative value"', () => {
    const input = -1;
    const expected = 'ERROR! negative value';
    const output = time.format(input);
    assert.equal(expected, output);
  });
});
