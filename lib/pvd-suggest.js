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

module.exports = {
    Period: period.Period,
    Month: period.Month,
    createSuggestions: function(period, input, num) {
        var result = pvdParser.parse(input);

        var strategy = strategyFromType(result.dateType);

        var suggestions = strategy.suggest(period, result, num);

        return suggestions;
    }
};
