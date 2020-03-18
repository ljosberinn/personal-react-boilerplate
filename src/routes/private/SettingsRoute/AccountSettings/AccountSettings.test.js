import React from 'react';
import {
  useIdentityContext,
  IdentityContextProvider,
} from 'react-netlify-identity';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../../../../__mocks__/react-netlify-identity';
import { render } from '../../../../utils/testUtils';

import AccountSettings from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  IdentityContextProvider.mockImplementation(mockIdentityContextProvider);

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
