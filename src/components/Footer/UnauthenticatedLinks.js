import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useNavigationContext } from '../../context';
import Icon from '../Icon';

export default function UnauthenticatedLinks() {
  const { t } = useTranslation('routes');
  const {
    routes: { REGISTER, LOGIN, RESET_PASSWORD },
    PreloadingLink,
  } = useNavigationContext();

  return (
    <>
      {[REGISTER, LOGIN, RESET_PASSWORD].filter(Boolean).map(route => (
        <li key={route.title}>
          <PreloadingLink as={NavLink} to={route}>
            <Icon svg={route.icon} />
            <span>{t(route.title)}</span>
          </PreloadingLink>
        </li>
      ))}
    </>
  );
}
