import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';

import AccountSettings from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({
    updateUser: jest.fn(),
    user: {
      app_metadata: {
        provider: 'email',
      },
    },
  });
});

describe('<AccountSettings />', () => {
  it('renders without crashing', () => {
    render(<AccountSettings />);
  });
});
