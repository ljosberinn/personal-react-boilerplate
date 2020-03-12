import { createMemoryHistory } from 'history';
import React from 'react';

import render from '../utils/testUtils';
import RedirectToHome from './RedirectToHome';

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
