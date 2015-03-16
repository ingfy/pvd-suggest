var util = require('../../lib/util');

module.exports = function (candidates) {
    function getCandidates(str, startAt) {
        var values = candidates[str];

        if (startAt) {  // rotate to start at given value
            var index = values.indexOf(startAt);
            if (index > -1) {
                values = values.slice(index).concat(values.slice(0, index));
            }
        }

        return values;
    }

    return function (value, num, startAt) {
        var possibilities = getCandidates(value, startAt);

        var monthsPerDay = ~~(num / possibilities.length),
            remain = num % possibilities.length,
            out = {};

        for (var i = 0; i < possibilities.length; i++) {
            var candidate = possibilities[i];

            out[candidate] = monthsPerDay;

            if (remain-- > 0) out[candidate] += 1;
        }

        return {
            values: possibilities,
            dist: out
        };
    };
};
