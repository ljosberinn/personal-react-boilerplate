import React from 'react';
import {
  useIdentityContext,
  IdentityContextProvider,
} from 'react-netlify-identity';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../../__mocks__/react-netlify-identity';
import { render } from '../../utils/testUtils';

import DrawerNav from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  IdentityContextProvider.mockImplementation(mockIdentityContextProvider);

  useIdentityContext.mockReturnValue({});
});
const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <DrawerNav {...rest} />;

describe('<DrawerNav />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });
});
