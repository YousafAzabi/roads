const {expect} = require('chai');
const sinon = require('sinon');
const progress = require('../src/comparator/progress.js');
const print = require('../src/comparator/print.js');

let printStub, consoleStub;

describe.skip('progress.js calculates time passed, estaimated time to finish and percentage of progress', () => {
  beforeEach(function() {
    printStub = sinon.stub(print,'progress');
    consoleStub = sinon.stub(console,'log');
  });

  afterEach(function(){
    printStub.restore();
    consoleStub.restore();
  });

  it('Test when both input data are given.', () => {
    const input1 = {
      "totalRoadsOS": 0,
      "processedOS": 0
    };
    const input2 = new Date() - 5000;
    progress.calculate(input1, input2);
    expect(print.progress.calledOnce).to.be.true;
  });

  it('Test when one input data is given.', () => {
    const input1 = {
      "totalRoadsOS": 0,
      "processedOS": 0
    };
    const input2 = new Date() - 5000;
    progress.calculate(input1);
    expect(print.progress.notCalled).to.be.true;
  });

  it('Test when both input data are missing.', () => {
    const input1 = {
      "totalRoadsOS": 0,
      "processedOS": 0
    };
    const input2 = new Date() - 5000;
    expected = 'ERROR! Counters input is missing.';
    progress.calculate();
    expect(print.progress.notCalled).to.be.true;
    expect(console.log.calledWith(expected)).to.be.true;
  });
});
