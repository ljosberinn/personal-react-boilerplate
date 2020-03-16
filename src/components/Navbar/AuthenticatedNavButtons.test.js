import React from 'react';

import render from '../../utils/testUtils';
import AuthenticatedNavButtons from './AuthenticatedNavButtons';

describe('<AuthenticatedNavButtons />', () => {
  it('renders without crashing', () => {
    render(<AuthenticatedNavButtons />);
  });
});
