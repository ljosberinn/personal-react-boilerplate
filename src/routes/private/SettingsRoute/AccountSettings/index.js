import React from 'react';
import { Content, Title, Message } from 'rbx';
import RedirectToHome from '../../../RedirectToHome';
import DeleteAccount from './DeleteAccount';
import ChangePassword from './ChangePassword';
import { Icon } from '../../../../components';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';

export default function AccountSettings() {
  const { user } = useIdentityContext();
  const { t } = useTranslation('settings');

  if (!user) {
    return <RedirectToHome />;
  }

  return (
    <Content>
      <Title as="h2" subtitle>
        {t('accountSettings')}
      </Title>

      <ChangePassword user={user} />
      <hr />

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
