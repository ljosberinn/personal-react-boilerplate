import { createMemoryHistory } from 'history';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import RedirectToHome from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<RedirectToHome />', () => {
  it('should render without crashing', () => {
    render(<RedirectToHome />);
  });

  it('should redirect to "/"', () => {
    const history = createMemoryHistory({
      initialEntries: ['/some-fake-route'],
    });

    render(<RedirectToHome />, { history });

    expect(history.location.pathname).toBe('/');
    expect(history.action).toBe('REPLACE');
  });
});
