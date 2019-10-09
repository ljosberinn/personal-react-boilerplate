import { allowedSpecialCharacters } from './validators';

/**
 *
 * @param {string} string
 */
function stringContainsNumber(string) {
  return string.split('').filter(Number).length > 0;
}

/**
 *
 * @param {string} string
 */
function stringContainsSpecialCharacter(string) {
  return new RegExp(`[${allowedSpecialCharacters.join('')}]`).test(string);
}

/**
 * @example className={sanitizeClassArray(['foo', somethingTruthy && 'bar', 'baz'])}
 *
 * @param {(string|false)[]} classes
 *
 * @returns {string}
 */
function sanitizeClassArray(classes) {
  return classes.filter(Boolean).join(' ');
}

export {
  stringContainsNumber,
  stringContainsSpecialCharacter,
  sanitizeClassArray,
  allowedSpecialCharacters,
};
