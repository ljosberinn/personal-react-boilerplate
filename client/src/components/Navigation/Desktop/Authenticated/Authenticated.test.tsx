import React from 'react';

import { SETTINGS_ACCOUNT, SETTINGS_SITE } from '../../../../routes';
import { render, waitFor, fireEvent } from '../../../../testUtils';
import Authenticated from './Authenticated';
import { auth0Partial as authProviderProps } from './Authenticated.fixture';

describe('<Authenticated />', () => {
  it('should render without crashing', () => {
    render(<Authenticated />, { authProviderProps });
  });

  it('should render the users image', () => {
    const { container } = render(<Authenticated />, { authProviderProps });

    waitFor(() =>
      expect(container.querySelector('img')?.src).toStrictEqual(
        authProviderProps.user.picture
      )
    );
  });

  it('should render the users name', () => {
    const { getByText } = render(<Authenticated />, { authProviderProps });

    expect(getByText(RegExp(authProviderProps.user.name))).toBeInTheDocument();
  });

  it('should render a menu onClick, containing settings and logout links', () => {
    const { container, getByTestId } = render(<Authenticated />, {
      authProviderProps,
    });

    const button = container.querySelector('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(getByTestId('logout')).toBeInTheDocument();

    expect(
      getByTestId('link-account-settings').getAttribute('href')
    ).toStrictEqual(SETTINGS_ACCOUNT.path.client());

    expect(
      getByTestId('link-site-settings').getAttribute('href')
    ).toStrictEqual(SETTINGS_SITE.path.client());
  });
});
