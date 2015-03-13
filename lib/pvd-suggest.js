/*
 * PrognosisVacationDateSuggestion
 * https://github.com/ingfy/prognosisvacationdatesuggestion
 *
 * Copyright (c) 2015 Yngve Svalestuen
 * Licensed under the MIT license.
 */

'use strict';

var pvdParser = require('pvd-parser');

module.exports = function() {
    console.log(pvdParser.parse('01.09'));
    return 'awesome';
};
