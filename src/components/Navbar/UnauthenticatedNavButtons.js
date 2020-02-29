import { Button } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { withSuspense } from '../../hocs';
import { useTheme } from '../../hooks';
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
  const { theme } = useTheme();

  return (
    <Button.Group>
      <NavButton
        color="primary"
        to={REGISTER_CONFIG.clientPath}
        onMouseOver={() => REGISTER.component.preload()}
      >
        <Icon svg={REGISTER_CONFIG.icon} />
        <span>{t('register')}</span>
      </NavButton>

      <NavButton
        color={theme === 'dark' ? 'light' : undefined}
        to={LOGIN_CONFIG.clientPath}
        onMouseOver={() => LOGIN.component.preload()}
      >
        <Icon svg={LOGIN_CONFIG.icon} />
        <span>{t('login')}</span>
      </NavButton>
    </Button.Group>
  );
});
