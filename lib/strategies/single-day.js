'use strict';

/*
 * SingleDay strategy
 */

var suggestion = require('../../lib/suggestion'),
    util = require('../../lib/util'),
    Month = require('../../lib/period').Month;

function evenlySpreadOutMonthsGivenDay(day, period, num) {
    if (num < 1) return [];

    var monthOffsets = util.linspace(0, period.countMonths() - 1, num);
    var suggestions = [];

    for (var i = 0; i < monthOffsets.length; i++) {
        var date = util.createDateWithGuaranteedDay(
            period.start.year, period.start.nr + ~~monthOffsets[i], day
        );
        if (period.includes(Month.fromDate(date)))
            suggestions.push(new suggestion.SingleDate(date));
    }

    return suggestions;
}

function incomplete(period, result, maxNum) {
    return util.take([

    ], maxNum);
}

function complete(period, result, maxNum) {
    return evenlySpreadOutMonthsGivenDay(result.completePart.day, period, maxNum);
}

module.exports = new suggestion.Strategy(incomplete, complete);
