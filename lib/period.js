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

function Day(month, day) {
    if (arguments.length === 3) {
        day = arguments[2];
        month = new Month(arguments[0], arguments[1]);
    }

    this.month = month;
    this.day = day;
}

Month.prototype.getYear = function () { return this.year; };
Month.prototype.getMonth = function () { return this.nr; };
Day.prototype.getYear = function () { return this.month.getYear(); };
Day.prototype.getMonth = function () { return this.month.getMonth(); };
Day.prototype.getDay = function () { return this.day; };

Month.fromDate = function (date) {
    return new Month(date.getFullYear(), date.getMonth());
};

Month.prototype.equals = function (other) {
    if (Day.prototype.isPrototypeOf(other)) return false;

    return this.year === other.year && this.nr === other.nr;
};

Month.prototype.isBefore = function (other) {
    if (Day.prototype.isPrototypeOf(other)) return this.isBefore(other.month);

    return this.year < other.year ||
        this.year === other.year && this.nr < other.nr;
};

Month.prototype.isAfter = function (other) {
    if (Day.prototype.isPrototypeOf(other)) return this.isAfter(other.month);

    return this.year > other.year ||
        this.year === other.year && this.nr > other.nr;
};

Month.prototype.next = function (num) {
    num = num || 1;
    return new Month(this.year + ~~((this.nr + num) / 12), (this.nr + num) % 12);
};

Month.prototype.prev = function () {
    if (this.nr <= 0) return new Month(this.year - 1, 11);
    return new Month(this.year, this.nr - 1);
};

Day.fromDate = function (date) {
    return new Day(Month.fromDate(date), date.getDate());
};

Day.prototype.toDate = function () {
    return new Date(this.getYear(), this.getMonth(), this.getDay());
};

Day.prototype.equals = function (other) {
    if (Month.prototype.isPrototypeOf(other)) return false;

    return this.month.equals(other.month) && this.day === other.day;
};

Day.prototype.isAfter = function (other) {
    if (Month.prototype.isPrototypeOf(other)) return this.month.isAfter(other);

    return this.month.isAfter(other.month) ||
        this.month.equals(other.month) && this.day > other.day;
};

Day.prototype.isBefore = function (other) {
    if (Month.prototype.isPrototypeOf(other)) return this.month.isBefore(other);

    return this.month.isBefore(other.month) ||
        this.month.equals(other.month) && this.day < other.day;
};

Day.prototype.next = function (num) {
    num = num || 1;

    var d = new Date(this.month.year, this.month.nr, this.day + num);

    return Day.fromDate(d);
};

Day.prototype.prev = function () {
    var d = new Date(this.month.year, this.month.nr, this.day - 1);

    return Day.fromDate(d);
};

/* Period is an inclusive time period between two Months. */
function Period(start, end) {
    assert(Month.prototype.isPrototypeOf(end) || Day.prototype.isPrototypeOf(end), 'end must be a period.Month or period.Day');
    assert(Month.prototype.isPrototypeOf(start) || Day.prototype.isPrototypeOf(start), 'start must be a period.Month or period.Day');

    this.start = start;
    this.end = end;

    assert(!this.getLastDay().isBefore(this.getFirstDay()), 'end cannot be before start');
}

Period.prototype.getDays = function () {
    var out = [];

    var current = this.getFirstDay();
    var stop = this.getLastDay();

    if (current.equals(stop)) return [current];

    while (current.isBefore(stop)) {
        out.push(current);
        current = current.next();
    }
    out.push(stop);

    return out;
};

Period.prototype.includes = function (time) {
    if (Day.prototype.isPrototypeOf(time) && Month.prototype.isPrototypeOf(this.start) && Month.prototype.isPrototypeOf(this.end)) {
        return this.includes(time.month);
    }

    if (Day.prototype.isPrototypeOf(time) && Day.prototype.isPrototypeOf(this.start) && Month.prototype.isPrototypeOf(this.end)) {
        return new Period(this.start.month, this.end).includes(time.month) && (time.equals(this.start) || time.isAfter(this.start));
    }

    if (Day.prototype.isPrototypeOf(time) && Day.prototype.isPrototypeOf(this.start) && Day.prototype.isPrototypeOf(this.end)) {
        return new Period(this.start, this.end.month).includes(time) && (time.equals(this.end) || time.isBefore(this.end));
    }

    if (Month.prototype.isPrototypeOf(time) && Day.prototype.isPrototypeOf(this.start) && Month.prototype.isPrototypeOf(this.end)) {
        return this.countMonths() < 2 ? false : new Period(this.start.month.next(), this.end).includes(time);    // Can only guarantee from next month
    }

    if (Month.prototype.isPrototypeOf(time) && Month.prototype.isPrototypeOf(this.start) && Month.prototype.isPrototypeOf(this.end)) {
        return (this.start.equals(time) || this.start.isBefore(time)) &&
                (this.end.equals(time) || this.end.isAfter(time));
    }

    throw Error('Cannot compare period representation with time. Undefined relation. Contact library author. [time: ' + Object.getPrototypeOf(time).constructor.name + ', start: ' + Object.getPrototypeOf(this.start).constructor.name + ', end: ' + Object.getPrototypeOf(this.end).constructor.name + ']');
};

Period.prototype.countMonths = function () {
    return (this.end.getYear() - this.start.getYear()) * 12 + (this.end.getMonth() - this.start.getMonth() + 1);
};

Period.prototype.countYears = function () {
    return this.end.getYear() - this.start.getYear() + 1;
};

Period.prototype.getLastDay = function () {
    if (Month.prototype.isPrototypeOf(this.end)) return new Day(this.end.next(), 1).prev();
    return this.end;
};

Period.prototype.getFirstDay = function () {
    if (Month.prototype.isPrototypeOf(this.start)) return new Day(this.start, 1);
    return this.start;
};

Period.prototype.getMonthsWithNr = function (nr, day) {
    var out = [];

    var month = new Month(this.start.getYear(), this.start.getMonth());

    if (day !== undefined && Day.prototype.isPrototypeOf(this.start) && day < this.start.day) {
        month = month.next();
    }

    while (this.includes(new Day(month, day))) {
        if (month.nr === nr) {
            out.push(month);
            month = month.next(12);
        } else {
            month = month.next();
        }
    }

    return out;
};

function Builder(start) {
    this.start = start;
}

function timeFromArgs() {
    var time = arguments[0];

    assert(
        Month.prototype.isPrototypeOf(time) ||
        Day.prototype.isPrototypeOf(time) ||
        arguments.length === 2 ||
        arguments.length === 3
    );

    if (arguments.length === 2 || arguments.length === 3) {
        time = new Month(arguments[0], arguments[1]);
    }

    if (arguments.length === 3) {
        time = new Day(time, arguments[2]);
    }

    return time;
}

Builder.prototype.to = function () {
    return new Period(this.start, timeFromArgs.apply(this, arguments));
};

Period.from = function () {
    return new Builder(timeFromArgs.apply(this, arguments));
};

module.exports = {
    Month: Month,
    Day: Day,
    Period: Period
};
