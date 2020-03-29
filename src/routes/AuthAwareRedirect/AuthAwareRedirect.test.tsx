import { createMemoryHistory } from 'history';
import React from 'react';

import { INDEX, DASHBOARD } from '..';
import { render } from '../../testUtils';
import AuthAwareRedirect from './AuthAwareRedirect';

describe('<AuthAwareRedirect />', () => {
  it('should render without crashing', () => {
    render(<AuthAwareRedirect />);
  });

  it('should redirect to the appropriate route', () => {
    const history = createMemoryHistory({
      initialEntries: ['/some-fake-route'],
    });

    render(<AuthAwareRedirect />, { history });

    expect(history.location.pathname).toBe(INDEX.path.router);
    expect(history.action).toBe('REPLACE');
  });
});
