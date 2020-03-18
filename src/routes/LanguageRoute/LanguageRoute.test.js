import { createMemoryHistory } from 'history';
import i18n from 'i18next';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { ENABLED_LANGUAGES } from '../../constants/env';
import { render } from '../../utils/testUtils';

import LanguageRoute from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({
    isLoggedIn: false,
  });
});

describe('<LanguageRoute />', () => {
  it('should render without crashing && do nothing on "/"', () => {
    render(<LanguageRoute />);
  });

  ENABLED_LANGUAGES.forEach(language => {
    const history = createMemoryHistory({
      initialEntries: [`/${language}`],
    });

    it(`should render without crashing on a matching route (${language}) and change the language`, () => {
      expect(i18n.language).not.toBe(language);
      render(<LanguageRoute />, { history });
      expect(i18n.language).toBe(language);
    });
  });
});
