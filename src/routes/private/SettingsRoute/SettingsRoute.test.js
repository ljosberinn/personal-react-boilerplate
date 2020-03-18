import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../utils/testUtils';

import SettingsRoute from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<SettingsRoute />', () => {
  it('renders without crashing', () => {
    render(<SettingsRoute />);
  });
});
