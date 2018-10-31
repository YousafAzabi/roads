const assert = require('assert');
const {expect} = require('chai');
const sinon = require('sinon');
const print = require('../src/comparator/print.js');
const tm = require('../src/time.js');

describe('print.js prints information about road links and time to console.', () => {
  let clock, consoleSpy;
  beforeEach(function() {
    clock = sinon.useFakeTimers();
    consoleSpy = sinon.spy(console,'info');
  });

  afterEach(function() {
    clock.restore();
    consoleSpy.restore();
  });

  it('Test "message" function with input text.', () => {
    const input = 'Hello World!';
    const expected = input;
    print.message(input);
    assert(consoleSpy.withArgs(expected).calledOnce);
  });

  it('Test "header" function with two input parameters.', () => {
    const input1 = 674;
    const input2 = 450;
    const expected1 = '\n\t\t*****\t comparator Script started at ' +
              new Date().toLocaleTimeString() + ' \t*****\n';
    const expected2 = 'Nubmer of roads OS= ' + input1 + ', and OSM= ' + input2;
    print.header(input1, input2);
    assert(consoleSpy.withArgs(expected1).calledOnce);
    assert(consoleSpy.withArgs(expected2).calledOnce);
  });

  it('Test "footer" function when input time is given.', () => {
    const input = new Date();
    const expected1 = '\t***************************************\n';
    const expected2 = '\t\tTotal time taken: \t' + tm.format(new Date() - input) + '\n';
    print.footer(input);
    assert(consoleSpy.withArgs(expected1).calledOnce);
    assert(consoleSpy.withArgs(expected2).calledOnce);
  });

  it('Test "report" function if input array is given.', () => {
    const input = {
      noMatch: 1,
      oneMatch: 2,
      multiMatch: 3,
      noName: 4
    };
    const expected1 = 'Number of OS links with NONE match in OSM: 1';
    const expected2 = 'Number of OS links with ONE  match in OSM: 2';
    const expected3 = 'Number of OS links with MULTImatch in OSM: 3';
    const expected4 = 'Number of road links without a Name in OS: 4';
    print.report(input);
    assert(consoleSpy.withArgs(expected1).calledOnce);
    assert(consoleSpy.withArgs(expected2).calledOnce);
    assert(consoleSpy.withArgs(expected3).calledOnce);
    assert(consoleSpy.withArgs(expected4).calledOnce);
  });

  it('Test "progress" function if three input values are given.', () => {
    const input = {
      "toPrint": true,
      "timePassed": 140000,
      "estimateTimeLeft": 50000,
      "progressPercent": 23.1543
    };
    const expected1 = 'Time passed: 2m:20s';
    const expected2 = 'Estimate Time Left: 50s';
    const expected3 = 'Progress: 23.15%';
    print.progress(input);
    assert(consoleSpy.withArgs(expected1).calledOnce);
    assert(consoleSpy.withArgs(expected2).calledOnce);
    assert(consoleSpy.withArgs(expected3).calledOnce);
  });

  it('Test "progress" function if three input values are given.', () => {
    const input = {
      "toPrint": false,
      "timePassed": 140000,
      "estimateTimeLeft": 50000,
      "progressPercent": 23.1543
    };
    const expected1 = 'Time passed: 2m:20s';
    const expected2 = 'Estimate Time Left: 50s';
    const expected3 = 'Progress: 23.15%';
    print.progress(input);
    assert(consoleSpy.withArgs(expected1).notCalled);
    assert(consoleSpy.withArgs(expected2).notCalled);
    assert(consoleSpy.withArgs(expected3).notCalled);
  });
});
