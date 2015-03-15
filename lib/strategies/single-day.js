'use strict';

/*
 * SingleDay strategy
 */

var suggestion = require('../../lib/suggestion');

function take(array, num) {
    if (num <= 0 || array.length === 0) return [];

    return [array[0]].concat(take(array.slice(1), num - 1));
}

function incomplete(period, result, maxNum) {
    return take([

    ], maxNum);
}

function complete(period, result, maxNum) {
    return take([

    ], maxNum);
}

module.exports = new suggestion.Strategy(incomplete, complete);
