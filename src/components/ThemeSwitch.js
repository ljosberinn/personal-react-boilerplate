import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks';
import { Icon, Switch } from '.';
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

const Span = ({ children }) => <span>{children}</span>;

export default function ThemeSwitch({ footer }) {
  const { isLoading, theme, setTheme } = useContext(ThemeContext);

  const Component = footer ? Span : Navbar.Item;

  const isLightTheme = theme === 'light';

  return (
    <Component>
      <Icon icon={faSun} color={iconClassMap.sun[theme]} />
      <Switch
        disabled={isLoading}
        size="small"
        rounded
        checked={!isLightTheme}
        onChange={() => setTheme(isLightTheme ? 'dark' : 'light')}
      />
      <Icon icon={faMoon} color={iconClassMap.moon[theme]} />
    </Component>
  );
}
