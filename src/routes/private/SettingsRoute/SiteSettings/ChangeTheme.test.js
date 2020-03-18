import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';
import ChangeTheme from './ChangeTheme';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<ChangeTheme />', () => {
  it('renders without crashing', () => {
    render(<ChangeTheme />);
  });
});
