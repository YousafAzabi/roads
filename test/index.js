const {expect} = require('chai');
const {roadFlow} = require('../src/index.js');

describe('index.js is the main file and calls all other modules of RoadFlow', () => {
  it('Test Road Flow project when all input, output and temp file names are given. Return true', async () => {
    const input1 = {
      "OS": './test/io/testdataOS.gpkg',
      "OSM": './test/io/testdataOSM.xml'
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
    const expected = true;
    const output = await roadFlow(input1, input2, input3);
    expect(output).to.equal(expected);
  });

  it('Test Road Flow project when input file is wrong. Return false', async () => {
    const input1 = {
      "OS": './test/io/testdtaOS.gpkg',
      "OSM": './test/io/testdataOSM.xml'
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
    const output = await roadFlow(input1, input2, input3);
    expect(output).to.equal(expected);
  });

  it('Test Road Flow project when output directory is missing. Return false', async () => {
    const input1 = {
      "OS": './test/io/testdataOS.gpkg',
      "OSM": './test/io/testdataOSM.xml'
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
    const expected = false;
    const output = await roadFlow(input1, input2, input3);
    expect(output).to.equal(expected);
  });

  it('Test Road Flow project when output file is missing. Return false', async () => {
    const input1 = {
      "OS": './test/io/testdataOS.gpkg',
      "OSM": './test/io/testdataOSM.xml'
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
    const expected = false;
    const output = await roadFlow(input1, input2, input3);
    expect(output).to.equal(expected);
  });
});
