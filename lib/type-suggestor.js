'use strict';

var singleDay = require('../lib/strategies/single-day'),
    singleMonth = require('../lib/strategies/single-month');

var strategyFromType = (function () {
    var strategies = {
        'day': singleDay,
        'month': singleMonth
    };

    return function (type) {
        return strategies[type];
    };
}());

module.exports = function (result) {
    if (result.dateType === 'day' && !result.parseResult.complete)
        return singleDay.incomplete;

    if ((result.dateType === 'day' && result.parseResult.complete) || (result.dateType === 'month' && !result.parseResult.complete && result.parseResult.incompletePart.monthString === ''))
        return singleDay.complete;

    if (result.dateType === 'month' && !result.parseResult.complete)
        return singleMonth.incomplete;

    if ((result.dateType === 'month' && result.parseResult.complete) || (result.dateType === 'year' && !result.parseResult.complete && result.parseResult.incompletePart.yearString === ''))
        return singleMonth.complete;    

    return strategyFromType(result.dateType);
};
