'use strict';

var pvdSuggest = require('../');
var assert = require('should');

describe('pvd-suggest', function () {
    var oct14_to_may15 = pvdSuggest.Period.from(2014, 9).to(2015, 4);

    describe('single hours', function () {
        describe('complete', function () {
            it('should create suggestion [1/10 2014 6t]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '1/10 2014 6t', 5);

                output.length.should.equal(1);
                output[0].date.getFullYear().should.equal(2014);
                output[0].date.getMonth().should.equal(9);
                output[0].date.getDate().should.equal(1);
                output[0].hours.should.equal(6.0);
            });
        });
    });

    describe('single year', function () {
        describe('complete', function () {

            it('should create suggestion [31.12.2014]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '31.12.2014', 5);

                output.length.should.equal(1);
                output[0].date.getFullYear().should.equal(2014);
                output[0].date.getMonth().should.equal(11);
                output[0].date.getDate().should.equal(31);
            });
        });

        describe('incomplete', function () {
            it('should create suggestion [03.11.1]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '03.11.1', 5);

                output.length.should.equal(1);
                output[0].date.getFullYear().should.equal(2014);
                output[0].date.getMonth().should.equal(10);
                output[0].date.getDate().should.equal(3);
            });
        });
    });

    describe('single month', function () {
        describe('complete', function () {
            it('should create suggestions [01.12]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '01.12', 5);

                output.length.should.equal(1);
                output[0].date.getFullYear().should.equal(2014);
                output[0].date.getMonth().should.equal(11);
                output[0].date.getDate().should.equal(1);
            });
        });

        describe('incomplete', function () {
            var sep14_to_may15 = pvdSuggest.Period.from(2014, 8).to(2015, 4);

            it('should create suggestions [26.0]', function () {
                var output = pvdSuggest.createSuggestions(sep14_to_may15, '26.0', 5);

                output.length.should.be.greaterThan(0);
                output[0].date.getMonth().should.equal(8);  // Forventer at første forslag er 26.09.2015
            });

            it('should create suggestions [26.1]', function () {
                var output = pvdSuggest.createSuggestions(sep14_to_may15, '26.1', 3);

                output.length.should.be.greaterThan(0);
                output[0].date.getMonth().should.equal(0);
            });
        });
    });

    describe('single day', function () {
        describe('complete', function () {
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

            it('should create suggestions [31.]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '31.', 5);

                output.length.should.equal(5);
            });
        });

        describe('incomplete', function () {
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
