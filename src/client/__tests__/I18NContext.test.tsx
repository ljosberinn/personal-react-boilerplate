import { render, screen, waitFor } from '@testing-library/react';

import { mockConsoleMethods } from '../../../testUtils/console';
import { i18nCache } from '../../../testUtils/i18n';
import { FALLBACK_LANGUAGE } from '../../constants';
import type { Namespace } from '../../constants';
import { I18NContextProvider } from '../context/I18NContext';
import { useTranslation } from '../hooks/useTranslation';
import type { I18nextResources } from '../karma/i18n';

const ns = 'i18n';
const key = 'language-toggle';

describe('<I18NContextProvder />', () => {
  test('given no bundle, returns given key', () => {
    function MockComponent() {
      const { t } = useTranslation();

      return (
        <div>
          <span>{t([ns, key])}</span>
          <span>{t(`${ns}:${key}`)}</span>
        </div>
      );
    }

    render(
      // @ts-expect-error intentional omission of `bundle`
      <I18NContextProvider locale={FALLBACK_LANGUAGE}>
        <MockComponent />
      </I18NContextProvider>
    );

    expect(screen.getAllByText(`${ns}:${key}`)).toHaveLength(2);
  });

  test('allows nested lookups when not passing a namespace to useTranslation', () => {
    function MockComponent() {
      const { t } = useTranslation();

      return (
        <div>
          <span>{t([ns, key])}</span>
          <span>{t(`${ns}:${key}`)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider locale={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const expectedText = i18nCache[FALLBACK_LANGUAGE][ns]![key];

    expect(screen.getAllByText(expectedText)).toHaveLength(2);
  });

  test('allows nested lookups when passing a namespace to useTranslation', () => {
    function MockComponent() {
      const { t } = useTranslation(ns);

      return (
        <div>
          <span>{t(key)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider locale={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const expectedText = i18nCache[FALLBACK_LANGUAGE][ns]![key];

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  test('allows accessing a different namespace than passed to useTranslation', () => {
    const otherNs = 'serviceWorker';
    const otherKey = 'newVersion';

    function MockComponent() {
      const { t } = useTranslation(ns);

      return (
        <div>
          <span>{t(key)}</span>
          <span>{t([otherNs, otherKey])}</span>
          <span>{t(`${otherNs}:${otherKey}`)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider locale={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const expectedText = i18nCache[FALLBACK_LANGUAGE][ns]![key];
    const other = i18nCache[FALLBACK_LANGUAGE][otherNs]![otherKey];

    expect(screen.getAllByText(other)).toHaveLength(2);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  test('warns once for each missing key', () => {
    const { restoreConsole } = mockConsoleMethods('warn');

    const invalidKey1 = 'foo:bar';
    const invalidKey2 = 'foo';

    function MockComponent() {
      const { t } = useTranslation();

      return (
        <div>
          <span>{t(invalidKey1)}</span>
          <span>{t(invalidKey1)}</span>

          <span>{t(invalidKey2)}</span>
          <span>{t(invalidKey2)}</span>
        </div>
      );
    }

    render(
      <I18NContextProvider locale={FALLBACK_LANGUAGE} resources={i18nCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledTimes(2);

    expect(screen.getAllByText(invalidKey1)).toHaveLength(2);
    expect(screen.getAllByText(invalidKey2)).toHaveLength(2);

    restoreConsole();
  });

  test('interpolates variables', () => {
    const ns: Namespace = 'serviceWorker';
    const placeholder = '{{randomNumber}}';
    const value = `coming up - a random number: ${placeholder}`;

    const randomNumber = Math.random();

    const mockCache: I18nextResources = {
      [FALLBACK_LANGUAGE]: {
        [ns]: {
          [key]: value,
        },
      },
    };

    function MockComponent() {
      const { t } = useTranslation(ns);

      return (
        <h1>
          {t(key, {
            randomNumber,
          })}
        </h1>
      );
    }

    render(
      <I18NContextProvider locale={FALLBACK_LANGUAGE} resources={mockCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const expected = value.replace(placeholder, `${randomNumber}`);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  test('warns when trying to interpolate a nonexistant variable', () => {
    const { restoreConsole } = mockConsoleMethods('warn');

    const ns: Namespace = 'serviceWorker';
    const placeholder = '{{placeholder}}';
    const value = `coming up - a random number: ${placeholder}`;

    const randomNumber = Math.random();

    const mockCache: I18nextResources = {
      [FALLBACK_LANGUAGE]: {
        [ns]: {
          [key]: value,
        },
      },
    };

    function MockComponent() {
      const { t } = useTranslation(ns);

      return (
        <h1>
          {t(key, {
            randomNumber,
          })}
          {t(key, {
            randomNumber,
          })}
        </h1>
      );
    }

    render(
      <I18NContextProvider locale={FALLBACK_LANGUAGE} resources={mockCache}>
        <MockComponent />
      </I18NContextProvider>
    );

    const unexpected = value.replace(placeholder, `${randomNumber}`);

    expect(screen.queryByText(unexpected)).not.toBeInTheDocument();

    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledTimes(1);

    restoreConsole();
  });

  ['en', 'ar'].forEach((language) => {
    const dir = language === 'en' ? 'ltr' : 'rtl';

    const setup = () => {
      const qsSpy = jest.spyOn(document, 'querySelector');
      const setAttributeSpy = jest.spyOn(HTMLElement.prototype, 'setAttribute');

      render(<h1>test</h1>, {
        wrapper: ({ children }) => (
          <I18NContextProvider locale={language} resources={i18nCache}>
            {children}
          </I18NContextProvider>
        ),
      });

      return { qsSpy, setAttributeSpy };
    };

    test(`always sets html.lang attribute (language: ${language})`, async () => {
      const { qsSpy, setAttributeSpy } = setup();

      await waitFor(() => {
        expect(qsSpy).toHaveBeenLastCalledWith('html');
      });

      expect(setAttributeSpy).toHaveBeenCalledWith('lang', language);
    });

    test(`always sets the html.dir attribute (language: ${language})`, async () => {
      const { qsSpy, setAttributeSpy } = setup();

      await waitFor(() => {
        expect(qsSpy).toHaveBeenLastCalledWith('html');
      });

      expect(setAttributeSpy).toHaveBeenCalledWith('dir', dir);
    });
  });
});
