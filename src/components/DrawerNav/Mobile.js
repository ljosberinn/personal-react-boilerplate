import classnames from 'classnames';
import { Tag, Box, Modal } from 'rbx';
import React, { lazy } from 'react';

import styles from './Mobile.module.scss';

const RouteList = lazy(() =>
  import(/* webpackChunkName: "drawer_nav.route_list" */ './RouteList'),
);

export default function DrawerNavMobile({
  isExpanded,
  toggleMenu,
  ...routeListProps
}) {
  return (
    <>
      <Tag
        color="info"
        rounded
        onClick={toggleMenu}
        className={styles.absoluteButton}
        role="button"
      >
        <div className={classnames('navbar-burger', isExpanded && 'is-active')}>
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
