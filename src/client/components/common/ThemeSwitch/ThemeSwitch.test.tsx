import React from 'react';

import { render, fireEvent, screen } from '../../../../../testUtils';
import ThemeSwitch from './ThemeSwitch';

describe('<ThemeSwitch />', () => {
  it('should render without crashing', () => {
    render(<ThemeSwitch />);
  });

  it('indicates the current theme visually', () => {
    render(<ThemeSwitch />);

    const input = screen.getByRole('checkbox');
    const sun = screen.getByTestId('theme-switch-sun');
    const moon = screen.getByTestId('theme-switch-moon');

    const sunClassListBefore = sun.classList.toString();
    const moonClassListBefore = moon.classList.toString();

    fireEvent.click(input);

    expect(sun.classList.toString()).not.toBe(sunClassListBefore);
    expect(moon.classList.toString()).not.toBe(moonClassListBefore);
  });

  ['sun', 'moon'].forEach(icon => {
    it(`allows changing the theme by clicking an icon alternatively - icon ${icon}`, () => {
      render(<ThemeSwitch />);

      const sun = screen.getByTestId('theme-switch-sun');
      const moon = screen.getByTestId('theme-switch-moon');

      const sunClassListBefore = sun.classList.toString();
      const moonClassListBefore = moon.classList.toString();

      fireEvent.click(icon === 'sun' ? sun : moon);

      expect(sun.classList.toString()).not.toBe(sunClassListBefore);
      expect(moon.classList.toString()).not.toBe(moonClassListBefore);
    });
  });
});
