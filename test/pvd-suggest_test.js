'use strict';

var pvdSuggest = require('../');
var assert = require('should');

describe('pvd-suggest', function () {

  it('should create suggestions for complete single day [01]', function () {
      var period = pvdSuggest.Period.from(2014, 9).to(2015, 4);  // October 14 to May 15

      var input = '01';

      var output = pvdSuggest.createSuggestions(period, input, 5);

      output.length.should.equal(5);
  });

  it('should create suggestions for complete single day [01]', function () {
      var period = pvdSuggest.Period.from(2014, 9).to(2015, 4);  // October 14 to May 15

      var input = '4';

      var output = pvdSuggest.createSuggestions(period, input, 5);
      output.length.should.equal(5);
  });

  it('should create suggestions for complete single day [01]', function () {
      var period = pvdSuggest.Period.from(2014, 9).to(2015, 4);  // October 14 to May 15

      var input = '31';

      var output = pvdSuggest.createSuggestions(period, input, 5);

      output.length.should.equal(5);
  });

});
