'use strict';

var assert = require('should');

var period = require('../lib/period'),
    Period = period.Period,
    Month = period.Month;

describe('period', function () {
    describe('Period', function () {
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
