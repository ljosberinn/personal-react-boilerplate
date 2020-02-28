import { Button } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { withSuspense } from '../../hocs';
import {
  REGISTER as REGISTER_CONFIG,
  LOGIN as LOGIN_CONFIG,
} from '../../routes/config';
import { REGISTER, LOGIN } from '../../routes/public';
import Icon from '../Icon';

const NavButton = lazy(() =>
  import(/* webpackChunkName: "navbar.nav_button" */ './NavButton'),
);

export default withSuspense(function UnauthenticatedNavButtons() {
  const { t } = useTranslation('routes');

  return (
    <Button.Group>
      <NavButton
        color="primary"
        to={REGISTER_CONFIG.clientPath}
        onMouseOver={() => REGISTER.component.preload()}
      >
        <Icon svg={REGISTER_CONFIG.icon} />
        <span>{t('routes:register')}</span>
      </NavButton>

      <NavButton
        color="light"
        to={LOGIN_CONFIG.clientPath}
        onMouseOver={() => LOGIN.component.preload()}
      >
        <Icon svg={LOGIN_CONFIG.icon} />
        <span>{t('routes:login')}</span>
      </NavButton>
    </Button.Group>
  );
});
