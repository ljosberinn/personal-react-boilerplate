import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import LoginProviderGroup from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});
describe('<LoginProviderGroup />', () => {
  it('should render without crashing', () => {
    render(<LoginProviderGroup />);
  });
});
