import * as React from 'react';

import { render, fireEvent } from '../../testUtils';
import ThemeSwitch from './ThemeSwitch';

describe('<ThemeSwitch />', () => {
  it('should render without crashing', () => {
    render(<ThemeSwitch />);
  });

  it('it indicates the current theme visually', () => {
    const { getByTestId } = render(<ThemeSwitch />);

    const input = getByTestId('theme-switch').querySelector('input')!;
    const sun = getByTestId('theme-switch-sun');
    const moon = getByTestId('theme-switch-moon');

    const sunClassListBefore = sun.classList.toString();
    const moonClassListBefore = moon.classList.toString();

    fireEvent.click(input);

    expect(sun.classList.toString()).not.toBe(sunClassListBefore);
    expect(moon.classList.toString()).not.toBe(moonClassListBefore);
  });

  ['sun', 'moon'].forEach(icon => {
    it(`allows changing the theme by clicking an icon alternatively - icon ${icon}`, () => {
      const { getByTestId } = render(<ThemeSwitch />);

      const sun = getByTestId('theme-switch-sun');
      const moon = getByTestId('theme-switch-moon');

      const sunClassListBefore = sun.classList.toString();
      const moonClassListBefore = moon.classList.toString();

      fireEvent.click(icon === 'sun' ? sun : moon);

      expect(sun.classList.toString()).not.toBe(sunClassListBefore);
      expect(moon.classList.toString()).not.toBe(moonClassListBefore);
    });
  });
});
