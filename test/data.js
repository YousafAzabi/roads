const {expect} = require('chai');
const data = require('../src/comparator/data.js');

describe('', () =>{
  it('', () => {
    const input1 = {"properties": {"id": '10'}};
    const input2 = {"properties": {"id": 22, "name": 'Oxford Street'}};
    const input3 = 'some note';
    const expected = { "roadName": 'Oxford Street',
                       "OSId": '10',
                      "OSMId": '22',
                      "note": 'some note'
                    };
    const output = data.format(input1, input2, input3);
    expect(output).to.eql(expected);
  });
});
