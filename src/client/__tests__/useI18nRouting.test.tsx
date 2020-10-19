import { hookAct, renderHook } from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import {
  DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME,
  ENABLED_LANGUAGES,
  FALLBACK_LANGUAGE,
} from '../../constants';
import { useI18nRouting } from '../hooks/useI18nRouting';

const setup = ({ replace = jest.fn(), locale = FALLBACK_LANGUAGE }) => {
  jest.spyOn(window.location, 'assign');

  const mockRoute = `[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]/foo/bar/baz`;
  const expectedRoute = mockRoute.replace(
    `[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]`,
    locale
  );

  const { result } = renderHook(useI18nRouting, {
    omitKarmaProvider: true,
    router: {
      replace,
      route: mockRoute,
    },
  });

  return {
    expectedRoute,
    mockRoute,
    replace,
    result,
  };
};

describe('hooks/useI18nRouting', () => {
  const realLocation = window.location;

  beforeEach(() => {
    // @ts-expect-error jest does not support location to be spied on
    delete window.location;
    window.location = { ...realLocation, assign: jest.fn() };
  });

  afterEach(() => {
    window.location = realLocation;
  });

  test('warns when given a language not included in ENABLED_LANGUAGES', async () => {
    const { restoreConsole } = mockConsoleMethods('warn');

    const locale = 'foo';

    const { replace, result } = setup({ locale });

    await hookAct(async () => {
      await result.current.changeLocale(locale);
    });

    expect(replace).not.toHaveBeenCalled();
    expect(window.location.assign).not.toHaveBeenCalled();

    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledTimes(1);

    restoreConsole();
  });

  ENABLED_LANGUAGES.forEach((locale) => {
    describe('changeLocale', () => {
      test(`replaces the current locale with the new (lang: "${locale}")`, async () => {
        const { expectedRoute, replace, result } = setup({ locale });

        await hookAct(async () => {
          await result.current.changeLocale(locale);
        });

        expect(replace).toHaveBeenCalledTimes(1);
        expect(replace).toHaveBeenCalledWith(expectedRoute);
      });

      test('uses window.location.assign in case useRouter().replace fails', async () => {
        const replace = jest.fn().mockImplementationOnce(() => {
          throw new Error('test error');
        });

        const { expectedRoute, result } = setup({ locale, replace });

        await hookAct(async () => {
          await result.current.changeLocale(locale);
        });

        expect(replace).toHaveBeenCalledTimes(1);

        expect(window.location.assign).toHaveBeenCalledTimes(1);
        expect(window.location.assign).toHaveBeenCalledWith(expectedRoute);
      });
    });

    describe('createChangeLocaleHandler', () => {
      test('resulting function changes locale', async () => {
        const { result, replace, expectedRoute } = setup({
          locale,
        });

        const handler = result.current.createChangeLocaleHandler(locale);

        await hookAct(async () => {
          await handler();
        });

        expect(replace).toHaveBeenCalledTimes(1);
        expect(replace).toHaveBeenCalledWith(expectedRoute);
      });
    });
  });
});
