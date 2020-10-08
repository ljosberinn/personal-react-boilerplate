import i18n from 'i18next';

import {
  render,
  userEvent,
  screen,
  testA11Y,
  validateHtml,
} from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import { ENABLED_LANGUAGES } from '../../constants';
import { i18nCache } from '../../server/i18n/cache';
import { LanguageSwitchAlt } from '../components/LanguageSwitchAlt';
import * as i18nRoutingHook from '../hooks/useI18nRouting';

const setup = () => {
  const { container } = render(<LanguageSwitchAlt />);

  const button = screen.getByRole('button');

  // actually open the menu as other elements are not rendered before
  userEvent.click(button);

  const currentLanguage = ENABLED_LANGUAGES.find(
    (slug) => i18n.language === slug
  )!;

  const otherLanguages = ENABLED_LANGUAGES.filter(
    (slug) => slug !== currentLanguage
  );

  const randomOtherLanguage =
    otherLanguages[Math.floor(Math.random() * otherLanguages.length)];

  return { button, container, currentLanguage, randomOtherLanguage };
};

describe('<LanguageSwitchAlt />', () => {
  let restoreConsole: ReturnType<typeof mockConsoleMethods>['restoreConsole'];

  beforeAll(() => {
    // eslint-disable-next-line prefer-destructuring
    restoreConsole = mockConsoleMethods('error').restoreConsole;
  });

  afterAll(() => {
    restoreConsole();
  });

  it('passes a11y test when closed', async () => {
    await testA11Y(<LanguageSwitchAlt />);
  });

  it('passes a11y test when opened', async () => {
    const { container } = setup();

    await testA11Y(container, {
      /**
       * @see https://github.com/dequelabs/axe-core/issues/2513
       */
      axeOptions: {
        rules: {
          'aria-required-parent': {
            enabled: false,
          },
        },
      },
    });
  });

  it('contains valid html', () => {
    validateHtml(<LanguageSwitchAlt />);
  });

  it('contains valid html when opened', () => {
    const { container } = setup();

    validateHtml(container);
  });

  it('includes a request for translation help', () => {
    const { currentLanguage } = setup();

    const cta = screen.getByRole('menuitem', {
      name: i18nCache[currentLanguage].i18n['help-cta'],
    });

    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href');
  });

  it('attempts to redirect to another locale route on click', async () => {
    const mockChangeLocale = jest.fn();

    jest.spyOn(i18nRoutingHook, 'useI18nRouting').mockImplementation(() => {
      return {
        changeLocale: mockChangeLocale,
        createChangeLocaleHandler: jest
          .fn()
          .mockImplementation(() => mockChangeLocale),
      };
    });

    const { currentLanguage, randomOtherLanguage } = setup();

    // e.g. i18n.en.i18n.de
    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });

    userEvent.click(otherLanguageElement);

    expect(mockChangeLocale).toHaveBeenCalledTimes(1);
  });
});
