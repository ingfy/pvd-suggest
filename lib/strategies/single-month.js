'use strict';

/*
 * SingleMonth strategy
 */

var suggestion = require('../../lib/suggestion'),
    util = require('../../lib/util'),
    distributeCandidates = require('../../lib/strategies/distribute-candidates');

function evenlySpreadOutYearsGivenDayAndMonth(day, nr, period, num) {
    if (num < 1) return [];

    var suggestions = [],
        months = period.getMonthsWithNr(nr);

    for (var i = 0; i < months.length; i++) {
        var date = util.tryCreateSpecificDate(months[i].year, months[i].nr, day);

        if (date) suggestions.push(new suggestion.SingleDate(date));
    }

    return suggestions;
}

var autocompleteMonths = (function () {
    var getDistribution = distributeCandidates({
        '0': [1, 2, 3, 4, 5, 6, 7, 8, 9],
        '1': [1, 10, 11, 12]
    });

    return function (day, monthPart, period, num) {
        var distribution = getDistribution(monthPart, num, period.start.nr + 1),
            out = [];

        for (var i = 0; i < distribution.values.length; i++) {
            var monthString = distribution.values[i],
                numMonths = distribution.dist[monthString],
                nr = ~~monthString - 1;

            out = out.concat(evenlySpreadOutYearsGivenDayAndMonth(day, nr, period, numMonths));
        }

        return out;
    };
}());

function incomplete(period, result, maxNum) {
    return autocompleteMonths(result.completePart.day, result.incompletePart.monthString, period, maxNum);
}

function complete(period, result, maxNum) {
    return evenlySpreadOutYearsGivenDayAndMonth(result.completePart.day, result.completePart.nr, period, maxNum);
}

module.exports = new suggestion.Strategy(incomplete, complete);
