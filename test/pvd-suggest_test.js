'use strict';

var pvdSuggest = require('../');
var assert = require('should');

describe('pvd-suggest', function () {
    var oct14_to_may15 = pvdSuggest.Period.from(2014, 9).to(2015, 4);
    var jan99_to_jan14 = pvdSuggest.Period.from(1999, 0).to(2014, 0);

    describe('range year', function () {
        describe('incomplete', function () {
            it('should create suggestions for long period [10.10.2010 - 10.10.]', function () {
                var output = pvdSuggest.createSuggestions(jan99_to_jan14, '10.10.2010 - 10.10.', 10);

                output.length.should.equal(10);
            });

            it('should create 10 suggestions [10.10.14 - 10.4]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '10.10.14 - 10.4', 10)

                output.length.should.equal(10);
            });
        });
    });

    describe('range month', function () {
        describe('incomplete', function () {
            it('should create suggestions for [31.12.2014 - 30.]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '31.12.2014 - 30.', 5);

                output[0].secondDate.getDate().should.equal(30);

                output.length.should.equal(5);
            });

            it('should create suggestions for [31.12.2014 - 20.0]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '31.12.2014 - 20.0', 5);

                output[0].secondDate.getDate().should.equal(20);

                output.length.should.equal(5);
            });
        });

        describe('complete', function () {
            it('should create suggestions for [09.03.2015 - 11.3]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '09.03.2015 - 11.3', 5);

                output.length.should.equal(5);

                output[0].secondDate.getDate().should.equal(11);
                output[0].secondDate.getMonth().should.equal(2);
            });
        });
    });

    describe('range day', function () {
        describe('incomplete', function () {
            it('should create backup suggetions for invalid first date for [1.9 2014 - 3]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '1.9 2014 - 3', 5);

                if (output[0].type === 'range') {
                    ((output[0].firstDate.getMonth() + 1) + '.' + output[0].firstDate.getFullYear()).should.not.equal('9.2014');
                }
            });

            it('should create suggetions for [1.12 2014 - 3]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '1.12 2014 - 3', 5);

                ((output[0].firstDate.getMonth() + 1) + '.' + output[0].firstDate.getFullYear()).should.equal('12.2014');
            });
        });

        describe('complete', function () {
            it('should create suggestion [21.10.2014 - 12]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '21.10.2014 - 12', 5);

                output.length.should.equal(5);
                output[0].firstDate.getFullYear().should.equal(2014);
                output[0].firstDate.getMonth().should.equal(9);
                output[0].firstDate.getDate().should.equal(21);
                output[1].secondDate.getDate().should.equal(12);
            });
        });
    });

    describe('single hours', function () {
        describe('complete', function () {
            it('should create suggestion and backup suggestions [1/10 2014 6t]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '1/10 2014 6t', 5);

                output.length.should.equal(5);
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

                output.length.should.equal(5);
                output[0].date.getFullYear().should.equal(2014);
                output[0].date.getMonth().should.equal(11);
                output[0].date.getDate().should.equal(31);
            });
        });

        describe('incomplete', function () {
            it('should create suggestion [03.11.1]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '03.11.1', 5);

                output.length.should.equal(5);
                output[0].date.getFullYear().should.equal(2014);
                output[0].date.getMonth().should.equal(10);
                output[0].date.getDate().should.equal(3);
            });

            it('should create many suggestions for long periods', function () {
                var output = pvdSuggest.createSuggestions(jan99_to_jan14, '01.10.2', 20);

                output.length.should.equal(20);
            });
        });
    });

    describe('single month', function () {
        describe('complete', function () {
            it('should create suggestion and backup suggestions [01.12]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '01.12', 5);

                output.length.should.equal(5);
                output[0].date.getFullYear().should.equal(2014);
                output[0].date.getMonth().should.equal(11);
                output[0].date.getDate().should.equal(1);
            });

            it('should create range suggestion that includes completed year-date [01.12]', function () {
                var output = pvdSuggest.createSuggestions(oct14_to_may15, '01.12', 5);

                output.length.should.equal(5);

                var foundHours = null;
                var foundRange = null;
                output.forEach(function (o) {
                    if (!foundHours && o.hours) foundHours = o;
                    if (!foundRange && o.type === 'range') foundRange = o;
                });

                foundHours.date.getFullYear().should.equal(2014);
                foundHours.date.getMonth().should.equal(11);
                foundHours.date.getDate().should.equal(1);

                foundRange.firstDate.getFullYear().should.equal(2014);
                foundRange.firstDate.getMonth().should.equal(11);
                foundRange.firstDate.getDate().should.equal(1);
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
