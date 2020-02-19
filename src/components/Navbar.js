import classnames from 'classnames';
import { Navbar as RBXNavbar, Button } from 'rbx';
import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSignOutAlt, FaGithub, FaDiscord } from 'react-icons/fa';
import { useIdentityContext } from 'react-netlify-identity';
import { NavLink, Link, useLocation } from 'react-router-dom';

import { ReactComponent as LogoIpsumSvg } from '../assets/svg/logoIpsum.svg';
import { REPO_LINK, DISCORD_LINK } from '../constants/env';
import { REGISTER, LOGIN, SETTINGS } from '../constants/routes';
import { withSuspense } from '../hocs';
import { useNavigate } from '../hooks';
import Icon from './Icon';
import LanguageSwitch from './LanguageSwitch';
import Loader from './Loader';
import ThemeSwitch from './ThemeSwitch';

export default memo(
  withSuspense(function Navbar() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { isLoggedIn, logoutUser, isConfirmedUser } = useIdentityContext();
    const navigate = useNavigate();
    const { t } = useTranslation(['navigation', 'routes']);

    const handleLogout = async () => {
      navigate('/');

      setIsLoggingOut(true);
      await logoutUser();
      setIsLoggingOut(false);
    };

    return (
      <header>
        <RBXNavbar aria-label="secondary navigation" role={undefined}>
          <RBXNavbar.Brand>
            <RBXNavbar.Item as={Link} to="/">
              <LogoIpsumSvg />
            </RBXNavbar.Item>
            <RBXNavbar.Burger />
          </RBXNavbar.Brand>
          <RBXNavbar.Menu>
            <RBXNavbar.Segment align="end">
              <LanguageSwitch from="nav" />

              <ThemeSwitch from="nav" />

              {DISCORD_LINK && (
                <RBXNavbar.Item
                  href={DISCORD_LINK}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon svg={FaDiscord} /> <span>Discord</span>
                </RBXNavbar.Item>
              )}

              {REPO_LINK && (
                <RBXNavbar.Item
                  href={REPO_LINK}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  <Icon svg={FaGithub} /> <span>{t('contribute')}</span>
                </RBXNavbar.Item>
              )}

              {!isConfirmedUser || !isLoggedIn ? (
                <Button.Group>
                  <NavButton color="primary" to={REGISTER.clientPath}>
                    <Icon svg={REGISTER.icon} />
                    <span>{t('routes:register')}</span>
                  </NavButton>

                  <NavButton color="light" to={LOGIN.clientPath}>
                    <Icon svg={LOGIN.icon} />
                    <span>{t('routes:login')}</span>
                  </NavButton>
                </Button.Group>
              ) : (
                <AuthenticatedNavButtons
                  isLoggingOut={isLoggingOut}
                  isConfirmedUser={isConfirmedUser}
                  handleLogout={handleLogout}
                  t={t}
                />
              )}
            </RBXNavbar.Segment>
          </RBXNavbar.Menu>
        </RBXNavbar>
        {isLoggingOut && <Loader isFullPage />}
      </header>
    );
  }),
);

/**
 *
 * @param {{
 * children: JSX.Element
 * }}
 */
function NavButton({ children, ...rest }) {
  return (
    <Button as={NavLink} {...rest}>
      {children}
    </Button>
  );
}

/**
 *
 * @param {{
 * isLoggingOut: boolean,
 * isConfirmedUser: boolean,
 * handleLogout: () => Promise<void>,
 * t: import('react-i18next').UseTranslationResponse['t']
 * }}
 */
function AuthenticatedNavButtons({
  isLoggingOut,
  isConfirmedUser,
  handleLogout,
  t,
}) {
  const { pathname } = useLocation();

  if (!isConfirmedUser) {
    return null;
  }

  return (
    <Button.Group>
      <NavButton
        color="primary"
        to={SETTINGS.clientPath}
        disabled={isLoggingOut}
      >
        <Icon
          svg={SETTINGS.icon}
          className={classnames(
            'is-spinning',
            pathname.includes('/settings/') && 'active',
          )}
        />
        <span>{t('routes:settings')}</span>
      </NavButton>

      <Button color="danger" onClick={handleLogout} disabled={isLoggingOut}>
        <Icon svg={FaSignOutAlt} />
        <span>{t('logout')}</span>
      </Button>
    </Button.Group>
  );
}
