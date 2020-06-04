import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

import { render, fireEvent } from '../../../../../testUtils';
import ThemeSwitchAlt from './ThemeSwitchAlt';

describe('<ThemeSwitchAlt />', () => {
  it('should render without crashing', () => {
    render(<ThemeSwitchAlt />);
  });

  /**
   * Weird test, I know.
   *
   * - continues to work when initial theme is changed outside of the test
   * - continues to work given any prop on the `Box` component
   */
  it('indicates the current theme visually', () => {
    const { getByRole } = render(<ThemeSwitchAlt />);
    const sun = render(<FaSun />);
    const moon = render(<FaMoon />);

    const sunPath = sun.container.querySelector('path')!.outerHTML;
    const moonPath = moon.container.querySelector('path')!.outerHTML;

    const button = getByRole('checkbox');

    const isInitiallyLight =
      button.querySelector('path')!.outerHTML === sunPath;

    fireEvent.click(button);

    const postClickPath = button.querySelector('path')!.outerHTML;

    expect(postClickPath).not.toBe(isInitiallyLight ? sunPath : moonPath);
    expect(postClickPath).toStrictEqual(isInitiallyLight ? moonPath : sunPath);
  });
});
