'use strict';

var sep = '.',
    rangeSep = '-',
    decimalSep = '.';

function stringifyDate(date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(sep);
}

function stringifyHours(hours) {
    return ('' + hours).split('.').join(decimalSep);
}

function SingleDateSuggestion(date, hours) {
    this.date = date;
    this.hours = hours;

    this.type = 'single';
}

SingleDateSuggestion.prototype.toString = function () {
    var dateString = stringifyDate(this.date);

    if (this.hours) return [dateString, stringifyHours(this.hours)].join(' ');

    return dateString;
};

function RangeSuggestion(firstDate, secondDate) {
    this.firstDate = firstDate;
    this.secondDate = secondDate;

    this.type = 'range';
}

RangeSuggestion.prototype.toString = function () {
    return [stringifyDate(this.firstDate), rangeSep, stringifyDate(this.secondDate)].join('');
};

function Strategy(incomplete, complete) {
    this.incomplete = incomplete;
    this.complete = complete;
}

function datesAreEqual(a, b) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

module.exports = {
    SingleDate: SingleDateSuggestion,
    Range: RangeSuggestion,
    Strategy: Strategy,
    areEqual: function (a, b) {
        if (SingleDateSuggestion.prototype.isPrototypeOf(a)) {
            if (SingleDateSuggestion.prototype.isPrototypeOf(b)) {
                return datesAreEqual(a.date, b.date) && a.hours === b.hours;
            }
            return false;
        }
        if (RangeSuggestion.prototype.isPrototypeOf(b)) {
            return datesAreEqual(a.firstDate, b.firstDate) &&
                datesAreEqual(a.secondDate, b.secondDate);
        }
        return false;
    }
};
