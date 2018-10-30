const chai = require('chai');
const expect = chai.expect;
const chaiAsPromsied = require('chai-as-promised');
chai.use(chaiAsPromsied);
const sinon = require('sinon');
const comparator = require('../src/comparator/comparator.js');

describe('comparator.js', () => {
  it('Test when input data is right and promise is resolved.', async () => {
    const input1 = ['./test/io/testdataOS.json', './test/io/testdataOSM.json'];
    const input2 = {
      "outputFileOS": './output/onewayUKOS.json',
      "outputFileOSM": './output/onewayUKOSM.json',
      "outputFileInfo":'./output/onewayMismatch.json'
    };
    const expected = 2;
    const output = await comparator.start(input1, input2);
    expect(output.length).to.eql(expected);
  });

  it('Test when time takes longer than 3 seconds so print is executed.', async () => {
    const input1 = ['./test/io/testdataOS.json', './test/io/testdataOSM.json'];
    const input2 = {
      "outputFileOS": './output/onewayUKOS.json',
      "outputFileOSM": './output/onewayUKOSM.json',
      "outputFileInfo":'./output/onewayMismatch.json'
    };
    const expected = 2;
    const clock = sinon.useFakeTimers(new Date());
    clock.tick(3500);
    const output = await comparator.start(input1, input2);
    clock.restore();
    expect(output.length).to.eql(expected);
  });

  it('Test when input files wrong and promise is rejected.', () => {
    const input1 = ['./test/io/testdatOS.json', './test/io/testdataOSM.json'];
    const input2 = {
      "outputFileOS": './output/onewayUKOS.json',
      "outputFileOSM": './output/onewayUKOSM.json',
      "outputFileInfo":'./output/onewayMismatch.json'
    };
    const expected = "ENOENT: no such file or directory, open './test/io/testdatOS.json'";
    return expect(comparator.start(input1, input2)).to.be.rejectedWith(expected);
  });

  it('Test when input file is missing and promise is rejected.', () => {
    const input1 = ['./test/io/testdataOS.json'];
    const input2 = {
      "outputFileOS": './output/onewayUKOS.json',
      "outputFileOSM": './output/onewayUKOSM.json',
      "outputFileInfo":'./output/onewayMismatch.json'
    };
    const expected = 'ERROR! One or both file names are missing';
    return expect(comparator.start(input1, input2)).to.be.rejectedWith(expected);
  });
});
