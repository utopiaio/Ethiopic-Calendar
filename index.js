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
 * returns quotient
 *
 * @param  {Number} i
 * @param  {Number} j
 * @return {Number}
 */
function quotient(i = 1, j = 1) {
  return Math.floor(i / j);
}

/**
 * returns modulo
 *
 * @param  {Number} i
 * @param  {Number} j
 * @return {Number}
 */
function mod(i = 1, j = 1) {
  return (i - (j * quotient(i, j)));
}

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
  const r2000 = mod((j - JD_EPOCH_OFFSET_GREGORIAN), 730485);
  const r400 = mod((j - JD_EPOCH_OFFSET_GREGORIAN), 146097);
  const r100 = mod(r400, 36524);
  const r4 = mod(r100, 1461);

  let n = mod(r4, 365) + 365 * quotient(r4, 1460);
  const s = quotient(r4, 1095);


  const aprime = 400 * quotient((j - JD_EPOCH_OFFSET_GREGORIAN), 146097)
               + 100 * quotient(r400, 36524)
               + 4 * quotient(r100, 1461)
               + quotient(r4, 365)
               - quotient(r4, 1460)
               - quotient(r2000, 730484);

  const year = aprime + 1;
  const t = quotient((364 + s - n), 306);
  let month = t * (quotient(n, 31) + 1) + (1 - t) * (quotient((5 * (n - s) + 13), 153) + 1);
  /*
  const day = t * (n - s - 31 * month + 32)
            + (1 - t) * (n - s - 30 * month - quotient((3 * month - 2), 5) + 33);
  */

  // const n2000 = quotient(r2000, 730484);
  n += 1 - quotient(r2000, 730484);
  let day = n;

  if ((r100 === 0) && (n === 0) && (r400 !== 0)) {
    month = 12;
    day = 31;
  } else {
    monthDays[2] = (isGregorianLeap(year)) ? 29 : 28;
    for (let i = 1; i <= nMonths; ++i) {
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
  const s = quotient(year, 4)
          - quotient(year - 1, 4)
          - quotient(year, 100)
          + quotient(year - 1, 100)
          + quotient(year, 400)
          - quotient(year - 1, 400);

  const t = quotient(14 - month, 12);

  const n = 31 * t * (month - 1)
          + (1 - t) * (59 + s + 30 * (month - 3) + quotient((3 * month - 7), 5))
          + day - 1;

  const j = JD_EPOCH_OFFSET_GREGORIAN
          + 365 * (year - 1)
          + quotient(year - 1, 4)
          - quotient(year - 1, 100)
          + quotient(year - 1, 400)
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
  const r = mod((jdn - era), 1461);
  const n = mod(r, 365) + 365 * quotient(r, 1460);

  const year = 4 * quotient((jdn - era), 1461)
      + quotient(r, 365)
      - quotient(r, 1460);
  const month = quotient(n, 30) + 1;
  const day = mod(n, 30) + 1;

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
  return (era + 365) + 365 * (year - 1) + quotient(year, 4) + 30 * month + day - 31;
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

/**
 * given Gregorian (en) weekday returns the Ethiopic dddd
 *
 * @param  {String} day
 * @return {String | null}
 */
function gregorianWeekdayToEthiopicWeekday(day) {
  const dddd = {
    Sunday: 'እሑድ',
    Monday: 'ሰኞ',
    Tuesday: 'ማክሰኞ',
    Wednesday: 'ረቡዕ',
    Thursday: 'ሐሙስ',
    Friday: 'ዓርብ',
    Saturday: 'ቅዳሜ',
  };

  return dddd[day] || null;
}

/**
 * given an Ethiopic month number returns Ethiopic MMMM
 *
 * @param {Number} month
 * @return {String | null}
 */
function ethiopicMonthToFullEthiopicMonth(month) {
  const MMMM = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];

  return MMMM[month - 1] || null;
}

module.exports = {
  ethiopicToGregorian,
  gregorianToEthiopic,
  gregorianWeekdayToEthiopicWeekday,
  ethiopicMonthToFullEthiopicMonth,
};
