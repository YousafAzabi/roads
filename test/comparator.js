const assert = require('assert');
const {expect} = require('chai');
const sinon = require('sinon');
const {compare} = require('../src/comparator/comparator.js');
const tm = require('../src/time.js')
const time =  new Date();

describe('comparator.js', () => {
  it('Test when time takes longer than 3 seconds so print is executed.', () => {
    const input1 = ['./test/io/testdataOS.json', './test/io/testdataOSM.json'];
    const input2 = {
      "outputFileOS": './output/onewayUKOS.json',
      "outputFileOSM": './output/onewayUKOSM.json',
      "outputFileInfo":'./output/onewayMismatch.json'
    };

    const clock = sinon.useFakeTimers(new Date());
    const consoleSpy = sinon.spy(console, 'info');
    const expected = '\t\tTotal time taken: \t' + tm.format(new Date() - time) + '\n';
    const output = compare(input1, input2);
    clock.restore();
    consoleSpy.restore();
    assert(consoleSpy.withArgs(expected).calledOnce);
  });

  it('Test when time takes longer than 3 seconds so print is executed.', () => {
    const input1 = ['./test/io/testdataOSM.json'];
    const input2 = {
      "outputFileOS": './output/onewayUKOS.json',
      "outputFileOSM": './output/onewayUKOSM.json',
      "outputFileInfo":'./output/onewayMismatch.json'
    };
    const expected = 'ERROR! One or both file names are missing';
    expect( () => { compare(input1, input2) } ).throw(expected);
  });
});
