const assert = require('assert');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromsied = require('chai-as-promised');
chai.use(chaiAsPromsied);
const {roadFlow} = require('../src/index.js');

describe('index.js is the main file and calls all other modules of RoadFlow', () => {
  it('Test Road Flow project when all input, output and temp file names are given.', async () => {
    const input1 = {
      "OS": './test/io/testdataOS.gpkg',
      "OSM": './test/io/testdataOSM.gpkg'
    };
    const input2 = {
      "OS": './test/io/testoutput.json',
      "OSM": './test/io/testoutput.json',
      "Info":'./test/io/testoutput.json'
    };
    const input3 = {
      "OS": './temp/OS.json',
      "OSM": './temp/OSM.json'
    };
    const consoleSpy = sinon.spy(console, 'info');
    const expected = 'FINISHED pre-processing data';
    const output = await roadFlow(input1, input2, input3);
    consoleSpy.restore();
    assert(consoleSpy.withArgs(expected).calledOnce);
  });

  it('Test Road Flow project when input file is wrong.', () => {
    const input1 = {
      "OS": './test/io/testdtaOS.gpkg',
      "OSM": './test/io/testdataOSM.gpkg'
    };
    const input2 = {
      "OS": './test/io/testoutput.json',
      "OSM": './test/io/testoutput.json',
      "Info":'./test/io/testoutput.json'
    };
    const input3 = {
      "OS": './temp/OS.json',
      "OSM": './temp/OSM.json'
    };
    const expected = false;
    const output = roadFlow(input1, input2, input3);
    return expect(output).to.be.rejected.and.to.eventually.deep.equal(expected);
  });

  it('Test Road Flow project when output directory is missing.', () => {
    const input1 = {
      "OS": './test/io/testdataOS.gpkg',
      "OSM": './test/io/testdataOSM.gpkg'
    };
    const input2 = {
      "OS": './test/ioy/testoutput.json',
      "OSM": './test/io/testoutput.json',
      "Info":'./test/io/testoutput.json'
    };
    const input3 = {
      "OS": './temp/OS.json',
      "OSM": './temp/OSM.json'
    };
    const output = roadFlow(input1, input2, input3);
    return expect(output).to.be.rejected;
  });

  it('Test Road Flow project when output file is missing.', () => {
    const input1 = {
      "OS": './test/io/testdataOS.gpkg',
      "OSM": './test/io/testdataOSM.gpkg'
    };
    const input2 = {
      "OS": './test/io/',
      "OSM": './test/io/testoutput.json',
      "Info":'./test/io/testoutput.json'
    };
    const input3 = {
      "OS": './temp/OS.json',
      "OSM": './temp/OSM.json'
    };
    const output = roadFlow(input1, input2, input3);
    return expect(output).to.be.rejected;
  });
});
