'use strict';

var assert = require('assert');

module.exports = {
    take: function take(array, num) {
        if (num <= 0 || array.length === 0) return [];

        return [array[0]].concat(take(array.slice(1), num - 1));
    },

    tryCreateSpecificDate: function (year, nr, day) {
        var d = new Date(year, nr, day);

        if (d.getFullYear() === year &&
            d.getMonth() === nr &&
            d.getDate() === day) return d;

        return null;
    },

    createDateWithGuaranteedDay: function (year, nr, day) {
        assert(1 <= day && day <= 31, 'day must be in [1, 31]');

        if (day <= 28) return new Date(year, nr, day); // no problem, guaranteed to have 28 days in a month
        var test = new Date(year, nr, day),
            acc = 0;

        while (test.getDate() !== ~~day) {
            test = new Date(year, nr + (++acc), day);
        }

        return test;
    },

    /* Returns evenly spaced integers */
    linspace: function linspace(start, end, num) {
        if (num < 1) return [];
        if (num === 1) return [start + (end - start) / 2];

        var first = start + 0,
            last = end + 0;

        var space = (end - start) / (num - 1);

        var between = [];

        for (var it = start + space; it < end; it += space) {
            between.push(it);
        }

        var numbers = [first].concat(between).concat([last]);

        var out = [~~numbers[0]];

        for (var i = 1, prev = out[0]; i < numbers.length; i++) {
            var number = ~~numbers[i];
            if (prev !== number) {
                out.push(number);
                prev = number;
            }
        }

        return out;
    }
};
