import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';
import AuthenticatedLinks from './AuthenticatedLinks';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<AuthenticatedLinks />', () => {
  it('renders without crashing', () => {
    render(<AuthenticatedLinks />);
  });
});
