/* eslint-disable max-classes-per-file */
import { getNumberPrecision, isE, num2str, trimNumber, validateNumber } from './numberUtil';
import { supportBigInt } from './supportUtil';
function isEmpty(value) {
  return !value && value !== 0 && !Number.isNaN(value) || !String(value).trim();
}
/**
 * We can remove this when IE not support anymore
 */
export class NumberDecimal {
  constructor(value) {
    this.origin = '';
    if (isEmpty(value)) {
      this.empty = true;
      return;
    }
    this.origin = String(value);
    this.number = Number(value);
  }
  negate() {
    return new NumberDecimal(-this.toNumber());
  }
  add(value) {
    if (this.isInvalidate()) {
      return new NumberDecimal(value);
    }
    const target = Number(value);
    if (Number.isNaN(target)) {
      return this;
    }
    const number = this.number + target;
    // [Legacy] Back to safe integer
    if (number > Number.MAX_SAFE_INTEGER) {
      return new NumberDecimal(Number.MAX_SAFE_INTEGER);
    }
    if (number < Number.MIN_SAFE_INTEGER) {
      return new NumberDecimal(Number.MIN_SAFE_INTEGER);
    }
    const maxPrecision = Math.max(getNumberPrecision(this.number), getNumberPrecision(target));
    return new NumberDecimal(number.toFixed(maxPrecision));
  }
  isEmpty() {
    return this.empty;
  }
  isNaN() {
    return Number.isNaN(this.number);
  }
  isInvalidate() {
    return this.isEmpty() || this.isNaN();
  }
  equals(target) {
    return this.toNumber() === (target === null || target === void 0 ? void 0 : target.toNumber());
  }
  lessEquals(target) {
    return this.add(target.negate().toString()).toNumber() <= 0;
  }
  toNumber() {
    return this.number;
  }
  toString() {
    let safe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (!safe) {
      return this.origin;
    }
    if (this.isInvalidate()) {
      return '';
    }
    return num2str(this.number);
  }
}
export class BigIntDecimal {
  constructor(value) {
    this.origin = '';
    if (isEmpty(value)) {
      this.empty = true;
      return;
    }
    this.origin = String(value);
    // Act like Number convert
    if (value === '-' || Number.isNaN(value)) {
      this.nan = true;
      return;
    }
    let mergedValue = value;
    // We need convert back to Number since it require `toFixed` to handle this
    if (isE(mergedValue)) {
      mergedValue = Number(mergedValue);
    }
    mergedValue = typeof mergedValue === 'string' ? mergedValue : num2str(mergedValue);
    if (validateNumber(mergedValue)) {
      const trimRet = trimNumber(mergedValue);
      this.negative = trimRet.negative;
      const numbers = trimRet.trimStr.split('.');
      this.integer = BigInt(numbers[0]);
      const decimalStr = numbers[1] || '0';
      this.decimal = BigInt(decimalStr);
      this.decimalLen = decimalStr.length;
    } else {
      this.nan = true;
    }
  }
  getMark() {
    return this.negative ? '-' : '';
  }
  getIntegerStr() {
    return this.integer.toString();
  }
  getDecimalStr() {
    return this.decimal.toString().padStart(this.decimalLen, '0');
  }
  /**
   * Align BigIntDecimal with same decimal length. e.g. 12.3 + 5 = 1230000
   * This is used for add function only.
   */
  alignDecimal(decimalLength) {
    const str = `${this.getMark()}${this.getIntegerStr()}${this.getDecimalStr().padEnd(decimalLength, '0')}`;
    return BigInt(str);
  }
  negate() {
    const clone = new BigIntDecimal(this.toString());
    clone.negative = !clone.negative;
    return clone;
  }
  add(value) {
    if (this.isInvalidate()) {
      return new BigIntDecimal(value);
    }
    const offset = new BigIntDecimal(value);
    if (offset.isInvalidate()) {
      return this;
    }
    const maxDecimalLength = Math.max(this.getDecimalStr().length, offset.getDecimalStr().length);
    const myAlignedDecimal = this.alignDecimal(maxDecimalLength);
    const offsetAlignedDecimal = offset.alignDecimal(maxDecimalLength);
    const valueStr = (myAlignedDecimal + offsetAlignedDecimal).toString();
    // We need fill string length back to `maxDecimalLength` to avoid parser failed
    const {
      negativeStr,
      trimStr
    } = trimNumber(valueStr);
    const hydrateValueStr = `${negativeStr}${trimStr.padStart(maxDecimalLength + 1, '0')}`;
    return new BigIntDecimal(`${hydrateValueStr.slice(0, -maxDecimalLength)}.${hydrateValueStr.slice(-maxDecimalLength)}`);
  }
  isEmpty() {
    return this.empty;
  }
  isNaN() {
    return this.nan;
  }
  isInvalidate() {
    return this.isEmpty() || this.isNaN();
  }
  equals(target) {
    return this.toString() === (target === null || target === void 0 ? void 0 : target.toString());
  }
  lessEquals(target) {
    return this.add(target.negate().toString()).toNumber() <= 0;
  }
  toNumber() {
    if (this.isNaN()) {
      return NaN;
    }
    return Number(this.toString());
  }
  toString() {
    let safe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (!safe) {
      return this.origin;
    }
    if (this.isInvalidate()) {
      return '';
    }
    return trimNumber(`${this.getMark()}${this.getIntegerStr()}.${this.getDecimalStr()}`).fullStr;
  }
}
export default function getMiniDecimal(value) {
  // We use BigInt here.
  // Will fallback to Number if not support.
  if (supportBigInt()) {
    return new BigIntDecimal(value);
  }
  return new NumberDecimal(value);
}
/**
 * Align the logic of toFixed to around like 1.5 => 2.
 * If set `cutOnly`, will just remove the over decimal part.
 */
export function toFixed(numStr, separatorStr, precision) {
  let cutOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (numStr === '') {
    return '';
  }
  const {
    negativeStr,
    integerStr,
    decimalStr
  } = trimNumber(numStr);
  const precisionDecimalStr = `${separatorStr}${decimalStr}`;
  const numberWithoutDecimal = `${negativeStr}${integerStr}`;
  if (precision >= 0) {
    // We will get last + 1 number to check if need advanced number
    const advancedNum = Number(decimalStr[precision]);
    if (advancedNum >= 5 && !cutOnly) {
      const advancedDecimal = getMiniDecimal(numStr).add(`${negativeStr}0.${'0'.repeat(precision)}${10 - advancedNum}`);
      return toFixed(advancedDecimal.toString(), separatorStr, precision, cutOnly);
    }
    if (precision === 0) {
      return numberWithoutDecimal;
    }
    return `${numberWithoutDecimal}${separatorStr}${decimalStr.padEnd(precision, '0').slice(0, precision)}`;
  }
  if (precisionDecimalStr === '.0') {
    return numberWithoutDecimal;
  }
  return `${numberWithoutDecimal}${precisionDecimalStr}`;
}