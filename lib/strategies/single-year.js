'use strict';

/*
 * SingleYear strategy
 */

var suggestion = require('../../lib/suggestion'),
    util = require('../../lib/util'),
    Month = require('../../lib/period').Month;

function autocompleteYear(day, nr, yearString, period, num) {
    var months = period.getMonthsWithNr(nr);

    var filteredMonths = [];

    for (var i = 0; i < months.length; i++) {
        var monthYearString = ('' + months[i].year);

        if (yearString.length < 2 && monthYearString.slice(2).indexOf(yearString) === 0) {
            filteredMonths.push(months[i]);
        } else if (monthYearString.indexOf(yearString) === 0) {
            filteredMonths.push(months[i]);
        }
    }

    var out = [];

    for (var j = 0; j < filteredMonths.length; j++) {
        var date = util.tryCreateSpecificDate(filteredMonths[j].year, nr, day);

        if (date) out.push(new suggestion.SingleDate(date));
    }

    if (out.length > num) {
        return util.linspaceElements(out);
    }

    return out;
}

function incomplete(period, result, maxNum) {
    return autocompleteYear(result.completePart.day, result.completePart.nr, result.incompletePart.yearString, period, maxNum);
}

function complete(period, result) {
    var dateData = result.completePart;
    var month = new Month(dateData.year, dateData.nr);
    var date = util.tryCreateSpecificDate(dateData.year, dateData.nr, dateData.day);

    if (date && period.includes(month)) return [new suggestion.SingleDate(date)];

    return [];
}

module.exports = new suggestion.Strategy(incomplete, complete);
