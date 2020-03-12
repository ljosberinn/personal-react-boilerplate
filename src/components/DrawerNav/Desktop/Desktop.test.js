import { fireEvent } from '@testing-library/react';
import React from 'react';

import render from '../../../utils/testUtils';

import Desktop from '.';

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

  it('should toggle the menu onClick', () => {
    const { getByTestId } = render(<Desktop {...defaultProps} />);

    const toggle = getByTestId('drawer-nav-desktop-toggle');

    expect(defaultProps.toggleMenu).toBeCalledTimes(0);

    fireEvent.click(toggle);

    expect(defaultProps.toggleMenu).toHaveBeenCalled();
  });
});
