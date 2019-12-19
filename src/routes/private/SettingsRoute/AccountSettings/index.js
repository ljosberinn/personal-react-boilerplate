import React from 'react';
import { Content } from 'rbx';
import ChangePassword from './ChangePassword';
//import { Icon } from '../../../../components';
//import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useIdentityContext } from 'react-netlify-identity';

/**
 * @returns {React.FC} AccountSettings
 */
export default function AccountSettings() {
  const { user, updateUser } = useIdentityContext();

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
