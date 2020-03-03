import { characterPattern } from './validators';

/**
 *
 * @param {string} string
 */
export const stringContainsNumber = string => RegExp('[0-9]').test(string);

/**
 *
 * @param {string} string
 */
export const stringContainsLetter = string =>
  RegExp(characterPattern).test(string) && string?.length > 0;

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const upperCaseFirstCharacter = str =>
  str.charAt(0).toUpperCase() + str.slice(1);
