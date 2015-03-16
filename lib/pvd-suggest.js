/*
 * PrognosisVacationDateSuggestion
 * https://github.com/ingfy/pvd-suggest
 *
 * Copyright (c) 2015 Yngve Svalestuen
 * Licensed under the MIT license.
 */

'use strict';

var pvdParser = require('pvd-parser'),
    typeSuggestor = require('../lib/type-suggestor'),
    period = require('../lib/period');



module.exports = {
    Period: period.Period,
    Month: period.Month,
    createSuggestions: function(period, input, num) {
        var result = pvdParser.parse(input);

        var strategy = typeSuggestor(result);

        var suggestions = strategy(period, result.parseResult, num);

        return suggestions;
    }
};
