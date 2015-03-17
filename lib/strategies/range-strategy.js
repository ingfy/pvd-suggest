'use strict';

var util = require('../../lib/util'),
    suggestion = require('../../lib/suggestion'),
    period = require('../../lib/period'),
    defaultStrategy = require('../../lib/strategies/default-strategy'),
    Day = period.Day,
    Period = period.Period;


function dateFromCompletePart(data) {
    return util.tryCreateSpecificDate(data.year, data.nr, data.day);
}

function firstDateFromResult(result) {
    return result.firstDate || dateFromCompletePart(result.completePart);
}

var singleSuggestors = {
    defaultSuggestion: { incomplete: function (period, parseResult, num) { return defaultStrategy.randomSingleDates(period, num); } },
    day: require('../../lib/strategies/single-day'),
    month: require('../../lib/strategies/single-month'),
    year: require('../../lib/strategies/single-year')
};

function suggestRanges(type, complete, period, result, num) {
    var firstDate = firstDateFromResult(result);
    if (!firstDate || !period.includes(Day.fromDate(firstDate))) return [];

    var suggestor = singleSuggestors[type][result.firstDate && complete ? 'complete' : 'incomplete'];

    if (!suggestor) return [];

    var secondPartPeriod = new Period(Day.fromDate(firstDate).next(), period.end);
    var singles = suggestor(secondPartPeriod, result.secondResult || {completePart: {}, incompletePart: {}}, num);

    var out = [];

    for (var i = 0; i < singles.length; i++) {
        out.push(new suggestion.Range(firstDate, singles[i].date));
    }

    return out;
}

module.exports = suggestRanges;
