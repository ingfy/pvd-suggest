'use strict';

var assert = require('should');

describe('example/simple', function () {
    it('should not throw', function () {
        assert.doesNotThrow(function () { require('../example/simple.js'); });
    });
});
