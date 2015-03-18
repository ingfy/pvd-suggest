'use strict';

var util = require('../../lib/util'),
    suggestion = require('../../lib/suggestion'),
    period = require('../../lib/period'),
    config = require('../../lib/config'),
    Day = period.Day,
    Period = period.Period;

function createSingleDateInPeriod(period) {
    // Shortcut to picking the middle month and middle day
    var numMonths = period.countMonths();
    var firstDay = period.getFirstDay();
    var lastDay = period.getLastDay();
    var date = null;
    if (numMonths === 1) {
        date = util.linspaceElements(period.getDays(), 1)[0].toDate();
    } else {
        var firstMonth = firstDay.month;
        var month = firstMonth.next(~~(numMonths / 2));

        /* want to make evenly in the middle */
        var lowerDayCandidate = new Day(month.prev(), firstDay.getDay());
        if (lowerDayCandidate.isBefore(firstDay)) lowerDayCandidate = firstDay;

        var upperDayCandidate = new Day(month, lastDay.getDay());
        if (upperDayCandidate.isAfter(lastDay)) upperDayCandidate = lastDay;

        var daysInBounds = Period.from(lowerDayCandidate).to(upperDayCandidate).getDays();

        var day = util.linspaceElements(daysInBounds, 1)[0];

        date = day.isAfter(lastDay) ?
            lastDay.toDate() :
            date = util.tryCreateSpecificDate(day.getYear(), day.getMonth(), day.getDay());
    }

    return date ? new suggestion.SingleDate(date) : null;
}

function createEvenSingleDates(period, num) {
    if (num < 1) return [];
    if (num === 1) {
        var singleDate = createSingleDateInPeriod(period);
        return singleDate ? [singleDate] : [];
    }

    var out = [];

    var allDays = period.getDays();
    var days = util.linspaceElements(allDays, num);

    for (var i = 0; i < days.length; i++) {
        var date = util.tryCreateSpecificDate(days[i].getYear(), days[i].getMonth(), days[i].getDay());
        if (date) out.push(new suggestion.SingleDate(date));
    }

    return out;
}

function createEvenSingleDatesWithHours(period, num) {
    if (num < 1) return [];

    var singles = createEvenSingleDates(period, num);

    var hours = util.linspace(config.MIN_HOURS * 2, config.MAX_HOURS * 2, singles.length);

    var out = [];

    for (var i = 0; i < singles.length && i < hours.length; i++) {
        var suggestion = singles[i];
        suggestion.hours = hours[i] / 2;
        out.push(suggestion);
    }

    return out;
}

function createEvenRanges(period, num) {
    if (num < 1) return [];

    var rangeStartStart = period.getFirstDay();
    var rangeStartEnd = period.getLastDay().prev();

    if (!rangeStartStart.isBefore(rangeStartEnd)) return [];    // Cannot give ranges in empty period

    var rangeStartPeriod = Period.from(rangeStartStart).to(rangeStartEnd);
    var singles = createEvenSingleDates(rangeStartPeriod, num);

    var out = [];

    for (var i = 0; i < singles.length; i++) {
        var day = Day.fromDate(singles[i].date);
        var p = Period.from(day).to(period.end);
        var rangeEnd = createSingleDateInPeriod(p);
        if (rangeEnd) out.push(new suggestion.Range(singles[i].date, rangeEnd.date));
    }

    return out;
}

/* Creates "baseless" suggestions. 50% are standard dates,
 * floor(25%) are standard date with hours and ceiL(25%) are ranges.
 */
 module.exports = {
     suggest: function (period, num) {
         var numStandardSingle = Math.ceil(num * 0.5),
         numNonStandardSingle = util.halves(num - numStandardSingle),
         numHours = numNonStandardSingle.small;

         var stdSingle = createEvenSingleDates(period, numStandardSingle);
         var hours = createEvenSingleDatesWithHours(period, numHours);
         var ranges = createEvenRanges(period, (num - stdSingle.length - hours.length));

         var out = stdSingle.concat(hours).concat(ranges);
         return out;
     },

     randomSingleDates: createEvenSingleDates
 };
