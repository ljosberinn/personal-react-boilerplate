import React from 'react';
import { FaHome } from 'react-icons/fa';
import {
  useIdentityContext,
  IdentityContextProvider,
} from 'react-netlify-identity';

import { IdentityContextProvider as mockIdentityContextProvider } from '../../../../__mocks__/react-netlify-identity';
import { render } from '../../../utils/testUtils';

import NavigationLink from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  IdentityContextProvider.mockImplementation(mockIdentityContextProvider);

  useIdentityContext.mockReturnValue({});
});
const defaultProps = {
  to: '/settings',
  svg: FaHome,
  isExpanded: false,
};

const tooltipSelector = '[data-tooltip]';

describe('<NavigationLink />', () => {
  it('should render without crashing', () => {
    render(<NavigationLink {...defaultProps}>to settings</NavigationLink>);
  });

  it('should have children text in tooltip if not expanded', () => {
    const { container } = render(
      <NavigationLink {...defaultProps}>to settings</NavigationLink>,
    );

    expect(container.querySelector(tooltipSelector).dataset.tooltip).toBe(
      'to settings',
    );
  });

  it('should have tooltips positioned right', () => {
    const { container } = render(
      <NavigationLink {...defaultProps}>to settings</NavigationLink>,
    );

    expect(
      container
        .querySelector(tooltipSelector)
        .classList.contains('is-tooltip-right'),
    ).toBe(true);
  });

  it('should have no tooltip if expanded', () => {
    const { container } = render(
      <NavigationLink {...defaultProps} isExpanded={true}>
        to settings
      </NavigationLink>,
    );

    expect(container.querySelector(tooltipSelector)).toBe(null);
  });
});
