import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Footer from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Footer {...rest} />;

describe('<Footer />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });
});
