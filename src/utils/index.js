import { allowedSpecialCharacters, characterPattern } from './validators';

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
 *
 * @param {string} string
 */
const stringContainsLetter = string =>
  new RegExp(characterPattern).test(string);

/**
 *
 * @param {string} str
 * @returns {string}
 */
const upperCaseFirstCharacter = str =>
  str.charAt(0).toUpperCase() + str.slice(1);

export {
  stringContainsNumber,
  stringContainsSpecialCharacter,
  allowedSpecialCharacters,
  stringContainsLetter,
  upperCaseFirstCharacter,
};
