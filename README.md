# Ethiopic-Calendar [![Build Status](https://travis-ci.org/moe-szyslak/Ethiopic-Calendar.svg?branch=master)](https://travis-ci.org/moe-szyslak/Ethiopic-Calendar)

JavaScript implementation of [Beyene-Kudlek](http://geez.org/Calendars/) algorithm.

### Installation
`npm install ethiopic-calendar --save`

### Usage
```javascript
const { ethiopicToGregorian, gregorianToEthiopic } = require('ethiopic-calendar');

// parameters expects year, month, day, [era]
ethiopicToGregorian(1983, 13, 3); // { year: 1991, month: 9, day: 8 }
gregorianToEthiopic(1991, 9, 8); // { year: 1983, month: 13, day: 3 }
```

To pass an era for `ethiopicToGregorian` import `AM` for ዓ/ም or `AA` for ዓ/ዓ

```javascript
const { ethiopicToGregorian, gregorianToEthiopic, AA, AM } = require('ethiopic-calendar');
ethiopicToGregorian(550, 13, 5, AA); // { year: 7, month: 8, day: 28 }
```

### TODO
- [X] Pass ESLint rules
- [X] Tests
- [ ] Make functions pure
