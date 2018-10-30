const assert = require('assert');
const compareOSroadWithOSM = require('../src/comparator/compareOSroadWithOSM.js');

describe('compareOSroadWithOSM.js compare OS link aganist all OSM loop', () => {
  describe('Testing "conditions" function that checks matching conditions', () => {
    it('Test when links have same name, overlap and in OPPOSITE direction. Return string', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 0},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input2 = {
        "properties": { "id": 201,"name": "Some Road","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input3 = 3;
      const expected = 'OS 225 OSM 45 direction mismatch';
      const output = compareOSroadWithOSM.conditions(input1, input2, input3);
      assert.equal(expected, output);
    });

    it('Test when links have same name, overlap and in SAME direction. Return emtpy string', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 1},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input2 = {
        "properties": { "id": 201,"name": "Some Road","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input3 = 3;
      const expected = '';
      const output = compareOSroadWithOSM.conditions(input1, input2, input3);
      assert.equal(expected, output);
    });

    it('Test when links have same name but do NOT overlap. Return false', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 1},
        "geometry": {"coordinates": [[5, 5], [3, 6]]} };
      const input2 = {
        "properties": { "id": 201,"name": "Some Road","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input3 = 3;
      const expected = false;
      const output = compareOSroadWithOSM.conditions(input1, input2, input3);
      assert.equal(expected, output);
    });

    it('Test when links have DIFFERENT names. Return false', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 1},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input2 = {
        "properties": { "id": 201,"name": "Another Street","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input3 = 3;
      const expected = false;
      const output = compareOSroadWithOSM.conditions(input1, input2, input3);
      assert.equal(expected, output);
    });
  });

  describe('Testing "compare" function that checks matching conditions', () => {
    it('Test when all links are NOT in distance range.', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 1},
        "geometry": {"coordinates": [[7, 9], [12, 5]]} };
      const input2 = {"features": [
        {"properties": { "id": 201,"name": "First Street","direction": '"oneway"=>"no"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]}},
        {"properties": { "id": 202,"name": "Second Street","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[5, 1], [3, 4]]} } ]};
      const input3 = {OS: [], OSM: [], info: []};
      const expected = 'noMatch';
      const output = compareOSroadWithOSM.compare(input1, input2, input3);
      assert.equal(expected, output);
    });

    it('Test when some links are in distance range but NO match. Return string', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 1},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input2 = {"features": [
        {"properties": { "id": 201,"name": "First Street","direction": '"oneway"=>"no"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} },
        {"properties": { "id": 202,"name": "Second Street","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[5, 1], [3, 4]]} } ]};
      const input3 = {OS: [], OSM: [], info: []};
      const expected = 'noMatch';
      const output = compareOSroadWithOSM.compare(input1, input2, input3);
      assert.equal(expected, output);
    });

    it('Test when some links are in distance range with ONE match. Return string', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 1},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input2 = {"features": [
        {"properties": { "id": 201,"name": "Some Road","direction": '"oneway"=>"no"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} },
        {"properties": { "id": 202,"name": "Second Street","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[5, 1], [3, 4]]} } ]};
      const input3 = {OS: [], OSM: [], info: []};
      const expected = 'oneMatch';
      const output = compareOSroadWithOSM.compare(input1, input2, input3);
      assert.equal(expected, output);
    });

    it('Test when some links are in distance range with MULTI matches. Return string', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 1},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input2 = {"features": [
        {"properties": { "id": 201,"name": "Some Road","direction": '"oneway"=>"no"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} },
        {"properties": { "id": 202,"name": "Some Road","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} } ]};
      const input3 = {OS: [], OSM: [], info: []};
      const expected = 'multiMatch';
      const output = compareOSroadWithOSM.compare(input1, input2, input3);
      assert.equal(expected, output);
    });

    it('Test when some links are in distance range with ONE match and opposite direction. Return string', () => {
      const input1 = {
        "properties": { "id": 1,"name": "(1:Some Road)","direction": 0},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} };
      const input2 = {"features": [
        {"properties": { "id": 201,"name": "Some Road","direction": '"oneway"=>"no"'},
        "geometry": {"coordinates": [[1, 1], [2, 2]]} },
        {"properties": { "id": 202,"name": "Second Street","direction": '"oneway"=>"yes"'},
        "geometry": {"coordinates": [[5, 1], [3, 4]]} } ]};
      const input3 = {OS: [], OSM: [], info: []};
      const expected = 'oneMatch';
      const output = compareOSroadWithOSM.compare(input1, input2, input3);
      assert.equal(expected, output);
    });
  });
});
