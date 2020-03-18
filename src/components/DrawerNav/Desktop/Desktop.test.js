import { fireEvent } from '@testing-library/react';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../../utils/testUtils';

import Desktop from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

const Intercepti18n = ({ tReady, i18n, t, ...rest }) => <Desktop {...rest} />;

const defaultProps = {
  toggleMenu: jest.fn(),
  isExpanded: false,
};

describe('<DrawerNavDesktop />', () => {
  it('should render without crashing', () => {
    render(<Intercepti18n {...defaultProps} />);
  });

  it('should have no tooltip when expanded', () => {
    const { getByTestId } = render(
      <Intercepti18n {...defaultProps} isExpanded={true} />,
    );

    expect(getByTestId('drawer-nav-desktop-toggle').dataset.tooltip).toBe(
      undefined,
    );
  });

  it('should have no tooltip when expanded', () => {
    const { getByTestId } = render(
      <Intercepti18n {...defaultProps} isExpanded={false} />,
    );

    expect(getByTestId('drawer-nav-desktop-toggle').dataset.tooltip).not.toBe(
      undefined,
    );
  });

  it('should toggle the menu onClick', () => {
    const { getByTestId } = render(<Intercepti18n {...defaultProps} />);

    const toggle = getByTestId('drawer-nav-desktop-toggle');

    expect(defaultProps.toggleMenu).toBeCalledTimes(0);

    fireEvent.click(toggle);

    expect(defaultProps.toggleMenu).toHaveBeenCalled();
  });
});
