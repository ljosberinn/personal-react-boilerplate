import React from 'react';
import render from '../utils/testUtils';
import { default as Component } from './ThemeSwitch';
import { withTranslation } from 'react-i18next';
import { act, fireEvent } from '@testing-library/react';

const ThemeSwitch = withTranslation()(props => <Component {...props} />);

describe('<LanguageSwitch />', () => {
  test('it renders successfully', () => {
    render(<ThemeSwitch from="footer" />);
  });

  test('it changes the theme onclick', () => {
    const { getByTestId } = render(<ThemeSwitch from="footer" />);

    const button = getByTestId('toggle-theme');
    const switchElement = getByTestId('theme-switch');

    expect(switchElement.checked).toBeFalsy();

    act(() => {
      fireEvent.click(button);
    });

    expect(switchElement.checked).toBeTruthy();
  });
});
