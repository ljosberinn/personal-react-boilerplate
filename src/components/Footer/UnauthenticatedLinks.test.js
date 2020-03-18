import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';
import UnauthenticatedLinks from './UnauthenticatedLinks';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<UnauthenticatedLinks />', () => {
  it('renders without crashing', () => {
    render(<UnauthenticatedLinks />);
  });
});
