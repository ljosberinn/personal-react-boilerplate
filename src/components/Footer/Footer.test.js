import React from 'react';

import render from '../../utils/testUtils';

import Footer from '.';

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Footer {...rest} />;

describe('<Footer />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n />);
  });
});
