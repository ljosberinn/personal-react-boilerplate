import React from 'react';
import { Content, Title, Message, Box } from 'rbx';
import RedirectToHome from '../../../RedirectToHome';
//import DeleteAccount from './DeleteAccount';
import ChangePassword from './ChangePassword';
import ChangeMail from './ChangeMail';
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

  async function updateMail(email) {
    await updateUser({ fields: { email } });
  }

  async function updatePassword(password) {
    await updateUser({ fields: { password } });
  }

  return (
    <Content>
      <Box>
        <Title as="h2" subtitle>
          {t('accountSettings')}
        </Title>
      </Box>

      {user.app_metadata.provider === 'email' && (
        <>
          <ChangeMail updateMail={updateMail} />
          <ChangePassword updatePassword={updatePassword} />
        </>
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
