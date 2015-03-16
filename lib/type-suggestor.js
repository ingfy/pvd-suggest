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
    return strategyFromType(result.dateType);
};
