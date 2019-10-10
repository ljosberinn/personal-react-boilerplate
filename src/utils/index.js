import { allowedSpecialCharacters } from './validators';

/**
 *
 * @param {string} string
 */
const stringContainsNumber = string =>
  string.split('').filter(Number).length > 0;

/**
 *
 * @param {string} string
 */
const stringContainsSpecialCharacter = string =>
  new RegExp(`[${allowedSpecialCharacters.join('')}]`).test(string);

/**
 * @example className={sanitizeClassArray(['foo', somethingTruthy && 'bar', 'baz'])}
 *
 * @param {(string|false)[]} classes
 *
 * @returns {string}
 */
const sanitizeClassArray = classes => classes.filter(Boolean).join(' ');

/**
 *
 * @param {string} string
 */

const stringContainsUppercaseCharacter = string =>
  new RegExp('[A-Z]').test(string);

export {
  stringContainsNumber,
  stringContainsSpecialCharacter,
  sanitizeClassArray,
  allowedSpecialCharacters,
  stringContainsUppercaseCharacter,
};
