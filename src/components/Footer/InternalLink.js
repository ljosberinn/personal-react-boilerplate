import React from 'react';
import { NavLink } from 'react-router-dom';

import Icon from '../Icon';

/**
 *
 * @param {{
 * route: {
 *  clientPath: string;
 *  icon: import('react-icons').IconType;
 *  title: string;
 * };
 * t: import('i18next').TFunction;
 * }}
 */
export default function InternalLink({
  route: { clientPath, icon, title },
  t,
}) {
  return (
    <NavLink activeClassName="is-active" to={clientPath}>
      {icon ? (
        <>
          <Icon svg={icon} />
          <span>{t(title)}</span>
        </>
      ) : (
        t(title)
      )}
    </NavLink>
  );
}
