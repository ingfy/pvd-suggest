'use strict';

var assert = require('should');

var period = require('../lib/period'),
    Period = period.Period,
    Month = period.Month,
    Day = period.Day;

describe('period', function () {
    describe('Period', function () {
        describe('Period#getDays', function () {
            it('should find all days in period less than a month', function () {
                var output = Period.from(2010, 2, 10).to(2010, 2, 14).getDays();

                output.length.should.equal(5);
            });

            it('should find all days in period crossing month', function () {
                var output = Period.from(1999, 1, 27).to(1999, 2, 3).getDays();

                output.length.should.equal(5);
            });

            it('should count all days in long period', function () {
                var output = Period.from(2001, 0).to(2010, 11, 31).getDays();

                output.length.should.equal(3652);
            });
        });

        describe('Period#includes', function () {
            it('should work for Day in Month to Month period', function () {
                var p = Period.from(2010, 0).to(2011, 3),
                    before = new Day(2009, 11, 30),
                    after = new Day(2011, 4, 27),
                    middle = new Day(2010, 9, 14),
                    inFirst = new Day(2010, 0, 3),
                    inLast = new Day(2011, 3, 27);

                p.includes(before).should.equal(false);
                p.includes(after).should.equal(false);
                p.includes(middle).should.equal(true);
                p.includes(inFirst).should.equal(true);
                p.includes(inLast).should.equal(true);
            });

            it('should work for Day in Day to Month period', function () {
                var p = Period.from(2010, 0, 27).to(2011, 3),
                    before = new Day(2009, 0, 26),
                    after = new Day(2011, 4, 27),
                    middle = new Day(2010, 9, 14),
                    inFirst = new Day(2010, 0, 27),
                    inLast = new Day(2011, 3, 27);

                p.includes(before).should.equal(false, 'same month day before is not included');
                p.includes(after).should.equal(false);
                p.includes(middle).should.equal(true, 'middle (' + JSON.stringify(middle) + ') should be included');
                p.includes(inFirst).should.equal(true, 'first day of first month should be included');
                p.includes(inLast).should.equal(true, 'day in period\'s last month is included');
            });
        });

        it('should correctly calculate Period#includes', function () {
            var p = Period.from(new Month(2009, 7)).to(new Month(2009, 10)),
                before = new Month(2009, 6),
                atStart = new Month(2009, 7),
                atEnd = new Month(2009, 10),
                after = new Month(2009, 11),
                prevYear = new Month(2008, 8),
                nextYear = new Month(2010, 8);

            p.includes(before).should.equal(false);
            p.includes(atStart).should.equal(true);
            p.includes(atEnd).should.equal(true);
            p.includes(after).should.equal(false);
            p.includes(nextYear).should.equal(false);
            p.includes(prevYear).should.equal(false);
        });

        describe('Period#getMonthsWithNr', function () {
            it('should find for several years', function () {
                var period = Period.from(2011, 3).to(2020, 8);

                var months = period.getMonthsWithNr(4);

                months.length.should.equal(10);
            });

            it('should find for period shorter than a year', function () {
                var period = Period.from(2015, 3).to(2015, 7);

                var months = period.getMonthsWithNr(7);

                months.length.should.equal(1);
            });

            it('should find none when no nr matches', function () {
                var period = Period.from(1999, 3).to(1999, 11);

                var months = period.getMonthsWithNr(0);

                months.length.should.equal(0);
            });

            it('should find none when no nr matches', function () {
                var period = Period.from(2015, 2).to(2015, 3);

                var months = period.getMonthsWithNr(1, 1);

                months.length.should.equal(0);
            });
        });

        describe('Period#countYears', function () {
            it('should correctly count same year', function () {
                var p = Period.from(2015, 0).to(2015, 2);

                p.countYears().should.equal(1);
            });
        });

        describe('Period#countMonths should correctly count', function () {
            it('months within same year', function () {
                var p = Period.from(2015, 0).to(2015, 3);

                p.countMonths().should.equal(4);
            });

            it('months in different years with less than a year apart', function () {
                var p1 = Period.from(2014, 10).to(2015, 3);

                p1.countMonths().should.equal(6);

                var p2 = Period.from(2014, 11).to(2015, 0);

                p2.countMonths().should.equal(2);
            });

            it('months in different years with more than a year apart', function () {
                var p = Period.from(2014, 6).to(2015, 6);

                p.countMonths().should.equal(13);
            });
        });
    });

    describe('Month', function () {
        describe('Month#prev', function () {
            it('should correctly find prev within year', function () {
                var input = new Month(2014, 3);
                var output = input.prev();

                output.year.should.equal(2014);
                output.nr.should.equal(2);
            });

            it('should correctly find prev in year change', function () {
                var input = new Month(2014, 0);
                var output = input.prev();

                output.year.should.equal(2013);
                output.nr.should.equal(11);
            });
        });

        describe('Month#next', function () {
            it('should correctly find next within year', function () {
                var input = new Month(2014, 3);
                var output = input.next();

                output.year.should.equal(2014);
                output.nr.should.equal(4);
            });

            it('should correctly find next in year change', function () {
                var input = new Month(2011, 11);
                var output = input.next();

                output.year.should.equal(2012);
                output.nr.should.equal(0);
            });

            it('should correctly find next 6 within year', function () {
                var input = new Month(2010, 3);
                var output = input.next(6);

                output.year.should.equal(2010);
                output.nr.should.equal(9);
            });

            it('should correctly find next 6 in year change', function () {
                var input = new Month(2010, 10);
                var output = input.next(6);

                output.year.should.equal(2011);
                output.nr.should.equal(4);
            });
        });

        it('should correctly create a month with Month.fromDate', function () {
            var d = new Date('February 1, 2015');
            var m = Month.fromDate(d);

            m.year.should.equal(2015);
            m.nr.should.equal(1);
        });

        it('should correctly calculate Month#isBefore', function () {
            var m1 = new Month(2011, 0);
            var m2 = new Month(2011, 1);
            var m3 = new Month(2011, 0);

            m1.isBefore(m2).should.equal(true);
            m2.isBefore(m1).should.equal(false);
            m1.isBefore(m3).should.equal(false);
        });

        it('should correctly calculate Month#isAfter', function () {
            var m1 = new Month(1999, 10),
                m2 = new Month(2013, 7),
                m3 = new Month(1999, 10);

            m1.isAfter(m2).should.equal(false);
            m2.isAfter(m1).should.equal(true);
            m1.isAfter(m3).should.equal(false);
        });

        it('should correctly calculate Month#equals', function () {
            var m1 = new Month(2000, 0),
                m2 = new Month(1999, 11),
                m3 = new Month(2000, 0);

            m1.equals(m2).should.equal(false);
            m1.equals(m3).should.equal(true);
        });
    });
});
