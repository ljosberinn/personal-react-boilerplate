import React from 'react';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Button } from 'rbx';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { useTheme } from '../hooks';
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

export const validOrigins = ['settings', 'nav', 'footer'];

/**
 *
 * @param {{
 *  from: 'settings' | 'nav' | 'footer'
 * }}
 */
export default function ThemeSwitch({ from }) {
  const { isLoading, theme, toggleTheme } = useTheme();
  const { t } = useTranslation('settings');

  if (!validOrigins.includes(from)) {
    console.error(`unimplemented from-case for ThemeSwitch: ${from}`);
    return null;
  }

  const id = `theme-switch-${from}`;

  return (
    <>
      {isLoading && <Loader isFullPage color={theme} />}

      <Wrap
        from={from}
        className={from !== 'nav' ? styles.clickableContainer : undefined}
        role="button"
        onClick={toggleTheme}
        title={t('changeTheme')}
        id={id}
        data-testid="toggle-theme"
      >
        <Icon icon={faSun} color={iconClassMap.sun[theme]} data-testid="sun" />
        <Switch
          disabled={isLoading}
          checked={theme !== 'light'}
          size="small"
          rounded
          onChange={toggleTheme}
          aria-labelledby={id}
          data-testid="theme-switch"
        />
        <Icon
          icon={faMoon}
          color={iconClassMap.moon[theme]}
          data-testid="moon"
        />
      </Wrap>
    </>
  );
}

/**
 *
 * @param {{
 *  from: 'settings' | 'nav' | 'footer'
 *  children: React.ReactChildren
 * }}
 */
const Wrap = ({ from, children, className, ...rest }) =>
  from === 'nav' ? (
    <Navbar.Item className={className} {...rest}>
      {children}
    </Navbar.Item>
  ) : from === 'settings' ? (
    <Button type="button" className={className} {...rest}>
      {children}
    </Button>
  ) : (
    <span className={classnames(className, 'is-flex')} {...rest}>
      {children}
    </span>
  );
