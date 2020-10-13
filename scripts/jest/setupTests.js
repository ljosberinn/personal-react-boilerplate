import { parse, serialize } from 'cookie';
import { config } from 'dotenv';
import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';

config();

/**
 * required to avoid having to declare dynamic env variables in
 * `./github/workflows/*.yml`
 * config files which would be needed there to allow tests to run on CI
 */
(function assignMinimumReqEnvVariables() {
  process.env.NEXT_PUBLIC_ENABLED_LANGUAGES =
    process.env.NEXT_PUBLIC_ENABLED_LANGUAGES ?? 'en,de';

  process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE =
    process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE ?? 'en';

  process.env.NEXT_PUBLIC_ENABLED_PROVIDER =
    process.env.NEXT_PUBLIC_ENABLED_PROVIDER ??
    'local,github,google,facebook,discord';

  process.env.NEXT_PUBLIC_SESSION_LIFETIME =
    process.env.NEXT_PUBLIC_SESSION_LIFETIME ?? 28800;

  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
})();

// eslint-disable-next-line jest/require-top-level-describe
afterEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();

  Object.keys(parse(document.cookie)).forEach((key) => {
    document.cookie = serialize(key, '', {
      maxAge: -1,
    });
  });
});
