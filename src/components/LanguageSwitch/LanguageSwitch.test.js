import i18n from 'i18next';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { ENABLED_LANGUAGES } from '../../constants/env';
import { render, fireEvent, waitFor } from '../../utils/testUtils';

import LanguageSwitch, { validOrigins } from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const activeClass = 'is-active';

describe('<LanguageSwitch />', () => {
  validOrigins.forEach(origin => {
    it(`should render without crashing - origin ${origin}`, () => {
      render(<LanguageSwitch from={origin} />);
    });

    if (ENABLED_LANGUAGES.length > 1) {
      it(`should always change the language on click regardless of origin - ${origin}`, async () => {
        const { getByTestId } = render(<LanguageSwitch from={origin} />);

        const currentLanguage = ENABLED_LANGUAGES.find(slug =>
          i18n.language.includes(slug),
        );

        const otherLanguages = ENABLED_LANGUAGES.filter(
          slug => slug !== currentLanguage,
        );

        const randomOtherLanguage =
          otherLanguages[Math.floor(Math.random() * otherLanguages.length)];

        const currentLanguageElement = getByTestId(
          `lang-switch-${currentLanguage}`,
        );

        expect(currentLanguageElement.classList.contains(activeClass)).toBe(
          true,
        );

        const otherLanguageElement = getByTestId(
          `lang-switch-${randomOtherLanguage}`,
        );

        expect(otherLanguageElement).toBeInTheDocument();
        expect(otherLanguageElement.classList.contains(activeClass)).toBe(
          false,
        );

        fireEvent.click(otherLanguageElement);

        // changing language is async
        await waitFor(() => i18n.language.includes(randomOtherLanguage), {
          interval: 25,
        });

        expect(currentLanguageElement.classList.contains(activeClass)).toBe(
          false,
        );
        expect(otherLanguageElement.classList.contains(activeClass)).toBe(true);
      });
    }
  });
});
