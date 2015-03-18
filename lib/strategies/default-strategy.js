'use strict';

var util = require('../../lib/util'),
    suggestion = require('../../lib/suggestion'),
    period = require('../../lib/period'),
    config = require('../../lib/config'),
    Month = period.Month,
    Day = period.Day,
    Period = period.Period;

function createEvenRandomSingleDates(period, num) {
    if (num < 1) return [];

    var out = [];

    var months = util.linspace(0, period.countMonths() - 1, num),
        firstMonth = new Month(period.start.getYear(), period.start.getMonth());

    for (var i = 0; i < months.length; i++) {
        var month = firstMonth.next(months[i]);
        var date = null;
        while (!date) {
            date = util.tryCreateSpecificDate(month.year, month.nr, 1 + ~~(Math.random() * 30));
        }
        out.push(new suggestion.SingleDate(date));
    }

    return out;
}

function createEvenRandomSingleDatesWithHours(period, num) {
    if (num < 1) return [];

    var singles = createEvenRandomSingleDates(period, num);

    var hours = util.linspace(0, config.MAX_HOURS * 2, singles.length);

    for (var i = 0; i < singles.length; i++) {
        singles[i].hours = hours[i] / 2;
    }

    return singles;
}

function createEvenRandomRanges(period, num) {
    if (num < 1) return [];

    var singles = createEvenRandomSingleDates(period, num);

    var out = [];

    for (var i = 0; i < singles.length; i++) {
        var day = Day.fromDate(singles[i].date);
        if (day.isBefore(period.getLastDay())) {
            var p = Period.from(day).to(period.end);
            var secondSingle = createEvenRandomSingleDates(p, 1);
            out.push(new suggestion.Range(singles[i].date, secondSingle[0].date));
        }
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
         numHours = numNonStandardSingle.small,
         numRanges = numNonStandardSingle.big;

         var stdSingle = createEvenRandomSingleDates(period, numStandardSingle);
         var hours = createEvenRandomSingleDatesWithHours(period, numHours);
         var ranges = createEvenRandomRanges(period, numRanges);

         return stdSingle.concat(hours).concat(ranges);
     },

     randomSingleDates: createEvenRandomSingleDates
 };
