import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';
import Menu from './Menu';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({ isLoggedIn: false });
});

describe('<Menu />', () => {
  it('renders without crashing', () => {
    render(<Menu />);
  });
});
