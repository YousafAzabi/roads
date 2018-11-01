const assert = require('assert');
const {compareNames} = require('../src/comparator/checker.js');

describe('name.js comapres names of two roads', () => {
  it('Test to compare two roads have same name. Return true', () => {
    const inputOne = 'Oxford Street';
    const inputTwo = 'Oxford Street';
    const expected = true;
    const output = compareNames(inputOne, inputTwo);
    assert.equal(expected, output);
  });

  it('Test to compare two roads have very similar name. Return true', () => {
    const inputOne = 'Oxford Street';
    const inputTwo = 'Oxford St.';
    const expected = true;
    const output = compareNames(inputOne, inputTwo);
    assert.equal(expected, output);
  });

  it('Test to compare two roads have very similar name 2. Return true', () => {
    const inputOne = 'Oxford Street';
    const inputTwo = 'Oxford St';
    const expected = true;
    const output = compareNames(inputOne, inputTwo);
    assert.equal(expected, output);
  });

  it('Test to compare two roads have very similar name 3. Return true', () => {
    const inputOne = 'Oxford Road';
    const inputTwo = 'Oxford Rd.';
    const expected = true;
    const output = compareNames(inputOne, inputTwo);
    assert.equal(expected, output);
  });

  it('Test to compare two roads with different names. Return false', () => {
    const inputOne = 'Oxford Street';
    const inputTwo = 'Goswell Road';
    const expected = false;
    const output = compareNames(inputOne, inputTwo);
    assert.equal(expected, output);
  });

  it('Test to compare two roads with no names. Return false', () => {
    const inputOne = '';
    const inputTwo = '';
    const expected = false;
    const output = compareNames(inputOne, inputTwo);
    assert.equal(expected, output);
  });

  it('Test to compare roads are undefined. Return false', () => {
    const inputOne = undefined;
    const inputTwo = undefined;
    const expected = false;
    const output = compareNames(inputOne, inputTwo);
    assert.equal(expected, output);
  });
});
