import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import { Column, Menu, Tag, Box, Modal } from 'rbx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { hasLocalStorage } from '../constants/browserAPIs';
import * as ROUTES from '../constants/routes';
import { useMediaQuery } from '../hooks';

import styles from './DrawerNav.module.scss';
import Icon from './Icon';

const localStorageMeta = {
  key: 'drawerNavState',
  open: 'open',
  closed: 'closed',
};

/**
 *
 * @param {boolean} isDesktop
 */
const getExpansionFromLocalStorage = isDesktop => {
  if (hasLocalStorage) {
    try {
      const storedState = localStorage.getItem(localStorageMeta.key);

      return storedState ? storedState === localStorageMeta.open : true;
    } catch (error) {
      return true;
    }
  }

  return isDesktop;
};

/**
 *
 * @param {boolean} isExpanded
 */
const persistExpansionToLocalStorage = isExpanded => {
  if (hasLocalStorage) {
    localStorage.setItem(
      localStorageMeta.key,
      isExpanded ? localStorageMeta.open : localStorageMeta.closed,
    );
  }
};

/**
 *
 * @param {{
 * isLoggedIn: boolean;
 * }}
 */
export default function DrawerNav({ isLoggedIn }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isExpanded, setIsExpanded] = useState(
    getExpansionFromLocalStorage(isDesktop),
  );
  const { t } = useTranslation('navigation');

  function toggleMenu() {
    setIsExpanded(!isExpanded);
    persistExpansionToLocalStorage(!isExpanded);
  }

  const routeListProps = {
    t,
    isLoggedIn,
    toggleMenu,
    isExpanded,
  };

  if (!isDesktop) {
    return (
      <>
        <Tag
          color="info"
          rounded
          onClick={toggleMenu}
          className={styles.absoluteButton}
          role="button"
        >
          <div class={classnames('navbar-burger', isExpanded && 'is-active')}>
            <span />
            <span />
            <span />
          </div>
        </Tag>
        <Modal active={isExpanded} closeOnBlur closeOnEsc>
          <Modal.Background onClick={toggleMenu} />
          <Modal.Content>
            <Box className={styles.mobileBox}>
              <nav aria-label="primary navigation">
                <RouteList {...routeListProps} />
              </nav>
            </Box>
          </Modal.Content>
        </Modal>
      </>
    );
  }

  return (
    <Column size={isExpanded ? 2 : 1} className={styles.transitionAll}>
      <Box as={Menu} className={styles.box}>
        <nav aria-label="primary navigation">
          <RouteList {...routeListProps} />
          <Menu.List className={styles.fixedBottom}>
            <Menu.List.Item
              onClick={toggleMenu}
              tooltip={isExpanded ? undefined : 'toggle menu'}
              tooltipPosition="right"
            >
              <Icon
                icon={faAngleDoubleDown}
                className={
                  isExpanded ? styles.transform90 : styles.transform270
                }
              />
              <span>toggle menu</span>
            </Menu.List.Item>
          </Menu.List>
        </nav>
      </Box>
    </Column>
  );
}

/**
 *
 * @param {{
 * isExpanded: boolean;
 * t: import('i18next').TFunction;
 * isLoggedIn: boolean;
 * onClick?: () => void;
 * }}
 */
function RouteList({ isExpanded, t, isLoggedIn, onClick }) {
  return (
    <Menu.List>
      {Object.values(ROUTES)
        .filter(({ visibleInDrawerNav, isPublic }) => {
          if (visibleInDrawerNav) {
            return isPublic ? true : !isPublic && isLoggedIn;
          }

          return false;
        })
        .map(({ title, clientPath, icon }) => (
          <NavigationLink
            path={clientPath}
            icon={icon}
            key={clientPath}
            isExpanded={isExpanded}
            onClick={onClick}
          >
            {t(title)}
          </NavigationLink>
        ))}
    </Menu.List>
  );
}

/**
 *
 * @param {string} path
 */
const matchPath = path =>
  window.location.pathname.includes(path.substr(1).split('/')[0]);

/**
 *
 * @param {{
 * path: string;
 * icon: import('@fortawesome/free-brands-svg-icons').IconDefinition;
 * children: JSX.Element;
 * isExpanded: boolean;
 * onClick?: () => void;
 * }}
 */
function NavigationLink({ path, icon, children, isExpanded, onClick }) {
  return (
    <Menu.List.Item
      as={Link}
      to={path}
      active={matchPath(path)}
      tooltip={isExpanded ? undefined : children}
      tooltipPosition="right"
      onClick={onClick}
    >
      <Icon icon={icon} />
      <span>{children}</span>
    </Menu.List.Item>
  );
}
