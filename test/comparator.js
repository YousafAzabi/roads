const assert = require('assert');
const {expect} = require('chai');
const sinon = require('sinon');
const {compareData} = require('../src/comparator/comparator.js');
const tm = require('../src/time.js')
const time =  new Date();

describe('comparator.js', () => {
  it('Test when input and output file names are given.', () => {
    const input1 = {
      "OS": './test/io/testdataOS.json',
      "OSM": './test/io/testdataOSM.json'
    };
    const input2 = {
      "OS": './output/onewayUKOS.json',
      "OSM": './output/onewayUKOSM.json',
      "Info":'./output/onewayMismatch.json'
    };

    const clock = sinon.useFakeTimers(new Date());
    const consoleSpy = sinon.spy(console, 'info');
    const expected = '\t\tTotal time taken: \t' + tm.format(new Date() - time) + '\n';
    const output = compareData(input1, input2);
    clock.restore();
    consoleSpy.restore();
    assert(consoleSpy.withArgs(expected).calledOnce);
  });

  it('Test when one input file name is missing.', () => {
    const input1 = {
      "OS": './test/io/testdataOS.json',
      "OSM": ''
    };
    const input2 = {
      "OS": './output/onewayUKOS.json',
      "OSM": './output/onewayUKOSM.json',
      "Info":'./output/onewayMismatch.json'
    };
    const expected = 'ERROR! One or both file names are missing';
    expect( () => { compareData(input1, input2) } ).throw(expected);
  });

  it('Test when one output file name is missing.', () => {
    const input1 = {
      "OS": './test/io/testdataOS.json',
      "OSM": './test/io/testdataOSM.json'
    };
    const input2 = {
      "OS": './output/onewayUKOS.json',
      "OSM": '',
      "Info":'./output/onewayMismatch.json'
    };
    const expected = 'ERROR! Either file name or data is missing';
    expect( () => { compareData(input1, input2) } ).throw(expected);
  });
});
