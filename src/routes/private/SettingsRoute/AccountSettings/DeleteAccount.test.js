import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';
import DeleteAccount from './DeleteAccount';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<DeleteAccount />', () => {
  it('renders without crashing', () => {
    render(<DeleteAccount />);
  });
});
