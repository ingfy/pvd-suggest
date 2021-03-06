'use strict';

var suggestion = require('../lib/suggestion'),
    singleDay = require('../lib/strategies/single-day'),
    singleMonth = require('../lib/strategies/single-month'),
    singleYear = require('../lib/strategies/single-year'),
    singleHours = require('../lib/strategies/single-hours'),
    range = require('../lib/strategies/range-strategy'),
    defaultSuggestions = require('../lib/strategies/default-strategy').suggest,
    util = require('../lib/util');


function getSuggestedYears(suggestions, period) {
    var out = [];

    for (var i = 0; i < suggestions.length; i++) {
        out[i] = suggestions[i].date.getFullYear();
    }

    return out;
}

function addExtensions(suggestions, period, result, num) {
    var years = getSuggestedYears(suggestions);

    if (years.length > 0) {
        var remain = util.halves(num - suggestions.length);

        result.completePart.year = years[0];

        suggestions = suggestions.concat(singleHours.incomplete(period, result, remain.small));
        suggestions = suggestions.concat(range('defaultSuggestion', false, period, result, remain.big));
    }

    return suggestions;
}

function suggestByType(period, result, num) {
    if (!result || result.dateType === 'day' && !result.parseResult.complete && result.parseResult.incompletePart.dayString === '')
        return [];  // Only show default suggestions

    if (result.dateType === 'day' && !result.parseResult.complete)
        return singleDay.incomplete(period, result.parseResult, num);

    if ((result.dateType === 'day' && result.parseResult.complete) || (result.dateType === 'month' && !result.parseResult.complete && result.parseResult.incompletePart.monthString === ''))
        return singleDay.complete(period, result.parseResult, num);

    if (result.dateType === 'month' && !result.parseResult.complete && result.parseResult.incompletePart.monthString !== '')
        return singleMonth.incomplete(period, result.parseResult, num);

    if ((result.dateType === 'month' && result.parseResult.complete) || (result.dateType === 'year' && !result.parseResult.complete && result.parseResult.incompletePart.yearString === ''))
        return addExtensions(singleMonth.complete(period, result.parseResult, num), period, result.parseResult, num);

    if (result.dateType === 'year' && !result.parseResult.complete && result.parseResult.incompletePart.yearString !== '')
        return addExtensions(singleYear.incomplete(period, result.parseResult, num), period, result.parseResult, num);

    if (result.dateType === 'year' && result.parseResult.complete)
        return addExtensions(singleYear.complete(period, result.parseResult, num), period, result.parseResult, num);

    if (result.dateType === 'hours' && result.parseResult.complete)
        return singleHours.complete(period, result.parseResult, num);

    if (result.dateType === 'hours' && !result.parseResult.complete)
        return singleHours.incomplete(period, result.parseResult, num);

    if (result.dateType === 'rangeDay' && !result.parseResult.complete && result.parseResult.secondResult.incompletePart.dayString === '')
        return range('defaultSuggestion', false, period, result.parseResult, num);

    if (result.dateType === 'rangeDay')
        return range('day', result.parseResult.complete, period, result.parseResult, num);

    if (result.dateType === 'rangeMonth' && !result.parseResult.complete && result.parseResult.secondResult.incompletePart.monthString === '')
        return range('day', true, period, result.parseResult, num);

    if (result.dateType === 'rangeMonth')
        return range('month', result.parseResult.complete, period, result.parseResult, num);

    if (result.dateType === 'rangeYear' && !result.parseResult.complete && result.parseResult.secondResult.incompletePart.yearString === '')
        return range('month', true, period, result.parseResult, num);

    if (result.dateType === 'rangeYear')
        return range('year', result.parseResult.complete, period, result.parseResult, num);

    throw Error('Your type is not supported!');
}

function removeDuplicates(suggestions) {
    var out = [];

    for (var i = 0; i < suggestions.length; i++) {
        var match = false;
        for (var j = 0; j < out.length; j++) {
            if (suggestion.areEqual(suggestions[i], out[j])) {
                match = true;
                break;
            }
        }
        if (!match) out.push(suggestions[i]);
    }

    return out;
}

function addDefaultSuggestions(period, typeSuggestions, num) {
    var remaining = num - typeSuggestions.length;

    var defaults = defaultSuggestions(period, remaining);
    var all = typeSuggestions.concat(defaults);

    return util.take(removeDuplicates(all), num);
}

module.exports = function (period, result, num) {
    return addDefaultSuggestions(period, suggestByType(period, result, num), num);
};
