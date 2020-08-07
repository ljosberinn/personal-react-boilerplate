import { withScope, captureException } from '@sentry/node';
import universalLanguageDetect from '@unly/universal-language-detector';
import { parse } from 'cookie';
import { NextPageContext } from 'next';

import { SUPPORTED_LANGUAGES_MAP, ENABLED_LANGUAGES } from '../../constants';

/**
 * Dynamically detects the users preferred language based on
 *
 * - request header
 * - cookies
 *
 * and picks the best match from existing languages.
 */
export const detectLanguage = (ctx: NextPageContext) => {
  const cookies = ctx.req?.headers.cookie;
  const serverCookies = cookies ? parse(cookies) : undefined;

  /* istanbul ignore next */
  return universalLanguageDetect({
    acceptLanguageHeader: ctx.req?.headers['accept-language'],
    errorHandler: (error, level, origin, context) => {
      withScope((scope) => {
        scope.setExtra('level', level);
        scope.setExtra('origin', origin);

        if (context) {
          scope.setContext('context', context);
        }

        captureException(error);
      });
    },
    fallbackLanguage: SUPPORTED_LANGUAGES_MAP.en,
    serverCookies,
    supportedLanguages: ENABLED_LANGUAGES,
  });
};
