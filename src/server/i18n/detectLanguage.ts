import { parse } from 'cookie';
import type { IncomingMessage } from 'http';

import {
  ENABLED_LANGUAGES,
  FALLBACK_LANGUAGE,
  I18N_COOKIE_NAME,
} from '../../../src/constants';

// eslint-disable-next-line unicorn/no-unsafe-regex
const regExp = /(?<language>[a-z]{2})(?:-[a-z]{2,4}){0,2}(?:;q=(?<quality>\d(?:\.\d+)?)?)?/giu;

// eslint-disable-next-line inclusive-language/use-inclusive-words
/**
 * @see https://github.com/opentable/accept-language-parser/blob/master/index.js
 */
export const findLanguageByAcceptLanguageHeader = (header: string): string =>
  [...header.matchAll(regExp)]
    .map((match) => {
      // since capture groups are used above, we can safely ! here
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { language, quality } = match.groups!;

      return {
        language,
        quality: quality ? Number.parseFloat(quality) : 1,
      };
    })
    // sort by quality desc
    .sort((a, b) => b.quality - a.quality)
    // throw away quality
    .map(({ language }) => language)
    // match against ENABLED_LANGUAGES, else fallback
    .find((language) => ENABLED_LANGUAGES.includes(language)) ??
  FALLBACK_LANGUAGE;

/**
 * Dynamically detects the users preferred language based on
 *
 * - cookies
 * - request header
 *
 * and picks the best match from existing languages.
 *
 * Modeled after `UnlyEd/universal-language-detector` which has tree-shaking
 * and dependency issues.
 *
 * @see https://github.com/UnlyEd/universal-language-detector
 */
export const detectLanguage = ({ headers }: IncomingMessage): string => {
  const serverCookies = headers.cookie ? parse(headers.cookie) : {};
  const languageByCookie = serverCookies[I18N_COOKIE_NAME];

  // previous visit, acknowledge
  if (languageByCookie && ENABLED_LANGUAGES.includes(languageByCookie)) {
    return languageByCookie;
  }

  // if given, attempt to parse
  const acceptLanguageHeader = headers['accept-language'];

  if (acceptLanguageHeader) {
    return findLanguageByAcceptLanguageHeader(acceptLanguageHeader);
  }

  return FALLBACK_LANGUAGE;
};
