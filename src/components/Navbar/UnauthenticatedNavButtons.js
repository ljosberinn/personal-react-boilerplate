import { Button } from 'rbx';
import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';

import { withSuspense } from '../../hocs';
import { useTheme, useNavigationContext } from '../../hooks';
import Icon from '../Icon';

const NavButton = lazy(() =>
  import(/* webpackChunkName: "navbar.nav_button" */ './NavButton'),
);

export default withSuspense(function UnauthenticatedNavButtons() {
  const { t } = useTranslation('routes');
  const { theme } = useTheme();
  const {
    routes: { REGISTER, LOGIN },
    PreloadingLink,
  } = useNavigationContext();

  return (
    <Button.Group>
      <PreloadingLink as={NavButton} color="primary" to={REGISTER}>
        <Icon svg={REGISTER.icon} />
        <span>{t('register')}</span>
      </PreloadingLink>

      <PreloadingLink
        as={NavButton}
        color={theme === 'dark' ? 'light' : undefined}
        to={LOGIN}
      >
        <Icon svg={LOGIN.icon} />
        <span>{t('login')}</span>
      </PreloadingLink>
    </Button.Group>
  );
});
