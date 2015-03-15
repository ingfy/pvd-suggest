/*
 * PrognosisVacationDateSuggestion
 * https://github.com/ingfy/pvd-suggest
 *
 * Copyright (c) 2015 Yngve Svalestuen
 * Licensed under the MIT license.
 */

'use strict';

var pvdParser = require('pvd-parser'),
    singleDay = require('../lib/strategies/single-day'),
    period = require('../lib/period');

var strategyFromType = (function () {
    var strategies = {
        'day': singleDay
    };

    return function (type) {
        return strategies[type];
    };
}());

module.exports = function() {
    var nov14toOct15 = period.from(2014, 10).to(2015, 9);

    console.log(nov14toOct15);

    var result = pvdParser.parse('01');

    var strategy = strategyFromType(result.dateType);

    var suggestions = strategy.suggest(period, result, 5);

    console.log('suggestions', suggestions);

    return 'awesome';
};
