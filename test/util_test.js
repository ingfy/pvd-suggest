'use strict';

var util = require('../lib/util');
var assert = require('should');

describe('util', function () {
    describe('take', function () {
        it('should truncate long arrays', function () {
            var input = [1, 2, 3, 4, 5],
                num = 3;

            var out = util.take(input, num);

            out.length.should.equal(3);
            out[0].should.equal(1);
            out[1].should.equal(2);
            out[2].should.equal(3);
        });

        it('should return list if too small', function () {
            var input = [1, 2],
                num = 3;

            var out = util.take(input, num);

            out.length.should.equal(input.length);
            out[0].should.equal(1);
            out[1].should.equal(2);
        });
    });

    describe('linspace', function () {
        it('should return empty when asked for 0', function () {
            var result = util.linspace(1, 10, 0);

            result.length.should.equal(0);
        });

        it('should return middle when asked for one value', function () {
            var result = util.linspace(0, 10, 1);

            result.length.should.equal(1);
            result[0].should.equal(5);
        });

        it('should return end points when asked for 2', function () {
            var result = util.linspace(3, 7, 2);

            result.length.should.equal(2);
            result[0].should.equal(3);
            result[1].should.equal(7);
        });

        it('should return end points and middle when asked for 3', function () {
            var result = util.linspace(0, 10, 3);

            result.length.should.equal(3);
            result[0].should.equal(0);
            result[1].should.equal(5);
            result[2].should.equal(10);
        });

        it('should handle negative start value', function () {
            var result = util.linspace(-10, 10, 5);

            result.length.should.equal(5);
            result[0].should.equal(-10);
            result[2].should.equal(0);
            result[4].should.equal(10);
        });
    })
});
