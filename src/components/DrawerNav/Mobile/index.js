import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Tag, Box, Modal } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';

import withSuspense from '../../../hocs/withSuspense';
import styles from './Mobile.module.scss';

const RouteList = withSuspense(
  lazy(() =>
    import(/* webpackChunkName: "drawer_nav.route_list" */ '../RouteList'),
  ),
);

export default function Mobile({ isExpanded, toggleMenu, ...rest }) {
  const { t } = useTranslation('navigation');

  return (
    <>
      <Tag
        color="info"
        rounded
        onClick={toggleMenu}
        className={styles.absoluteButton}
        role="button"
        aria-label={t('toggleMenu')}
        {...rest}
      >
        <div className={classnames('navbar-burger', isExpanded && 'is-active')}>
          <span />
          <span />
          <span />
        </div>
      </Tag>

      {isExpanded && (
        <Modal
          active
          closeOnBlur
          closeOnEsc
          data-testid="drawer-nav-mobile-modal"
        >
          <Modal.Background onClick={toggleMenu} />
          <Modal.Content>
            <Box className={styles.mobileBox}>
              <nav aria-label="primary navigation">
                <RouteList isExpanded />
              </nav>
            </Box>
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}

Mobile.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
