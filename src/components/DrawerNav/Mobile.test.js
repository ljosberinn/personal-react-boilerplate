import React from 'react';

import render, { defineMatchMedia } from '../../utils/testUtils';
import Mobile from './Mobile';

defineMatchMedia();

const defaultProps = {
  toggleMenu: jest.fn(),
};

describe('<DrawerNavMobile />', () => {
  it('should render a modal when isExpanded is false', () => {
    const { queryByTestId } = render(
      <Mobile {...defaultProps} isExpanded={false} />,
    );

    expect(queryByTestId('drawer-nav-mobile-modal')).toBeNull();
  });

  it('should render a modal when isExpanded is true', () => {
    const { getByTestId } = render(
      <Mobile {...defaultProps} isExpanded={true} />,
    );

    expect(getByTestId('drawer-nav-mobile-modal')).toBeInTheDocument();
  });
});
