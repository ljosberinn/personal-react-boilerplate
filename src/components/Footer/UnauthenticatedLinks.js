import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { useNavigationContext } from '../../hooks';
import Icon from '../Icon';

export default function UnauthenticatedLinks() {
  const { t } = useTranslation('routes');
  const {
    routes: { REGISTER, LOGIN, RESET_PASSWORD },
    PreloadingLink,
  } = useNavigationContext();

  return (
    <>
      <li>
        <PreloadingLink as={NavLink} to={REGISTER}>
          <Icon svg={REGISTER.icon} />
          <span>{t(REGISTER.title)}</span>
        </PreloadingLink>
      </li>
      <li>
        <PreloadingLink as={NavLink} to={LOGIN}>
          <Icon svg={LOGIN.icon} />
          <span>{t(LOGIN.title)}</span>
        </PreloadingLink>
      </li>
      <li>
        <PreloadingLink as={NavLink} to={RESET_PASSWORD}>
          <Icon svg={RESET_PASSWORD.icon} />
          <span>{t(RESET_PASSWORD.title)}</span>
        </PreloadingLink>
      </li>
    </>
  );
}
