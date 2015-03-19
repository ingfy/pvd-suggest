'use strict';

/*
 * SingleYear strategy
 */

var suggestion = require('../../lib/suggestion'),
    util = require('../../lib/util'),
    Day = require('../../lib/period').Day;

function autocompleteYear(day, nr, yearString, period, num) {
    var months = period.getMonthsWithNr(nr, day);

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

function createCompleteYear(period, year, nr, day) {
    var date = util.tryCreateSpecificDate(year, nr, day);
    var day = Day.fromDate(date);

    if (date && period.includes(day)) return new suggestion.SingleDate(date);

    return null;
}

function complete(period, result) {
    var dateData = result.completePart;
    var date = createCompleteYear(period, dateData.year, dateData.nr, dateData.day);
    return date ? [date] : [];
}

module.exports = new suggestion.Strategy(incomplete, complete);
