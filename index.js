/**
 * This is JavaScript implementation of Beyene-Kudlek algorithm.
 *
 * For more info have a look at: http://www.geez.org/Calendars/
 *
 * TODO:
 * - pass ESLint rules
 * - tests
 * - make functions pure
 */

// Era Definitions
const JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856; // ዓ/ም
const JD_EPOCH_OFFSET_GREGORIAN = 1721426;

const nMonths = 12;
const monthDays = [
  0,
  31, 28, 31, 30, 31, 30,
  31, 31, 30, 31, 30, 31,
];

/**
 * given a year; checks whether or not it's a leap year
 *
 * @param  {Number}  year
 * @return {Boolean}
 */
function isGregorianLeap(year = 1) {
  return (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0));
}

/**
 * converts to Gregorian given a JDN
 *
 * @param  {Number} j
 * @return {Object}
 * @return {Object.Number} Year
 * @return {Object.Number} Month
 * @return {Object.Number} Day
 */
function jdnToGregorian(j = 0) {
  const r2000 = ((j - JD_EPOCH_OFFSET_GREGORIAN) % 730485);
  const r400 = ((j - JD_EPOCH_OFFSET_GREGORIAN) % 146097);
  const r100 = r400 % 36524;
  const r4 = r100 % 1461;

  let n = (r4 % 365) + (365 * Math.floor(r4 / 1460));
  const s = Math.floor(r4 / 1095);
  const aprime = (400 * Math.floor((j - JD_EPOCH_OFFSET_GREGORIAN) / 146097))
               + (100 * Math.floor(r400 / 36524))
               + (4 * Math.floor(r100 / 1461))
               + (Math.floor(r4 / 365) - (Math.floor(r4 / 1460) - Math.floor(r2000 / 730484)));
  const year = aprime + 1;
  const t = Math.floor(((364 + s) - n) / 306);
  let month = (t * (Math.floor(n / 31) + 1))
            + ((1 - t) * (Math.floor(((5 * (n - s)) + 13) / 153) + 1));

  n += 1 - Math.floor(r2000 / 730484);
  let day = n;

  if ((r100 === 0) && (n === 0) && (r400 !== 0)) {
    month = 12;
    day = 31;
  } else {
    monthDays[2] = (isGregorianLeap(year)) ? 29 : 28;
    for (let i = 1; i <= nMonths; i += 1) {
      if (n <= monthDays[i]) {
        day = n;
        break;
      }

      n -= monthDays[i];
    }
  }

  return { year, month, day };
}

/**
 * given Gregorian returns JDN
 *
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} day
 * @return {Number}
 */
function gregorianToJDN(year = 1, month = 1, day = 1) {
  const s = ((Math.floor(year / 4) - Math.floor((year - 1) / 4)) - Math.floor(year / 100))
          + Math.floor((year - 1) / 100) + (Math.floor(year / 400) - Math.floor((year - 1) / 400));

  const t = Math.floor((14 - month) / 12);

  const n = ((31 * t) * (month - 1))
          + ((1 - t) * (59 + s + (30 * (month - 3)) + Math.floor(((3 * month) - 7) / 5)))
          + (day - 1);

  const j = JD_EPOCH_OFFSET_GREGORIAN
          + (365 * (year - 1))
          + (Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100))
          + Math.floor((year - 1) / 400)
          + n;

  return j;
}

/**
 * given JDN and an era JDN offset (consts set up-top)
 *
 * @param  {Number} jdn
 * @param  {Number} era
 * @return {Object}
 * @return {Object.Number} year
 * @return {Object.Number} month
 * @return {Object.Number} day
 */
function jdnToEthiopic(jdn = 1, era = 1) {
  const r = (jdn - era) % 1461;
  const n = (r % 365) + (365 * Math.floor(r / 1460));

  const year = ((4 * Math.floor((jdn - era) / 1461)) + Math.floor(r / 365)) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;

  return { year, month, day };
}

/**
 * given ethCoptic converts to JDN
 *
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} day
 * @param  {Number} era
 * @return {Number}
 */
function ethCopticToJDN(year = 1, month = 1, day = 1, era = 1) {
  return (era + 365) + (365 * (year - 1)) + Math.floor(year / 4) + (30 * month) + (day - 31);
}

/**
 * given Ethiopic returns Gregorian
 *
 * @param {Number} year
 * @param {Number} month
 * @param {Number} day
 * @return {Object}
 * @return {Object.Number} year
 * @return {Object.Number} month
 * @return {Object.Number} day
 */
function ethiopicToGregorian(year = 1, month = 1, day = 1) {
  return jdnToGregorian(ethCopticToJDN(year, month, day, JD_EPOCH_OFFSET_AMETE_MIHRET));
}

/**
 * given Gregorian returns Ethiopic
 *
 * @param {Number} year
 * @param {Number} month
 * @param {Number} day
 * @param {Object}
 * @param {Object.Number} year
 * @param {Object.Number} month
 * @param {Object.Number} day
 */
function gregorianToEthiopic(year = 1, month = 1, day = 1) {
  return jdnToEthiopic(gregorianToJDN(year, month, day), JD_EPOCH_OFFSET_AMETE_MIHRET);
}

module.exports = {
  ethiopicToGregorian,
  gregorianToEthiopic,
};
