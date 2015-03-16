'use strict';

/* Period object
 * start: { year, nr }
 * end: { year, nr }
 */

var assert = require('assert');

function Month(year, nr) {
    this.year = year;
    this.nr = nr;
}

Month.prototype.getYear = function () { return this.year; };
Month.prototype.getMonth = function () { return this.nr; };

Month.fromDate = function (date) {
    return new Month(date.getFullYear(), date.getMonth());
};

Month.prototype.equals = function (other) {
    return this.year === other.year && this.nr === other.nr;
};

Month.prototype.isBefore = function (other) {
    return this.year < other.year ||
        this.year === other.year && this.nr < other.nr;
};

Month.prototype.isAfter = function (other) {
    return this.year > other.year ||
        this.year === other.year && this.nr > other.nr;
};


/* Period is an inclusive time period between two Months. */
function Period(start, end) {
    assert(Month.prototype.isPrototypeOf(end), 'end must be a period.Month');
    assert(Month.prototype.isPrototypeOf(end), 'start must be a period.Month');

    assert(end.equals(start) || end.isAfter(start), 'end cannot be before start');

    this.start = start;
    this.end = end;
}


Period.prototype.includes = function (month) {
    return (this.start.equals(month) || this.start.isBefore(month)) &&
            (this.end.equals(month) || this.end.isAfter(month));
};

Period.prototype.countMonths = function () {
    return (this.end.year - this.start.year) * 12 + (this.end.nr - this.start.nr + 1);
};

function Builder(start) {
    this.start = start;
}

Builder.prototype.to = function (end) {
    if (arguments.length === 2) {
        end = new Month(arguments[0], arguments[1]);
    }

    return new Period(this.start, end);
};

Period.from = function (start) {
    assert(Month.prototype.isPrototypeOf(start) || arguments.length === 2);

    if (arguments.length === 2) {
        start = new Month(arguments[0], arguments[1]);
    }

    return new Builder(start);
};

module.exports = {
    Month: Month,
    Period: Period
};
