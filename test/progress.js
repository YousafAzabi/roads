const {expect} = require('chai');
const sinon = require('sinon');
const {calculateProgress} = require('../src/comparator/progress.js');
const {init} = require('../src/comparator/progress.js');

describe('progress.js calculates time passed, estaimated time to finish and percentage of progress', () => {
  it('Test when both input parameters are given. Return true', () => {
    const input = {
      "totalRoadsOS": 100,
      "processedOS": 20
    };
    const expected = {
      "toPrint": true,
      "timePassed": 3500,
      "estimateTimeLeft": 14000,
      "progressPercent": 20
    };
    clock = sinon.useFakeTimers(new Date());
    init();
    clock.tick(3500);
    const output = calculateProgress(input);
    clock.restore();
    expect(output).to.eql(expected);
  });

  it('Test when both input parameters are given. Return true', () => {
    const input = {
      "totalRoadsOS": 100,
      "processedOS": 20
    };
    const expected = {};
    clock = sinon.useFakeTimers(new Date());
    init();
    clock.tick(2500);
    const output = calculateProgress(input);
    clock.restore();
    expect(output).to.eql(expected);
  });

  it('Test when one input parameter is given. Return false', () => {
    const input = {
      "totalRoadsOS": 100,
      "processedOS": 20
    };
    const expected = {};
    const output = calculateProgress(input);
    expect(output).to.eql(expected);
  });

  it('Test when both input parameters are missing. Return false', () => {
    const expected = {};
    const output = calculateProgress();
    expect(output).to.eql(expected);
  });
});
