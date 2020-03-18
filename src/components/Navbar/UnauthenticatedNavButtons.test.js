import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';
import UnauthenticatedNavButtons from './UnauthenticatedNavButtons';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({
    isLoggedIn: false,
  });
});

describe('<UnauthenticatedNavButtons />', () => {
  it('renders without crashing', () => {
    render(<UnauthenticatedNavButtons />);
  });
});
