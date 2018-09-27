const assert = require('assert');
const {expect} = require('chai');
const brackets = require('../convert-array/extra-brackets.js');

describe('extra-brackets.js script to delete extra brackets',() => {
  it('Should return 0 if input is not an array', () => {
    const input = 1;
    const expected = 0;
    const output = brackets.delete(input);
    assert.equal(expected, output);
  });
  it('Should return 0 if array is empty', () => {
    const input = [];
    const expected = 0;
    const output = brackets.delete(input);
    assert.equal(expected, output);
  });
  it('Should return same input array if array correctly orgnized', () => {
    const input = [[1,1],[2,2]];
    const expected = [[1,1],[2,2]];
    const output = brackets.delete(input);
    expect(output).to.eql(expected);
  });
  it('Should return array without extra brackets', () => {
    const input = [[[1,1], [2,2]], [3,3]];
    const expected = [[1,1], [2,2], [3,3]];
    const output = brackets.delete(input);
    expect(output).to.eql(expected);
  });
  // it('Should return ERROR if not array', () => {
  //   const input = 1;
  //   const expected = 'input is not an array';
  //   expect(() => {brackets.delete(input)}).throw(expected);
  //   //assert.equal(expected, output);
  // });
});
