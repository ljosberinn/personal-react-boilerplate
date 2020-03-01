import { Column, Menu, Box } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDoubleDown } from 'react-icons/fa';

import withSuspense from '../../hocs/withSuspense';
import Icon from '../Icon';
import styles from './Desktop.module.scss';

const RouteList = withSuspense(
  lazy(() =>
    import(/* webpackChunkName: "drawer_nav.route_list" */ './RouteList'),
  ),
);

export default function Desktop({ isExpanded, toggleMenu, ...routeListProps }) {
  const { t } = useTranslation('navigation');

  return (
    <Column size={isExpanded ? 2 : 1} className={styles.transitionAll}>
      <Box as={Menu} className={styles.box}>
        <nav aria-label="primary navigation">
          <RouteList isExpanded={isExpanded} {...routeListProps} />
          <Menu.List className={styles.fixedBottom}>
            <Menu.List.Item
              onClick={toggleMenu}
              tooltip={isExpanded ? undefined : t('toggleMenu')}
              tooltipPosition="right"
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
