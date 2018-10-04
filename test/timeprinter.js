const assert = require('assert');
const timeprinter = require('../timeprinter.js');

describe('timeprinter.js script', () => {
  it('Test converting of hours', () => {
    const input = 3600000;
    const expected = '1h:0m:0s';
    const output = timeprinter.print(input);
    assert.equal(expected, output);
  });
  it('Test converting of minutes', () => {
    const input = 600000;
    const expected = '10m:0s';
    const output = timeprinter.print(input);
    assert.equal(expected, output);
  });
  it('Test converting of seconds', () => {
    const input = 15000;
    const expected = '15s';
    const output = timeprinter.print(input);
    assert.equal(expected, output);
  });
  it('Test time less than a second', () => {
    const input = 900;
    const expected = 'less than a second';
    const output = timeprinter.print(input);
    assert.equal(expected, output);
  });
  it('Test negative value', () => {
    const input = -1;
    const expected = 'ERROR! negative value';
    const output = timeprinter.print(input);
    assert.equal(expected, output);
  });
});
