import classnames from 'classnames';
import { Button } from 'rbx';
import React, { lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSignOutAlt } from 'react-icons/fa';
import { useIdentityContext } from 'react-netlify-identity';
import { useLocation } from 'react-router-dom';

import { withSuspense } from '../../hocs';
import { useNavigate } from '../../hooks';
import { SETTINGS } from '../../routes/config';
import Icon from '../Icon';
import Loader from '../Loader';

const NavButton = lazy(() =>
  import(/* webpackChunkName: "navbar.nav_button" */ './NavButton'),
);

/**
 *
 * @param {{
 * isLoggingOut: boolean,
 * isConfirmedUser: boolean,
 * handleLogout: () => Promise<void>,
 * t: import('react-i18next').UseTranslationResponse['t']
 * }}
 */
export default withSuspense(function AuthenticatedNavButtons() {
  const { logoutUser } = useIdentityContext();
  const { pathname } = useLocation();
  const { t } = useTranslation(['navigation', 'routes']);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    navigate('/');

    setIsLoggingOut(true);
    await logoutUser();
    setIsLoggingOut(false);
  };

  return (
    <>
      <Button.Group>
        <NavButton
          color="primary"
          to={SETTINGS.clientPath}
          disabled={isLoggingOut}
        >
          <Icon
            svg={SETTINGS.icon}
            className={classnames(
              'is-spinning',
              pathname.includes('/settings/') && 'active',
            )}
          />
          <span>{t('routes:settings')}</span>
        </NavButton>

        <Button color="danger" onClick={handleLogout} disabled={isLoggingOut}>
          <Icon svg={FaSignOutAlt} />
          <span>{t('logout')}</span>
        </Button>
      </Button.Group>
      {isLoggingOut && <Loader isFullPage />}
    </>
  );
});
