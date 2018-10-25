const {expect} = require('chai');
const sinon = require('sinon');
const print = require('../src/comparator/print.js');
const tm = require('../src/time.js');

let consoleStub;

describe('print.js displays information about script time & number of matched roads ', () => {
  beforeEach(function() {
    consoleStub = sinon.stub(console,'log');
  });

  afterEach(function() {
    consoleStub.restore();
  });

  it('Test header function with two input parameters.', () => {
    const input1 = 674;
    const input2 = 450;
    const expected = 'Nubmer of roads OS= ' + input1 + ', and OSM= ' + input2;
    print.header(input1, input2);
    expect(console.log.calledTwice).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test header function if one of input arguments is missing.', () => {
    const input1 = 674;
    const input2 = 450;
    const expected = 'ERROR! Parameter ssent to function print.header are not numbers.';
    print.header(input1);
    expect(console.log.calledTwice).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test header function if one of input arguments is NaN.', () => {
    const input1 = NaN;
    const input2 = NaN;
    const expected = 'ERROR! Parameter sent to function print.header are not numbers.';
    print.header(input1, input2);
    expect(console.log.calledTwice).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test header function if both input arguments are missing.', () => {
    const input1 = 674;
    const input2 = 450;
    const expected = 'ERROR! Parameter sent to function print.header are not numbers.';
    print.header();
    expect(console.log.calledTwice).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test report function if input array is given.', () => {
    const input = [1, 2, 3, 4];
    const expected = 'Number of roads with No-Name in OS: \t\t\t' + input[4];
    print.report(input);
    //expect(console.log.callCount(4)).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test report function if no array or empty is given.', () => {
    const input = [];
    const expected = 'ERROR! The input is empty no values to print';
    print.report();
    expect(console.log.calledOnce).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test progress function if three input values are given.', () => {
    const input1 = 70000;
    const input2 = 50000;
    const input3 = 23.1543;
    const expected = 'Progress: ' + input3.toFixed(2) + '%';
    console.error(expected);
    print.progress(input1, input2, input3);
    expect(console.log.calledThrice).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test footer function when input time is given.', () => {
    const input = new Date();
    const expected = '\t\tTotal time taken: \t' + tm.format(new Date() - input) + '\n';
    print.footer(input);
    expect(console.log.calledTwice).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test footer function when input time is missing.', () => {
    const input = new Date();
    const expected = 'ERROR! time cannot be calcualted. No starting (input) time provided';
    print.footer();
    expect(console.log.calledOnce).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });

  it('Test footer function if input time is greater than current time', () => {
    const input = new Date() * 1.1;
    const expected = 'ERROR! starting (input) time is greater than end (current) time.';
    print.footer(input);
    expect(console.log.calledTwice).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });
});
