'use strict';

var singleDay = require('../lib/strategies/single-day'),
    singleMonth = require('../lib/strategies/single-month'),
    singleYear = require('../lib/strategies/single-year'),
    singleHours = require('../lib/strategies/single-hours');

module.exports = function (period, result, num) {
    var out = [];

    if (result.dateType === 'day' && !result.parseResult.complete)
        out = out.concat(singleDay.incomplete(period, result.parseResult, num));

    if ((result.dateType === 'day' && result.parseResult.complete) || (result.dateType === 'month' && !result.parseResult.complete && result.parseResult.incompletePart.monthString === ''))
        out = out.concat(singleDay.complete(period, result.parseResult, num));

    if (result.dateType === 'month' && !result.parseResult.complete && result.parseResult.incompletePart.monthString !== '')
        out = out.concat(singleMonth.incomplete(period, result.parseResult, num));

    if ((result.dateType === 'month' && result.parseResult.complete) || (result.dateType === 'year' && !result.parseResult.complete && result.parseResult.incompletePart.yearString === ''))
        out = out.concat(singleMonth.complete(period, result.parseResult, num));

    if (result.dateType === 'year') {
        if(!result.parseResult.complete && result.parseResult.incompletePart.yearString !== '')
            out = out.concat(singleYear.incomplete(period, result.parseResult, num));

        if (result.parseResult.complete)
            out = out.concat(singleYear.complete(period, result.parseResult, num));

        var leftover = out.length / 2,
            bigHalf = Math.ceil(leftover / 2),
            smallHalf = Math.floor(leftover / 2);

        out = out.concat(singleHours.incomplete(period, result.parseResult, smallHalf));
        //out = out.concat(singleYear.complete(period, result.parseResult, bigHalf));
    }

    if (result.dateType === 'hours' && result.parseResult.complete)
        out = out.concat(singleHours.complete(period, result.parseResult, num));

    return out;
};
