import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';
import AuthenticatedNavButtons from './AuthenticatedNavButtons';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<AuthenticatedNavButtons />', () => {
  it('renders without crashing', () => {
    render(<AuthenticatedNavButtons />);
  });
});
