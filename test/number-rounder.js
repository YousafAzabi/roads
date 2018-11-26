const {expect} = require('chai');
const {roundNumbers} = require('../src/process-features/number-rounder.js');

describe('number-rounder.js to round coordinates to 7 decimal point', () => {
  it('Test when coordinates are rounded with some to upper and lower bound.', () => {
    const input = [[-0.1349098573, 51.5246098373], [-0.13596983326, 51.52333342]];
    const expected = [[-0.1349099, 51.5246098], [-0.1359698, 51.5233334]];
    const output = roundNumbers(input);
    expect(output).to.eql(expected);
  });

  it('Test when coordinates are short and not rounded.', () => {
    const input = [[-0.1349, 51.52], [-0.1355678, 51]];
    const expected = [[-0.1349, 51.52], [-0.1355678, 51]];
    const output = roundNumbers(input);
    expect(output).to.eql(expected);
  });

  it('Test when coordinates are empty array.', () => {
    const input = [];
    const expected = [];
    const output = roundNumbers(input);
    expect(output).to.eql(expected);
  });
});
