import { Title, Button } from 'rbx';
import React, { useState, useCallback, useEffect, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';

import { PasswordSelection, Form, Error } from '../../../../components';
import { isValidPassword } from '../../../../utils/validators';
import { SUCCESS_MSG_DISPLAY_SECONDS } from './SuccessfulPasswordChange';

const SuccessfulPasswordChange = lazy(() =>
  import(
    /* webpackChunkName: "private.settings.account.successful_password_change" */ './SuccessfulPasswordChange'
  ),
);

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
};

const errors = {
  'Invalid Refresh Token': 'refreshTokenInvalid',
};

export default function ChangePassword() {
  const { updateUser } = useIdentityContext();
  const [{ password, confirmPassword }, setPasswords] = useState(INITIAL_STATE);
  const [changeSuccessful, setWasSuccessfullyChanged] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(['settings', 'error']);

  useEffect(() => {
    if (changeSuccessful) {
      const timeout = setTimeout(() => {
        setPasswords(INITIAL_STATE);
        setError(null);
        setWasSuccessfullyChanged(false);
      }, SUCCESS_MSG_DISPLAY_SECONDS * 1000);

      return () => clearTimeout(timeout);
    }
  }, [changeSuccessful]);

  /**
   *
   * @param {string} password
   */
  async function updatePassword(password) {
    await updateUser({ password });
  }

  function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    updatePassword(password)
      .then(() => {
        setWasSuccessfullyChanged(true);
      })
      .catch(error => {
        if (error?.json?.error_description) {
          const { error_description } = error.json;
          setError(
            errors[error_description]
              ? errors[error_description]
              : 'unknownError',
          );
        }
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleChange = useCallback(({ target: { name, value } }) => {
    setPasswords(passwords => ({ ...passwords, [name]: value }));
  }, []);

  if (changeSuccessful) {
    return <SuccessfulPasswordChange />;
  }

  const passwordsAreMatching =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    isValidPassword(password);

  return (
    <Form onSubmit={handleSubmit}>
      <fieldset disabled={isLoading}>
        <legend>
          <Title as="h3">{t('changePassword')}</Title>
        </legend>

        <PasswordSelection
          {...{ password, confirmPassword, handleChange, isLoading }}
        />

        {error && (
          <Error className="field" data-testid="change-password-error">
            {t(error)}
          </Error>
        )}

        <Button
          type="submit"
          state={isLoading ? 'loading' : undefined}
          color="primary"
          disabled={!passwordsAreMatching}
          data-testid="change-password-submit"
        >
          {t('changePassword')}
        </Button>
      </fieldset>
    </Form>
  );
}
