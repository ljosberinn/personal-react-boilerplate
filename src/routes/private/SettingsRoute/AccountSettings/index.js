import { Content } from 'rbx';
import React, { lazy } from 'react';
import { useIdentityContext } from 'react-netlify-identity';

//import { Icon } from '../../../../components';
//import { faExclamationTriangle } from 'react-icons/fa';

const ChangePassword = lazy(() =>
  import(
    /* webpackChunkName: "private.settings.change_password" */ './ChangePassword'
  ),
);

export default function AccountSettings() {
  const {
    user: { app_metadata },
  } = useIdentityContext();

  return (
    <Content>
      {app_metadata.provider === 'email' && <ChangePassword />}

      {/* 
        <Message color="danger">
          <Message.Header>
            <span>{t('dangerZone')}</span>
            <Icon svg={faExclamationTriangle} />
          </Message.Header>
          <Message.Body>
            <DeleteAccount user={user} />
          </Message.Body>
        </Message>
        */}
    </Content>
  );
}
