import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';
import ChangeLanguage from './ChangeLanguage';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<ChangeLanguage />', () => {
  it('renders without crashing', () => {
    render(<ChangeLanguage />);
  });
});
