import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';
import SuccessfulPasswordChange from './SuccessfulPasswordChange';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<SuccessfulPasswordChange />', () => {
  it('renders without crashing', () => {
    render(<SuccessfulPasswordChange />);
  });
});
