import React, { useState, useCallback } from 'react';
import { Title, Button, Help, Message } from 'rbx';
import PasswordSelection from '../../../public/RegisterRoute/PasswordSelection';
import { validate } from '../../../../utils/validators';
import { Fade } from 'react-reveal';

export default function ChangePassword({ user }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeSuccessful, setWasSuccessfullyChanged] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      setIsLoading(true);

      try {
        await user.updatePassword(password);
        setWasSuccessfullyChanged(true);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, password],
  );

  const handleChange = useCallback(({ target: { name, value } }) => {
    switch (name) {
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        throw new Error('where does this come from');
    }
  }, []);

  const passwordsAreMatching =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    validate.password(password);

  if (changeSuccessful) {
    return (
      <Fade>
        <Message color="success">
          <Message.Header>Success</Message.Header>
          <Message.Body>Your password was successfully changed.</Message.Body>
        </Message>
      </Fade>
    );
  }

  return (
    <form spellCheck={false} onSubmit={handleSubmit}>
      <legend>
        <Title as="h3">Change password</Title>
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
          state={isLoading ? 'loading' : undefined}
          color="primary"
          disabled={!passwordsAreMatching}
        >
          Change Password
        </Button>
      </fieldset>
    </form>
  );
}
