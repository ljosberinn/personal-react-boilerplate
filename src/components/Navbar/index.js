import classnames from 'classnames';
import { Navbar as RBXNavbar } from 'rbx';
import React, { memo, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ReactComponent as LogoIpsumSvg } from '../../assets/svg/logoIpsum.svg';
import { BRAND_NAME } from '../../constants/env';
import withSuspense from '../../hocs/withSuspense';
import {
  useLocationBasedVisibility,
  useBreakpointBasedVisibility,
} from '../../hooks';
import styles from './Navbar.module.scss';

const Menu = withSuspense(
  lazy(() => import(/* webpackChunkName: "navbar.menu" */ './Menu')),
);

export default memo(
  withSuspense(function Navbar(props) {
    const { t } = useTranslation('navigation');

    const [shouldBeVisibleByDefault] = useBreakpointBasedVisibility(
      '(min-width: 1024px)',
    );
    const [menuActive, toggleMenu] = useLocationBasedVisibility(
      shouldBeVisibleByDefault,
    );

    return (
      <header {...props}>
        <RBXNavbar
          aria-label="secondary navigation"
          role={undefined}
          className={styles.navbar}
        >
          <RBXNavbar.Brand>
            <RBXNavbar.Item as={Link} to="/">
              <LogoIpsumSvg aria-label={BRAND_NAME} />
            </RBXNavbar.Item>
            <div
              className={classnames('navbar-burger', menuActive && 'is-active')}
              role="button"
              aria-label={t('toggleNavigation')}
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </div>
          </RBXNavbar.Brand>
          {(shouldBeVisibleByDefault || menuActive) && <Menu />}
        </RBXNavbar>
      </header>
    );
  }),
);
