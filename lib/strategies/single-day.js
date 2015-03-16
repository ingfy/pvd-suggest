'use strict';

/*
 * SingleDay strategy
 */

var suggestion = require('../../lib/suggestion'),
    util = require('../../lib/util'),
    Month = require('../../lib/period').Month,
    distributeCandidates = require('../../lib/strategies/distribute-candidates');

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

var autocompleteDays = (function () {
    var getDistribution = distributeCandidates({
        '': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        '0': [1, 2, 3, 4, 5, 6, 7, 8, 9],
        '1': [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        '2': [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        '3': [30, 31]
    });

    return function (dayPart, period, num) {
        var distribution = getDistribution(dayPart, num),
            out = [];

        for (var i = 0; i < distribution.values.length; i++) {
            var day = distribution.values[i];
            var numMonths = distribution.dist[day];

            var result = evenlySpreadOutMonthsGivenDay(~~day, period, numMonths);

            out = out.concat(result);
        }

        return out;
    };
}());

function incomplete(period, result, maxNum) {
    return autocompleteDays(result.incompletePart.dayString, period, maxNum);
}

function complete(period, result, maxNum) {
    return evenlySpreadOutMonthsGivenDay(result.completePart.day, period, maxNum);
}

module.exports = new suggestion.Strategy(incomplete, complete);
