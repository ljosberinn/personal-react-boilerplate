import { Column, Card, Section } from 'rbx';
import React, { useState, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { TemplatedHelmet } from '../../../components';
import { withSentry } from '../../../hocs';
import styles from './ResetPassword.module.scss';
import ResetPasswordForm from './ResetPasswordForm';

const ConfirmPasswordResetForm = lazy(() =>
  import(
    /* webpackChunkName: "reset_password.confirm_password_reset_form" */ './ConfirmPasswordResetForm'
  ),
);

export default withSentry(function ResetPasswordRoute() {
  const { t } = useTranslation('resetPassword');
  const { location } = useHistory();
  const [token] = useState(location.state?.token);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('title')}</title>
      </TemplatedHelmet>
      <Section className={styles.container} aria-labelledby="section-title">
        <Column.Group centered className={styles.parent}>
          <Column widescreen={{ size: 5 }} tablet={{ size: 8 }}>
            <Card>
              <Card.Content>
                {token ? <ConfirmPasswordResetForm /> : <ResetPasswordForm />}
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
});
