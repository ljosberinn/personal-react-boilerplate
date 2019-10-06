import { allowedSpecialCharacters } from './validators';

function FunctionThatReturnsTrue() {
  return true;
}

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
 *
 * @param {(string|false)[]} classes
 */
function sanitizeClassArray(classes) {
  return classes.filter(Boolean).join(' ');
}

export {
  FunctionThatReturnsTrue,
  stringContainsNumber,
  stringContainsSpecialCharacter,
  sanitizeClassArray,
  allowedSpecialCharacters,
};
