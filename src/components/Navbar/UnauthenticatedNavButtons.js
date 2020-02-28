import { Button } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { withSuspense } from '../../hocs';
import { REGISTER, LOGIN } from '../../routes/config';
import Icon from '../Icon';

const NavButton = lazy(() =>
  import(/* webpackChunkName: "navbar.nav_button" */ './NavButton'),
);

export default withSuspense(function UnauthenticatedNavButtons() {
  const { t } = useTranslation('routes');

  return (
    <Button.Group>
      <NavButton color="primary" to={REGISTER.clientPath}>
        <Icon svg={REGISTER.icon} />
        <span>{t('routes:register')}</span>
      </NavButton>

      <NavButton color="light" to={LOGIN.clientPath}>
        <Icon svg={LOGIN.icon} />
        <span>{t('routes:login')}</span>
      </NavButton>
    </Button.Group>
  );
});
