import React from 'react';
import render from '../utils/testUtils';
import ThemeSwitch from './ThemeSwitch';
import { fireEvent } from '@testing-library/react';

describe('<LanguageSwitch />', () => {
  test('it renders successfully', () => {
    render(<ThemeSwitch from="footer" />);
  });

  test('it changes the theme onclick', () => {
    const { getByTestId } = render(<ThemeSwitch from="footer" />);

    const button = getByTestId('toggle-theme');
    const switchElement = getByTestId('theme-switch');

    expect(switchElement.checked).toBeFalsy();

    fireEvent.click(button);

    expect(switchElement.checked).toBeTruthy();
  });
});
