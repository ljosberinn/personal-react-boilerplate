import { createMemoryHistory } from 'history';
import React from 'react';

import { INDEX, DASHBOARD } from '..';
import { render } from '../../testUtils';
import AuthAwareRedirect from './AuthAwareRedirect';

describe('<AuthAwareRedirect />', () => {
  it('should render without crashing', () => {
    render(<AuthAwareRedirect />, {});
  });

  it('should redirect to INDEX if logged out', () => {
    const history = createMemoryHistory({
      initialEntries: ['/some-fake-route'],
    });

    render(<AuthAwareRedirect />, {
      history,
    });

    expect(history.location.pathname).toBe(INDEX.path.router);
    expect(history.action).toBe('REPLACE');
  });

  it('should redirect to DASHBOARD if logged out', () => {
    const history = createMemoryHistory({
      initialEntries: ['/some-fake-route'],
    });

    render(<AuthAwareRedirect />, {
      history,
      authProviderProps: { isAuthenticated: true },
    });

    expect(history.location.pathname).toBe(DASHBOARD.path.router);
    expect(history.action).toBe('REPLACE');
  });
});
