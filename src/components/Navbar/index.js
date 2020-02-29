import { Navbar as RBXNavbar } from 'rbx';
import React, { memo, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import { useIdentityContext } from 'react-netlify-identity';
import { Link } from 'react-router-dom';

import { ReactComponent as LogoIpsumSvg } from '../../assets/svg/logoIpsum.svg';
import { REPO_LINK, DISCORD_LINK } from '../../constants/env';
import { withSuspense } from '../../hocs';
import Icon from '../Icon';
import LanguageSwitch from '../LanguageSwitch';
import ThemeSwitch from '../ThemeSwitch';
import styles from './Navbar.module.scss';

const AuthenticatedNavButtons = lazy(() =>
  import(
    /* webpackChunkName: "navbar.authenticated_nav_buttons" */ './AuthenticatedNavButtons'
  ),
);

const UnauthenticatedNavButtons = lazy(() =>
  import(
    /* webpackChunkName: "navbar.unauthenticated_nav_buttons" */ './UnauthenticatedNavButtons'
  ),
);

export default memo(
  withSuspense(function Navbar() {
    const { isLoggedIn, isConfirmedUser } = useIdentityContext();
    const { t } = useTranslation(['navigation', 'routes']);

    const authAwareButtons = !isLoggedIn ? (
      <UnauthenticatedNavButtons />
    ) : isConfirmedUser ? (
      <AuthenticatedNavButtons />
    ) : null;

    return (
      <header>
        <RBXNavbar
          aria-label="secondary navigation"
          role={undefined}
          className={styles.navbar}
        >
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

              {authAwareButtons}
            </RBXNavbar.Segment>
          </RBXNavbar.Menu>
        </RBXNavbar>
      </header>
    );
  }),
);
