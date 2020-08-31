import { ENABLED_LANGUAGES } from '../../../src/constants';
import { testLambda } from '../../../testUtils/lambda';
import { RequestMethods, RequestInitMethod } from '../../utils/requestMethods';
import { NOT_FOUND, BAD_REQUEST, OK } from '../../utils/statusCodes';
import { i18nCache } from '../i18n/cache';
import { i18nHandler } from '../i18n/routes';

const methods = new Set<RequestInitMethod>(['get', 'head']);
const url = '/api/v1/i18n';
const catchAllName = 'language';

describe('api/i18n', () => {
  test('should be a function', () => {
    expect(i18nHandler).toBeInstanceOf(Function);
  });

  RequestMethods.filter((requestMethod) => !methods.has(requestMethod)).forEach(
    (method) => {
      test(`does nothing on method "${method}"`, async () => {
        const response = await testLambda(i18nHandler, {
          catchAllName,
          method,
          url,
        });

        expect(response.status).toBe(NOT_FOUND);
      });
    }
  );

  test('responds with BAD_REQUEST given no language', async () => {
    const response = await testLambda(i18nHandler, {
      catchAllName,
      url,
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  test('responds with BAD_REQUEST given no valid language', async () => {
    const response = await testLambda(i18nHandler, {
      catchAllName,
      url: `${url}/asdf`,
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  test('responds with BAD_REQUEST given no enabled language', async () => {
    const response = await testLambda(i18nHandler, {
      catchAllName,
      url: `${url}/fr`,
    });

    expect(response.status).toBe(BAD_REQUEST);
  });

  ENABLED_LANGUAGES.forEach((language) => {
    test(`responds with a JSON given an enabled language (lang: ${language})`, async () => {
      const response = await testLambda(i18nHandler, {
        catchAllName,
        url: [url, language].join('/'),
      });

      expect(response.status).toBe(OK);

      const json = await response.json();

      expect(json).toMatchObject(i18nCache[language]);
    });
  });
});
