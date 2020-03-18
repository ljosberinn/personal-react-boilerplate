import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Navbar from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({ isLoggedIn: false });
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Navbar {...rest} />;

describe('<Navbar />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });
});
