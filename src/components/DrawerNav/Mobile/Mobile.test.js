import React from 'react';

import render from '../../../utils/testUtils';

import Mobile from '.';

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Mobile {...rest} />;

const defaultProps = {
  toggleMenu: jest.fn(),
};

describe('<DrawerNavMobile />', () => {
  it('should render a modal when isExpanded is false', () => {
    const { queryByTestId } = render(
      <Intercepti18n {...defaultProps} isExpanded={false} />,
    );

    expect(queryByTestId('drawer-nav-mobile-modal')).toBeNull();
  });

  it('should render a modal when isExpanded is true', () => {
    const { getByTestId } = render(
      <Intercepti18n {...defaultProps} isExpanded={true} />,
    );

    expect(getByTestId('drawer-nav-mobile-modal')).toBeInTheDocument();
  });
});
