import React from 'react';
import { Content, Title } from 'rbx';
import RedirectToHome from '../../../RedirectToHome';
import ChangePassword from './ChangePassword';
//import { Icon } from '../../../../components';
//import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';

export default function AccountSettings() {
  const { user, updateUser } = useIdentityContext();
  const { t } = useTranslation('settings');

  if (!user) {
    return <RedirectToHome />;
  }

  async function updatePassword(password) {
    await updateUser({ fields: { password } });
  }

  return (
    <Content>
      {user.app_metadata.provider === 'email' && (
        <ChangePassword updatePassword={updatePassword} />
      )}

      {/* 
      <Message color="danger">
        <Message.Header>
          <span>{t('dangerZone')}</span>
          <Icon icon={faExclamationTriangle} />
        </Message.Header>
        <Message.Body>
          <DeleteAccount user={user} />
        </Message.Body>
      </Message>
      */}
    </Content>
  );
}
