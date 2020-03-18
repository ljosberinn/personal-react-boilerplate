import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../../utils/testUtils';

import SiteSettings from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<SiteSettings />', () => {
  it('renders without crashing', () => {
    render(<SiteSettings />);
  });
});
