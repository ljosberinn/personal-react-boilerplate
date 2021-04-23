import {
  render,
  userEvent,
  screen,
  testA11Y,
  validateHtml,
} from '../../../testUtils';
import { mockConsoleMethods } from '../../../testUtils/console';
import { i18nCache } from '../../../testUtils/i18n';
import { ENABLED_LANGUAGES, FALLBACK_LANGUAGE } from '../../constants';
import { LanguageSwitch } from '../components/LanguageSwitch';

const setup = () => {
  const { container } = render(<LanguageSwitch />);

  const button = screen.getByRole('button');

  // actually open the menu as other elements are not rendered before
  userEvent.click(button);

  const currentLanguage = ENABLED_LANGUAGES.find(
    (slug) => FALLBACK_LANGUAGE === slug
  )!;

  const otherLanguages = ENABLED_LANGUAGES.filter(
    (slug) => slug !== currentLanguage
  );

  const randomOtherLanguage =
    otherLanguages[Math.floor(Math.random() * otherLanguages.length)];

  return { button, container, currentLanguage, randomOtherLanguage };
};

describe('<LanguageSwitch />', () => {
  const realLocation = window.location;
  let restoreConsole: ReturnType<typeof mockConsoleMethods>['restoreConsole'];

  beforeAll(() => {
    // @ts-expect-error jest does not support location to be spied on
    delete window.location;
    window.location = { ...realLocation, assign: jest.fn() };
    // eslint-disable-next-line prefer-destructuring
    restoreConsole = mockConsoleMethods('error').restoreConsole;
  });

  afterAll(() => {
    window.location = realLocation;
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

  it('includes a request for translation help', async () => {
    const { currentLanguage } = setup();

    const cta = await screen.findByRole('menuitem', {
      name: i18nCache[currentLanguage].i18n!['help-cta'],
    });

    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href');
  });
});
