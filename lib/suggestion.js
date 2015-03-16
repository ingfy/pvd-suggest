'use strict';

var sep = '.',
    rangeSep = '-',
    decimalSep = '.';

function stringifyDate(date) {
    return [date.Date(), date.getMonth() + 1, date.getFullYear()].join(sep);
}

function stringifyHours(hours) {
    return ('' + hours).split('.').join(decimalSep);
}

function SingleDateSuggestion(date, hours) {
    this.date = date;
    this.hours = hours;
}

SingleDateSuggestion.prototype.toString = function () {
    var dateString = stringifyDate(this.date);

    if (this.hours) return [dateString, stringifyHours(this.hours)].join(' ');

    return dateString;
};

function RangeSuggestion(firstDate, secondDate) {
    this.firstDate = firstDate;
    this.secondDate = secondDate;
}

RangeSuggestion.prototype.toString = function () {
    return [stringifyDate(this.firstDate), rangeSep, stringifyDate(this.secondDate)].join('');
};

function Strategy(incomplete, complete) {
    this.incomplete = incomplete;
    this.complete = complete;
}

module.exports = {
    SingleDate: SingleDateSuggestion,
    Range: RangeSuggestion,
    Strategy: Strategy
};
