import PropTypes from 'prop-types';
import { Column, Menu, Box } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDoubleDown } from 'react-icons/fa';

import withSuspense from '../../../hocs/withSuspense';
import Icon from '../../Icon';
import styles from './Desktop.module.scss';

const RouteList = withSuspense(
  lazy(() =>
    import(/* webpackChunkName: "drawer_nav.route_list" */ '../RouteList'),
  ),
);

export default function Desktop({ isExpanded, toggleMenu, ...rest }) {
  const { t } = useTranslation('navigation');

  return (
    <Column
      size={isExpanded ? 2 : 1}
      className={styles.transitionAll}
      {...rest}
    >
      <Box as={Menu} className={styles.box}>
        <nav aria-label="primary navigation">
          <RouteList isExpanded={isExpanded} />
          <Menu.List className={styles.fixedBottom}>
            <Menu.List.Item
              onClick={toggleMenu}
              tooltip={isExpanded ? undefined : t('toggleMenu')}
              tooltipPosition="right"
              data-testid="drawer-nav-desktop-toggle"
            >
              <Icon
                svg={FaAngleDoubleDown}
                className={
                  isExpanded ? styles.transform90 : styles.transform270
                }
              />
              <span>{t('toggleMenu')}</span>
            </Menu.List.Item>
          </Menu.List>
        </nav>
      </Box>
    </Column>
  );
}

Desktop.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
