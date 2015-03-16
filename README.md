# pvd-suggest: PrognosisVacationDateSuggestion
[![NPM version][npm-image]][npm-url]

The best module ever.


## InstallS

```bash
$ npm install --save ingfy/pvd-suggest
```


## Usage

```javascript
var pvdSuggest = require('../');

var period = pvdSuggest.Period.from(2014, 9).to(2015, 4);  // October 14 to May 15
var input = '01';
var num = 5;
console.log(pvdSuggest.createSuggestions(period, input, num)); // [01.10.2014, ...]

```

## API

_(Coming soon)_


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).


## License

Copyright (c) 2015 Yngve Svalestuen. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/pvd-suggest
[npm-image]: https://badge.fury.io/js/pvd-suggest.svg
