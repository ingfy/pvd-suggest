'use strict';

/*
 * SingleHours strategy
 */

var suggestion = require('../../lib/suggestion'),
    util = require('../../lib/util'),
    Month = require('../../lib/period').Month,
    config = require('../../lib/config');


function makeHoursSuggestion(period, year, nr, day, hours) {
    var date = util.tryCreateSpecificDate(year, nr, day);
    var month = Month.fromDate(date);

    if (period.includes(month)) {
        return new suggestion.SingleDate(date, hours);
    }

    return null;
}

function incomplete(period, result, maxNum) {
    var hoursString = result.incompletePart.hoursString || '',
        hoursValue = ~~hoursString,
        candidateHours = [];

    if (hoursString.length === 0) {
        candidateHours = (function halfLinspace(num) {
            var out = util.linspace(1, config.MAX_HOURS * 2, num);
            for (var i = 0; i < out.length; i++) { out[i] = out[i] / 2; }
            return out;
        }(maxNum));
    }

    if (hoursString.length === 1) {
        candidateHours = [hoursValue, hoursValue + 0.5];
    }

    var dateData = result.completePart,
        out = [];

    for (var i = 0; i < candidateHours.length; i++) {
        var suggestion = makeHoursSuggestion(period, dateData.year, dateData.nr, dateData.day, candidateHours[i]);
        if (suggestion) out.push(suggestion);
    }

    return out;
}

function complete(period, result) {
    var data = result.completePart;

    var suggestion = makeHoursSuggestion(period, data.year, data.nr, data.day, data.hours);

    return suggestion ? [suggestion] : [];
}

module.exports = new suggestion.Strategy(incomplete, complete);
