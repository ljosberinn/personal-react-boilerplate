import React, { useContext } from 'react';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from 'rbx';
import { ThemeContext } from '../context/ThemeContext';
import Switch from './Switch';
import Loader from './Loader';
import Icon from './Icon';
import styles from './ThemeSwitch.module.scss';

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

const Span = ({ children, ...rest }) => <span {...rest}>{children}</span>;

const ParentComponentMap = {
  settings: Span,
  footer: Span,
  nav: Navbar.Item,
};

export default function ThemeSwitch({ from }) {
  const { isLoading, theme, toggleTheme } = useContext(ThemeContext);

  const Component = ParentComponentMap[from];
  const id = `theme-switch-${from}`;

  return (
    <>
      {isLoading && <Loader isFullPage color={theme} />}

      <Component
        className={from !== 'nav' ? styles.clickableContainer : undefined}
        role="button"
        onClick={toggleTheme}
        title="Toggle color theme"
        id={id}
      >
        <Icon icon={faSun} color={iconClassMap.sun[theme]} />
        <Switch
          disabled={isLoading}
          checked={theme !== 'light'}
          size="small"
          rounded
          onChange={toggleTheme}
          aria-labelledby={id}
        />
        <Icon icon={faMoon} color={iconClassMap.moon[theme]} />
      </Component>
    </>
  );
}
