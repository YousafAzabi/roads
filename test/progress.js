const assert = require('assert');
const sinon = require('sinon');
const progress = require('../src/comparator/progress.js');

describe('progress.js calculates time passed, estaimated time to finish and percentage of progress', () => {
  it('Test when both input parameters are given. Return true', () => {
    const input = {
      "totalRoadsOS": 100,
      "processedOS": 20
    };
    const expected = 3;
    clock = sinon.useFakeTimers(new Date());
    progress.init();
    clock.tick(3500);
    const output = progress.calculate(input).length;
    clock.restore();
    assert.equal(expected, output);
  });

  it('Test when both input parameters are given. Return true', () => {
    const input = {
      "totalRoadsOS": 100,
      "processedOS": 20
    };
    const expected = false;
    clock = sinon.useFakeTimers(new Date());
    progress.init();
    clock.tick(2500);
    const output = progress.calculate(input);
    clock.restore();
    assert.equal(expected, output);
  });

  it('Test when one input parameter is given. Return false', () => {
    const input = {
      "totalRoadsOS": 100,
      "processedOS": 20
    };
    const expected = false;
    const output = progress.calculate(input);
    assert.equal(expected, output);
  });

  it('Test when both input parameters are missing. Return false', () => {
    const expected = false;
    const output = progress.calculate();
    assert.equal(expected, output);
  });
});
