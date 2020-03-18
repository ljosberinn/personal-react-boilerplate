import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../utils/testUtils';

import Routes from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({ isLoggedIn: false });
});

describe('<Routes />', () => {
  it('should render without crashing', () => {
    render(<Routes />);
  });
});
