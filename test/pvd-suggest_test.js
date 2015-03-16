'use strict';

var pvdSuggest = require('../');
var assert = require('should');

describe('pvd-suggest', function () {
    describe('single month', function () {
        describe('complete', function () {
            var oct14_to_may15 = pvdSuggest.Period.from(2014, 9).to(2015, 4);

            it('should create suggestions [01.12]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '01.12', 5);

                output.length.should.equal(1);
            });
        });

        describe('incomplete', function () {
            var sep14_to_may15 = pvdSuggest.Period.from(2014, 8).to(2015, 4);

            it('should create suggestions [26.0]', function () {
                var output = pvdSuggest.createSuggestions(sep14_to_may15, '26.0', 5);

                output.length.should.be.greaterThan(0);
                output[0].date.getMonth().should.equal(8);  // Forventer at første forslag er 26.09.2015
            });

            it('should create suggestions [31.]', function () {
                var output = pvdSuggest.createSuggestions(sep14_to_may15, '31.', 5);

                console.log(output);

                output.length.should.be.greaterThan(0);
            });
        });
    });

    describe('single day', function () {
        describe('complete', function () {
            var oct14_to_may15 = pvdSuggest.Period.from(2014, 9).to(2015, 4);

            it('should create suggestions [01]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '01', 5);

                output.length.should.equal(5);
                output[0].date.getMonth().should.equal(9);
            });

            it('should create suggestions [4]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '4', 5);

                output.length.should.equal(5);
            });

            it('should create suggestions [31]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '31', 5);

                output.length.should.equal(5);
            });
        });

        describe('incomplete', function () {
            var oct14_to_may15 = pvdSuggest.Period.from(2014, 9).to(2015, 4);

            it('should create suggestions []', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '', 5);

                output.length.should.equal(5);
                output[0].date.getDate().should.equal(1);
            });

            it('should create suggestions [0]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '0', 5);

                output.length.should.equal(5);
                output[0].date.getDate().should.equal(1);
            });

            it('should create suggestions [3]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '3', 5);

                output.length.should.equal(5);
                output[0].date.getDate().should.equal(30);
            });
        });
    });
});
