const assert = require('assert');
const {expect} = require('chai');
const io = require('../src/comparator/io.js');

describe('io.js for read (input) and write (output) from/to files', () => {
  describe('Testing function "read" is to read two files and return data', () => {
    it('Test reading file with correct format. Return two element array', () => {
      const input1 = './test/io/testdataOS.json';
      const input2 = './test/io/testdataOSM.json';
      const expected = [117, 25];
      const arr = io.read(input1, input2);
      const output = [arr[0].features.length, arr[1].features.length];
      expect(output).to.eql(expected);
    });

    it('Test if one or both file names are missing. Throw ERROR', () => {
      const input1 = './test/io/testdataOS.json';
      const input2 = '';
      const expected = "ERROR! One or both file names are missing";
      expect( () => { io.read(input1, input2) } ).throw(expected);
    });

    it('Test if file not found. Return ', () => {
      const input1 = './test/io/testdataOS.json';
      const input2 = './test/io/este.json';
      const expected = "ENOENT: no such file or directory, open '" + input2 + "'";
      expect( () => { io.read(input1, input2) } ).throw(expected);
    });
  });

  describe('Testing function "write" is to write data to file', () => {
    it('Test writing correct data to file. Return true', () => {
      const input1 = './test/io/testoutput.json';
      const input2 = {
                      "id":01,
                      "name": "Oxford Street",
                      "geometry":
                                {
                                  "coordinates": [[1, 1], [2, 2]]
                                }
                    };
      const expected = true;
      const output = io.write(input1, input2);
      assert(expected, output);
    });

    it('Test empty file name. Return ERROR', () => {
      const input1 = '';
      const input2 = {
                      "id":01,
                      "name": "Oxford Street",
                    };
      const expected = 'ERROR! Either file name or data is missing';
      expect( () => { output = io.write(input1, input2) } ).throw(expected);
    });

    it('Test empty data. Return ERROR', () => {
      const input1 = './test/io/testoutput.json';
      const input2 = {};
      const expected = 'ERROR! Either file name or data is missing';
      expect( () => { output = io.write(input1, input2) } ).throw(expected);
    });

    it('Test missing file name. Return ERROR', () => {
      const input1 = './test/io/testoutput.json'
      const input2 = {
                      "id":01,
                      "name": "Oxford Street",
                    };
      const expected = 'ERROR! Either file name or data is missing';
      expect( () => { output = io.write(input2) } ).throw(expected);
    });

    it('Test missing file name. Return ERROR', () => {
      const input1 = './test/io/testoutput.json'
      const input2 = {
                      "id":01,
                      "name": "Oxford Street",
                    };
      const expected = 'ERROR! Either file name or data is missing';
      expect( () => { output = io.write() } ).throw(expected);
    });
  });
}); 
