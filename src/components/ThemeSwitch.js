import React, { useContext } from 'react';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Button } from 'rbx';
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

/**
 *
 * @param {{
 *  from: 'settings' | 'nav' | 'footer'
 *  children: React.Children
 * }}
 */
const Wrap = ({ from, children, ...rest }) =>
  from === 'nav' ? (
    <Navbar.Item {...rest}>{children}</Navbar.Item>
  ) : from === 'settings' ? (
    <Button type="button" {...rest}>
      {children}
    </Button>
  ) : (
    <span {...rest}>{children}</span>
  );

export default function ThemeSwitch({ from }) {
  const { isLoading, theme, toggleTheme } = useContext(ThemeContext);

  const id = `theme-switch-${from}`;

  return (
    <>
      {isLoading && <Loader isFullPage color={theme} />}

      <Wrap
        from={from}
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
      </Wrap>
    </>
  );
}
