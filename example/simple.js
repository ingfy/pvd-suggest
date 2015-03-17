/*
 * PrognosisVacationDateSuggestion
 * https://github.com/ingfy/pvd-suggest
 *
 * Copyright (c) 2015 Yngve Svalestuen
 * Licensed under the MIT license.
 */

'use strict';

var pvdSuggest = require('../');

var period = pvdSuggest.Period.from(2014, 9).to(2015, 4);  // October 14 to May 15

var input = '01';

var num = 10;

pvdSuggest.createSuggestions(period, input, num); // [01.10.2014, ...]
