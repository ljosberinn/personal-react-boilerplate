import React, { useState, useCallback, useEffect } from 'react';
import { Title, Button, Message } from 'rbx';
import { validate } from '../../../../utils/validators';
import { Flip } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';
import { PasswordSelection, Form, Error } from '../../../../components';

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
};

const errors = {
  'Invalid Refresh Token': 'refresh-token-invalid',
};

const SUCCESS_MSG_DISPLAY_SECONDS = 10;

/**
 * @returns {React.FC<{
 * updatePassword: (password:string) => Promise<void>
 * }>} ChangePassword
 */
export default function ChangePassword({ updatePassword }) {
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

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      setIsLoading(true);

      try {
        await updatePassword(password);
        setWasSuccessfullyChanged(true);
      } catch (error) {
        if (error?.json?.error_description) {
          const { error_description } = error.json;
          setError(
            errors[error_description]
              ? errors[error_description]
              : 'unknown-error',
          );
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [password, updatePassword],
  );

  const handleChange = useCallback(({ target: { name, value } }) => {
    setPasswords(passwords => ({ ...passwords, [name]: value }));
  }, []);

  const passwordsAreMatching =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    validate.password(password);

  if (changeSuccessful) {
    return (
      <Flip direction="vertical">
        <Message color="success">
          <Message.Header>
            <span>{t('success')}</span>
            <CountUp
              duration={SUCCESS_MSG_DISPLAY_SECONDS}
              start={SUCCESS_MSG_DISPLAY_SECONDS}
              end={0}
              useEasing={false}
            />
          </Message.Header>
          <Message.Body>{t('changePasswordSuccess')}</Message.Body>
        </Message>
      </Flip>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <legend>
        <Title as="h3">{t('changePassword')}</Title>
      </legend>

      <fieldset disabled={isLoading}>
        <PasswordSelection
          {...{ password, confirmPassword, handleChange, isLoading }}
        />

        {error && <Error className="field">{t(error)}</Error>}

        <Button
          type="submit"
          state={isLoading ? 'loading' : undefined}
          color="primary"
          disabled={!passwordsAreMatching}
        >
          {t('changePassword')}
        </Button>
      </fieldset>
    </Form>
  );
}
