import React from 'react';

import { render } from '../../utils/testUtils';

import Navbar from '.';

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Navbar {...rest} />;

describe('<Navbar />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });
});
