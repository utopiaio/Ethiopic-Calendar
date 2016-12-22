/* eslint no-console: 0 */
/* eslint no-mixed-operators: 0 */

/**
 * This is JavaScript implementation of Beyene-Kudlek algorithm.
 *
 * For more info have a look at: http://www.geez.org/Calendars/
 * Java Code at https://github.com/geezorg/geezorg.github.io/blob/master/Calendars/EthiopicCalendar.java
 */

/*
** ********************************************************************************
**  Era Definitions and Private Data
** ********************************************************************************
*/
const JD_EPOCH_OFFSET_AMETE_ALEM = -285019; // ዓ/ዓ
const JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856; // ዓ/ም
const JD_EPOCH_OFFSET_GREGORIAN = 1721426;

const nMonths = 12;

const monthDays = [
  0,
  31, 28, 31, 30, 31, 30,
  31, 31, 30, 31, 30, 31,
];

function quotient(i, j) {
  return Math.floor(i / j);
}

function mod(i, j) {
  return (i - (j * quotient(i, j)));
}

function isGregorianLeap(year) {
  return (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0));
}

/**
 *  Computes the Julian day number of the given Coptic or Ethiopic date.
 *  This method assumes that the JDN epoch offset has been set. This method
 *  is called by copticToGregorian and ethiopicToGregorian which will set
 *  the jdn offset context.
 *
 *  @param {Number} y year in the Ethiopic calendar
 *  @param {Number} m month in the Ethiopic calendar
 *  @param {Number} d date in the Ethiopic calendar
 *  @param {Number} E [description]
 *
 *  @return {Number} The Julian Day Number (JDN)
 */
function ethCopticToJDN(year, month, day, era) {
  return (era + 365) + 365 * (year - 1) + quotient(year, 4) + 30 * month + day - 31;
}

function jdnToGregorian(j) {
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
  n += 1 - quotient(r2000, 730484);
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

/*
** ********************************************************************************
**  Conversion Methods To/From the Julian Day Number
** ********************************************************************************
*/
function guessEraFromJDN(jdn) {
  return (jdn >= (JD_EPOCH_OFFSET_AMETE_MIHRET + 365))
    ? JD_EPOCH_OFFSET_AMETE_MIHRET
    : JD_EPOCH_OFFSET_AMETE_ALEM;
}

function gregorianToJDN(y, m, d) {
  const s = quotient(y, 4)
          - quotient(y - 1, 4)
          - quotient(y, 100)
          + quotient(y - 1, 100)
          + quotient(y, 400)
          - quotient(y - 1, 400);
  const t = quotient(14 - m, 12);
  const n = 31 * t * (m - 1)
        + (1 - t) * (59 + s + 30 * (m - 3) + quotient((3 * m - 7), 5))
        + d - 1;

  const j = JD_EPOCH_OFFSET_GREGORIAN
          + 365 * (y - 1)
          + quotient(y - 1, 4)
          - quotient(y - 1, 100)
          + quotient(y - 1, 400)
          + n;

  return j;
}

function jdnToEthiopic(jdn, era) {
  const r = mod((jdn - era), 1461);
  const n = mod(r, 365) + 365 * quotient(r, 1460);

  const year = 4 * quotient((jdn - era), 1461) + quotient(r, 365) - quotient(r, 1460);
  const month = quotient(n, 30) + 1;
  const day = mod(n, 30) + 1;

  return { year, month, day };
}

function ethiopicToGregorian(year = 1, month = 1, day = 1, era = JD_EPOCH_OFFSET_AMETE_MIHRET) {
  const jdn = ethCopticToJDN(year, month, day, era);
  return jdnToGregorian(jdn);
}

function gregorianToEthiopic(year, month, day) {
  const jdn = gregorianToJDN(year, month, day);
  return jdnToEthiopic(jdn, guessEraFromJDN(jdn));
}

module.exports = {
  ethiopicToGregorian,
  gregorianToEthiopic,
  AA: JD_EPOCH_OFFSET_AMETE_ALEM,
  AM: JD_EPOCH_OFFSET_AMETE_MIHRET,
};
