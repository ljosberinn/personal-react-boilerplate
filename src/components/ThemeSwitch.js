import React, { useContext, useCallback } from 'react';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from 'rbx';
import { ThemeContext } from '../context/ThemeContext';
import Switch from './Switch';
import Loader from './Loader';
import Icon from './Icon';
import styles from './ThemeSwitch.module.scss';
import { THEME_NAMES } from '../hooks/useDetectColorScheme';

const iconClassMap = {
  sun: {
    light: 'primary',
    dark: 'white',
  },
  moon: {
    light: 'dark',
    dark: 'primary',
  },
};

const Span = ({ children, onClick, className }) => (
  <span onClick={onClick} className={className}>
    {children}
  </span>
);

export default function ThemeSwitch({ footer }) {
  const { isLoading, theme, setTheme } = useContext(ThemeContext);

  const Component = footer ? Span : Navbar.Item;

  const handleThemeChange = useCallback(() => {
    setTheme(theme =>
      theme === THEME_NAMES.DARK ? THEME_NAMES.LIGHT : THEME_NAMES.DARK,
    );
  }, [setTheme]);

  return (
    <>
      {isLoading && <Loader isFullPage color={theme} />}
      <Component
        className={footer ? styles.clickableContainer : undefined}
        onClick={handleThemeChange}
        role="button"
        aria-label="Toggle color theme"
      >
        <Icon icon={faSun} color={iconClassMap.sun[theme]} />
        <Switch
          disabled={isLoading}
          checked={theme !== 'light'}
          size="small"
          rounded
          onChange={handleThemeChange}
        />
        <Icon icon={faMoon} color={iconClassMap.moon[theme]} />
      </Component>
    </>
  );
}
