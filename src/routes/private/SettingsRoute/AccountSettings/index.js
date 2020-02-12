import { Content } from 'rbx';
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';

import ChangePassword from './ChangePassword';
//import { Icon } from '../../../../components';
//import { faExclamationTriangle } from 'react-icons/fa';

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
