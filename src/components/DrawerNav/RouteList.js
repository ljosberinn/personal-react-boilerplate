import { Menu } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';

import * as ROUTES from '../../routes/config';

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
  const { isLoggedIn } = useIdentityContext();
  const { t } = useTranslation('navigation');

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
            svg={icon}
            isExpanded={isExpanded}
            onClick={onClick}
            key={clientPath}
          >
            {t(title)}
          </NavigationLink>
        ))}
    </Menu.List>
  );
}
