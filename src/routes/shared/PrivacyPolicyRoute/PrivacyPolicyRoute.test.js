import React from 'react';
import {
  useIdentityContext,
  IdentityContextProvider,
} from 'react-netlify-identity';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../../../__mocks__/react-netlify-identity';
import { render } from '../../../utils/testUtils';

import PrivacyPolicyRoute from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  jest.clearAllMocks();

  IdentityContextProvider.mockImplementationOnce(mockIdentityContextProvider);

  useIdentityContext.mockReturnValue({});
});

describe('<PrivacyPolicyRoute />', () => {
  it('should render without crashing', () => {
    render(<PrivacyPolicyRoute />);
  });
});
