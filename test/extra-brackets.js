const assert = require('assert');
const {expect} = require('chai');
const brackets = require('../process-features/extra-brackets.js');

describe('extra-brackets.js script to delete extra brackets from arrays',() => {
  it('Test if input is not an array. Should return empty array []', () => {
    const input = 1;
    const expected = [];
    const output = brackets.delete(input);
    expect(output).to.eql(expected);
  });
  it('Test if input is an empty array. Should return empty array []', () => {
    const input = [];
    const expected = [];
    const output = brackets.delete(input);
    expect(output).to.eql(expected);
  });
  it('Test if input array has NO extra brackets. Should return same input array', () => {
    const input = [[1,1],[2,2]];
    const expected = [[1,1],[2,2]];
    const output = brackets.delete(input);
    expect(output).to.eql(expected);
  });
  it('Test if input array has extra brackets. Should return array without extra brackets', () => {
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
