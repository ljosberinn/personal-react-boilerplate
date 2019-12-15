import React, { useState, useCallback, useEffect } from 'react';
import { Title, Button, Help, Message, Box } from 'rbx';
import PasswordSelection from '../../../public/RegisterRoute/PasswordSelection';
import { validate } from '../../../../utils/validators';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';

const INITIAL_STATE = {
  password: '',
  confirmPassword: '',
};

export default function ChangePassword({ updatePassword }) {
  const [{ password, confirmPassword }, setPasswords] = useState(INITIAL_STATE);
  const [changeSuccessful, setWasSuccessfullyChanged] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('settings');

  useEffect(() => {
    if (changeSuccessful) {
      const timeout = setTimeout(() => {
        setPasswords(INITIAL_STATE);
        setError(null);
        setWasSuccessfullyChanged(false);
      }, 10000);

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
        console.error(error);
        setError(error);
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
      <Fade fadeOutEnabled={true}>
        <Message color="success">
          <Message.Header>
            <p>{t('success')}</p>
            <CountUp duration={10} start={10} end={0} useEasing={false} />
          </Message.Header>
          <Message.Body>{t('changePasswordSuccess')}</Message.Body>
        </Message>
      </Fade>
    );
  }

  return (
    <Fade>
      <Box>
        <form spellCheck={false} onSubmit={handleSubmit}>
          <legend>
            <Title as="h3">{t('changePassword')}</Title>
          </legend>

          <fieldset disabled={isLoading}>
            <PasswordSelection
              {...{ password, confirmPassword, handleChange, isLoading }}
            />

            {error && (
              <Fade>
                <Help color="danger">{error}</Help>
              </Fade>
            )}

            <Button
              type="submit"
              state={isLoading ? 'loading' : undefined}
              color="primary"
              disabled={!passwordsAreMatching}
            >
              {t('changePassword')}
            </Button>
          </fieldset>
        </form>
      </Box>
    </Fade>
  );
}
