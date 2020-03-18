import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import { render } from '../../utils/testUtils';

import Layout from '.';

jest.mock('react-netlify-identity');

beforeEach(() => {
  useIdentityContext.mockReturnValue({});
});

describe('<Layout />', () => {
  it('should render without crashing', () => {
    render(<Layout />);
  });

  it('should render the core content in a main tag', () => {
    const { getByTestId } = render(<Layout />);

    const main = getByTestId('layout-main');

    expect(main.tagName).toBe('MAIN');
  });

  it('should render children within a column', () => {
    const { getByTestId } = render(<Layout />);

    expect(
      getByTestId('layout-main-children').classList.contains('column'),
    ).toBe(true);
  });

  it('should have a specific set of classes', () => {
    const { getByTestId } = render(<Layout />);

    const main = getByTestId('layout-main').classList;

    ['is-marginless', 'columns', 'is-gapless'].forEach(className => {
      expect(main.contains(className)).toBe(true);
    });
  });

  it('should render <Navbar />', () => {
    const { getByTestId } = render(<Layout />);

    expect(getByTestId('navbar')).toBeInTheDocument();
  });

  it('should render <DrawerNav />', () => {
    const { getByTestId } = render(<Layout />);

    expect(getByTestId('drawer-nav')).toBeInTheDocument();
  });

  it('should render <Footer />', () => {
    const { getByTestId } = render(<Layout />);

    expect(getByTestId('footer')).toBeInTheDocument();
  });
});
