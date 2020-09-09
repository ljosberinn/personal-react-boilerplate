import i18n from 'i18next';

import { i18nCache } from '../../../karma/server/i18n/cache';
import {
  render,
  userEvent,
  waitFor,
  screen,
  testA11Y,
  validateHtml,
} from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import { ENABLED_LANGUAGES } from '../../constants';
import { LanguageSwitch } from '../components/LanguageSwitch';

const setup = () => {
  const { container } = render(<LanguageSwitch />);

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

const createGetDataByLanguageSpy = (bool: boolean) =>
  jest
    .spyOn(i18n, 'getDataByLanguage')
    .mockImplementation(() => (bool ? { translation: {} } : undefined));

describe('<LanguageSwitch />', () => {
  let restoreConsole: ReturnType<typeof mockConsoleMethods>['restoreConsole'];

  beforeEach(() => {
    // eslint-disable-next-line prefer-destructuring
    restoreConsole = mockConsoleMethods('error').restoreConsole;
  });

  afterEach(() => {
    restoreConsole();
  });

  it('passes a11y test when closed', async () => {
    await testA11Y(<LanguageSwitch />);
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
    validateHtml(<LanguageSwitch />);
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

  it('changes the language on click', async () => {
    createGetDataByLanguageSpy(true);

    const { button, currentLanguage, randomOtherLanguage } = setup();

    // e.g. i18n.en.i18n.en
    const currentLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[currentLanguage],
    });

    expect(currentLanguageElement).toBeChecked();

    // e.g. i18n.en.i18n.de
    const otherLanguageElement = screen.getByRole('menuitemradio', {
      name: i18nCache[currentLanguage].i18n[randomOtherLanguage],
    });

    expect(otherLanguageElement).not.toBeChecked();

    userEvent.click(otherLanguageElement);

    // changing language is async
    await waitFor(() => expect(i18n.language).toBe(randomOtherLanguage));

    // reopen
    userEvent.click(button);

    expect(
      // i18n.de.i18n.en
      screen.getByRole('menuitemradio', {
        name: i18nCache[randomOtherLanguage].i18n[currentLanguage],
      })
    ).not.toBeChecked();

    expect(
      // i18n.de.i18n.de
      screen.getByRole('menuitemradio', {
        name: i18nCache[randomOtherLanguage].i18n[randomOtherLanguage],
      })
    ).toBeChecked();
  });
});
