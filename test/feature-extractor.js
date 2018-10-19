const assert = require('assert');
const {expect} = require('chai');
const extractor = require('../src/process-features/feature-extractor.js');

describe('feature-extractor.js receives GIS JSON data and returns data ' +
         'processed. Calls extra-brackets.js', () => {

  it('Test if feature is empty with no data. Returns empty array []', () => {
    const input = [];
    const expected = [];
    const output = extractor.filter(input);
    expect(output).to.eql(expected);
  });

  it('Test if feature is correct format. Returns input feature', () => {
    const input = [{ "type": "Feature",
                     "geometry": { "type": "LineString",
                                   "coordinates": [[3, 5], [2, 6], [1, 6]]
                                 }
                   },
                   { "type": "Feature",
                     "geometry": { "type": "LineString",
                                   "coordinates": [[3, 3], [2, 5]]
                                 }
                   }];
    const expected = input;
    const output = extractor.filter(input);
    expect(output).to.eql(expected);
  });

  it('Test if feature has empty coordinates. Return empty array []', () => {
    const input = [{ "type": "Feature",
                     "geometry": { "type": "LineString",
                                   "coordinates": [ ]
                                 }
                  }];
    const expected = [];
    const output = extractor.filter(input);
    expect(output).to.eql(expected);
  });

  it('Test if feature has geometry type MultiLineString. Return feature with LineString type', () => {
    const input = [{ "type": "Feature",
                     "geometry": { "type": "MultiLineString",
                                   "coordinates": [[3, 5], [2, 6]]
                                 }
                  }];
    const expected = [{ "type": "Feature",
                        "geometry": { "type": "LineString",
                                      "coordinates": [[3, 5], [2, 6]]
                                    }
                      }];
    const output = extractor.filter(input);
    expect(output).to.eql(expected);
  });

});
