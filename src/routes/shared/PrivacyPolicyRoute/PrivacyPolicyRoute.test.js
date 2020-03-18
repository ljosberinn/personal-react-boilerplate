import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../utils/testUtils';

import PrivacyPolicyRoute from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<PrivacyPolicyRoute />', () => {
  it('should render without crashing', () => {
    render(<PrivacyPolicyRoute />);
  });
});
