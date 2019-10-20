import React, { createContext, useContext, useCallback } from 'react';
import { useTheme } from '../hooks';
import Icon from './Icon';
import Switch from './Switch';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from 'rbx';

const ThemeContext = createContext({});

export function Theme({ children }) {
  const { isLoading, setTheme, theme } = useTheme();

  return (
    <ThemeContext.Provider value={{ isLoading, setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

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

const Span = ({ onClick, children }) => (
  <span onClick={onClick}>{children}</span>
);

export default function ThemeSwitch({ footer }) {
  const { isLoading, theme, setTheme } = useContext(ThemeContext);

  const Component = footer ? Span : Navbar.Item;

  const handleThemeChange = useCallback(() => {
    setTheme(theme => (theme === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return (
    <Component>
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
  );
}
