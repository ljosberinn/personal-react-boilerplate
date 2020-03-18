import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../utils/testUtils';

import ResetPasswordRoute from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<ResetPasswordRoute />', () => {
  it('renders without crashing', () => {
    render(<ResetPasswordRoute />);
  });
});
