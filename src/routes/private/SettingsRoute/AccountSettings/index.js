import React from 'react';
import { Content } from 'rbx';
import { useIdentityContext } from 'react-netlify-identity';
import ChangePassword from './ChangePassword';
//import { Icon } from '../../../../components';
//import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function AccountSettings() {
  const { user, updateUser } = useIdentityContext();

  /**
   *
   * @param {string} password
   */
  async function updatePassword(password) {
    await updateUser({ password });
  }

  return (
    <Content>
      {user?.app_metadata?.provider === 'email' && (
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
