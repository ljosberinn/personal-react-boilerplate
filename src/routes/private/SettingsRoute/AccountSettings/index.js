import React, { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { Content, Title, Message } from 'rbx';
import RedirectToHome from '../../../RedirectToHome';
import DeleteAccount from './DeleteAccount';
import ChangePassword from './ChangePassword';
import { Icon } from '../../../../components';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default function AccountSettings() {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation('settings');

  if (!user) {
    return <RedirectToHome />;
  }

  const isGoogleUser = user && user.providerData[0].providerId === 'google.com';

  return (
    <Content>
      <Title as="h2" subtitle>
        {t('accountSettings')}
      </Title>

      {!isGoogleUser && (
        <>
          <ChangePassword user={user} />
          <hr />
        </>
      )}

      <Message color="danger">
        <Message.Header>
          <span>{t('dangerZone')}</span>
          <Icon icon={faExclamationTriangle} />
        </Message.Header>
        <Message.Body>
          <DeleteAccount user={user} />
        </Message.Body>
      </Message>
    </Content>
  );
}
