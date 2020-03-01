import React from 'react';

import render, { defineMatchMedia } from '../../utils/testUtils';
import Desktop from './Desktop';

defineMatchMedia();

const defaultProps = {
  toggleMenu: jest.fn(),
  isExpanded: false,
};

describe('<DrawerNavDesktop />', () => {
  it('should render without crashing', () => {
    render(<Desktop {...defaultProps} />);
  });

  it('should have no tooltip when expanded', () => {
    const { getByTestId } = render(
      <Desktop {...defaultProps} isExpanded={true} />,
    );

    expect(getByTestId('drawer-nav-desktop-toggle').dataset.tooltip).toBe(
      undefined,
    );
  });

  it('should have no tooltip when expanded', () => {
    const { getByTestId } = render(
      <Desktop {...defaultProps} isExpanded={false} />,
    );

    expect(getByTestId('drawer-nav-desktop-toggle').dataset.tooltip).not.toBe(
      undefined,
    );
  });
});
