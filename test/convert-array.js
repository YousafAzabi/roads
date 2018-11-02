const assert = require('assert');
const {expect} = require('chai');
const sinon = require('sinon');
const {processArray} = require('../src/process-features/convert-array.js');

describe('convert-array.js read/write and parse JSON done here.', () => {

  it('Test script with input test file containing correct OSM data format', () => {
    const sinonSpy = sinon.spy(console, 'info');
    const input = './test/io/testdataOSM.json';
    const expected = 'Data is saved to: ' + input;
    const output = processArray(input);
    assert(sinonSpy.withArgs(expected).calledOnce);
    sinonSpy.restore();
  });

  it('Test script with input test file containing correct OS data format', () => {
    const sinonSpy = sinon.spy(console, 'info');
    const input = './test/io/testdataOS.json';
    const expected = 'Data is saved to: ' + input;
    const output = processArray(input);
    assert(sinonSpy.withArgs(expected).calledOnce);
    sinonSpy.restore();
  });

  it('Test when NO input is given to the function.', () => {
    const input = '';
    const expected = 'ENOENT: no such file or directory, open';
    expect( () => { processArray(input) } ).throw(expected);
  });
});
