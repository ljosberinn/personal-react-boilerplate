import { Menu } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigationContext, useMediaQuery } from '../../hooks';

const NavigationLink = lazy(() =>
  import(
    /* webpackChunkName: "drawer_nav.navigation_link"*/ './NavigationLink'
  ),
);

/**
 *
 * @param {{
 * isExpanded: boolean;
 * onClick?: () => void;
 * }}
 */
export default function RouteList({ isExpanded, onClick }) {
  const { t } = useTranslation('routes');
  const { routes, PreloadingLink } = useNavigationContext();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <Menu.List>
      {Object.values(routes)
        .filter(({ visibleInDrawerNav }) => visibleInDrawerNav)
        .map(route => (
          <PreloadingLink
            as={NavigationLink}
            to={route}
            path={route.clientPath}
            svg={route.icon}
            isExpanded={isDesktop ? isExpanded : true}
            onClick={onClick}
            key={route.clientPath}
          >
            {t(route.title)}
          </PreloadingLink>
        ))}
    </Menu.List>
  );
}
