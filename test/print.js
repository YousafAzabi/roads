const assert = require('assert');
const {expect} = require('chai');
const sinon = require('sinon');
const print = require('../src/comparator/print.js');
const tm = require('../src/time.js');

describe('print.js prints information about road links and time to console.', () => {
  describe('Testing using sinon for functions that use console.info and Date()', () => {
    let clock, consoleSpy;
    beforeEach(function() {
      clock = sinon.useFakeTimers();
      consoleSpy = sinon.spy(console,'info');
    });

    afterEach(function() {
      clock.restore();
      consoleSpy.restore();
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
      const input = [140000, 50000, 23.1543];
      const expected1 = 'Time passed: 2m:20s';
      const expected2 = 'Estimate Time Left: 50s';
      const expected3 = 'Progress: 23.15%';
      print.progress(input);
      assert(consoleSpy.withArgs(expected1).calledOnce);
      assert(consoleSpy.withArgs(expected2).calledOnce);
      assert(consoleSpy.withArgs(expected3).calledOnce);
    });

    it('Test "progress" function if three input values are given.', () => {
      const input = [140000, 'a', 23.1543];
      const expected = 'ERROR! One or more of input values are NOT numbers.';
      print.progress(input);
      assert(consoleSpy.withArgs(expected).calledOnce);
    });

    it('Test "progress" function if input array is not given.', () => {
      const expected = 'ERROR! One or more of input values are missing.';
      print.progress();
      assert(consoleSpy.withArgs(expected).calledOnce);
    });

    it('Test "progress" function if input array has elements < 3.', () => {
      const expected = 'ERROR! One or more of input values are missing.';
      print.progress();
      assert(consoleSpy.withArgs(expected).calledOnce);
    });

    it('Test "footer" function when input time is given.', () => {
      const input = new Date();
      const expected1 = '\t***************************************\n';
      const expected2 = '\t\tTotal time taken: \t' + tm.format(new Date() - input) + '\n';
      print.footer(input);
      assert(consoleSpy.withArgs(expected1).calledOnce);
      assert(consoleSpy.withArgs(expected2).calledOnce);
    });
  });

  describe('Testing using chai for functions that throw errors', () => {
    it('Test "header" function if one of input arguments is missing.', () => {
      const input1 = 674;
      const expected = 'ERROR! Parameter sent to function print.header are not numbers.';
      expect( () => { print.header(input1) } ).throw(expected);
    });

    it('Test "header" function if one of input arguments is NaN.', () => {
      const input1 = NaN;
      const input2 = NaN;
      const expected = 'ERROR! Parameter sent to function print.header are not numbers.';
      expect( () => { print.header(input1, input2) } ).throw(expected);

    });

    it('Test "header" function if both input arguments are missing.', () => {
      const expected = 'ERROR! Parameter sent to function print.header are not numbers.';
      expect( () => { print.header() } ).throw(expected);
    });

    it('Test "report" function if no array or empty is given.', () => {
      const input = [];
      const expected = 'ERROR! The mismatch counters are empty no values to print';
      expect( () => { print.report() } ).throw(expected);
    });

    it('Test "footer" function when input time is missing.', () => {
      const input = new Date();
      const expected = 'ERROR! time cannot be calcualted. No starting (input) time provided';
      expect( () => { print.footer() } ).throw(expected);
    });

    it('Test "footer" function if input time is greater than current time', () => {
      const input = new Date() * 10;
      const expected = 'ERROR! starting (input) time is greater than end (current) time.';
      expect( () => { print.footer(input) } ).throw(expected);
    });
  });
});
