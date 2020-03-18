import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import DrawerNav from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <DrawerNav {...rest} />;

describe('<DrawerNav />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });
});
