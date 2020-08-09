import { parse } from 'cookie';
import { IncomingMessage } from 'http';

import { i18nCookieName } from '../../client/i18n';
import { ENABLED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from '../../constants';

// eslint-disable-next-line unicorn/no-unsafe-regex
const regExp = /(?<language>[a-z]{2})(?:-[a-z]{2,4}){0,2}(?:;q=(?<quality>\d(?:\.\d+)?)?)?/gi;

// in case ENABLED_LANGUAGES contains region indicators
const supportedLanguages = ENABLED_LANGUAGES.map(
  (locale) => locale.split('-')[0]
);

/**
 * @see https://github.com/opentable/accept-language-parser/blob/master/index.js
 */
export const findLanguageByAcceptLanguageHeader = (
  header: string
): string | null => {
  // eslint-disable-next-line unicorn/no-unsafe-regex
  const matches = header.matchAll(regExp);

  const sortedCodes = [...matches]
    .map((match) => {
      // since capture groups are used above, we can safely ! here
      const { language, quality } = match.groups!;

      return {
        language,
        quality: quality ? Number.parseFloat(quality) : 1,
      };
    }) // sort by quality desc
    .sort((a, b) => b.quality - a.quality)
    // throw away quality after sorting
    .map(({ language }) => language);

  return (
    sortedCodes.find((language) =>
      supportedLanguages.find(
        (supportedLanguage) => supportedLanguage === language
      )
    ) ?? null
  );
};

/**
 * Dynamically detects the users preferred language based on
 *
 * - request header
 * - cookies
 *
 * and picks the best match from existing languages.
 *
 * Modeled after UnlyEd/universal-language-detector which has tree-shaking
 * issues.
 *
 * @see https://github.com/UnlyEd/universal-language-detector
 */
export const detectLanguage = ({ headers }: IncomingMessage) => {
  const cookies = headers.cookie;
  const serverCookies = cookies ? parse(cookies) : {};

  const fallbackLanguage = SUPPORTED_LANGUAGES_MAP.en;
  const languageByCookie = serverCookies[i18nCookieName];

  if (languageByCookie && ENABLED_LANGUAGES.includes(languageByCookie)) {
    return languageByCookie;
  }

  const acceptLanguageHeader = headers['accept-language'];

  if (acceptLanguageHeader) {
    try {
      const parsedLanguage = findLanguageByAcceptLanguageHeader(
        acceptLanguageHeader
      );

      if (parsedLanguage && ENABLED_LANGUAGES.includes(parsedLanguage)) {
        return parsedLanguage;
      }
    } catch {
      return fallbackLanguage;
    }
  }

  return fallbackLanguage;
};
