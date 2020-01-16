import React, { useState } from 'react';
import { TemplatedHelmet } from '../../../components';
import { Column, Card, Section } from 'rbx';
import ResetPasswordForm from './ResetPasswordForm';
import ConfirmPasswordResetForm from './ConfirmPasswordResetForm';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * @returns {React.FC}
 */
export default function ResetPasswordRoute() {
  const { t } = useTranslation('resetPassword');
  const { location } = useHistory();
  const [token] = useState(location.state?.token);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('title')}</title>
      </TemplatedHelmet>
      <Section className="reset-password-bg" aria-labelledby="section-title">
        <Column.Group centered>
          <Column widescreen={{ size: 5 }} tablet={{ size: 8 }}>
            <Card>
              <Card.Content>
                {token ? (
                  <ConfirmPasswordResetForm token={token} />
                ) : (
                  <ResetPasswordForm />
                )}
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
