const assert = require('assert');
const comparatorY = require('../comparatorY.js');

describe('comparatorY', () => {
    it('bla 5', () => {
      const input = Math.PI;
      const expected = 180;
      const output = comparatorY.convertToDegree(input);
      assert.equal(expected, output);
    });
});
