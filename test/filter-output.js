const {expect} = require('chai');
const {filterDuplication} = require('../src/comparator/filter-output.js');

describe('filter-output.js deletes duplications from output data.', () => {
  it('Test when input does NOT have duplicated data.', () => {
    const input = [ {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}, {
      "properties": {
        "id": 4003,
        "name": "(1:Second Lane)"
      }}
    ];
    const expected = input;
    const output = filterDuplication(input);
    expect(output).to.eql(expected);
  });

  it('Test when input HAVE duplicated data.', () => {
    const input = [ {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}, {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}, {
      "properties": {
        "id": 4003,
        "name": "(1:Second Lane)"
      }}
    ];
    const expected = [ {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}, {
      "properties": {
        "id": 4003,
        "name": "(1:Second Lane)"
      }}
    ];
    const output = filterDuplication(input);
    expect(output).to.eql(expected);
  });

  it('Test when input HAVE more than one duplication for same link.', () => {
    const input = [ {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}, {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}, {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}
    ];
    const expected = [ {
      "properties": {
        "id": 4098,
        "name": "(1:First Road)"
      }}
    ];
    const output = filterDuplication(input);
    expect(output).to.eql(expected);
  });

  it('Test when input does not have any features.', () => {
    const input = [];
    const expected = input;
    const output = filterDuplication(input);
    expect(output).to.eql(expected);
  });
});
