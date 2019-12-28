import React, { useState, useEffect } from 'react';
import { PasswordSelection, Form } from '../../../components';
import { Title, Column, Button, Message } from 'rbx';
import { useIdentityContext } from 'react-netlify-identity';
import { Link, useLocation } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import { validate } from '../../../utils/validators';
import { useTranslation } from 'react-i18next';

const errors = {
  invalidToken: 'invalid-token',
  isProvider: 'is-provider',
};

/**
 *
 * @returns {React.FC<{
 * token: string
 * }>} ConfirmPasswordResetForm
 */
export default function ConfirmPasswordResetForm({ token }) {
  const { t } = useTranslation(['resetPassword', 'error']);

  const { push } = useLocation();
  const { recoverAccount, setUser, updateUser } = useIdentityContext();

  const [{ password, confirmPassword }, setPassword] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const [shouldUpdatePassword, setShouldUpdatePassword] = useState(false);

  const handleChange = ({ target: { value, name } }) => {
    setPassword(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!userObj) {
      return;
    }

    // this is effectively a login, triggering a re-render
    setUser(userObj);
  };

  useEffect(() => {
    (async () => {
      if (!shouldUpdatePassword) {
        try {
          const user = await recoverAccount(token);
          setUserObj(user);

          if (user.app_metadata.provider !== 'email') {
            setError(errors.isProvider);
          } else {
            setShouldUpdatePassword(true);
          }
        } catch (error) {
          setError(errors.invalidToken);
        }
      }
    })();
  }, []);

  // changes the password after re-render with login
  useEffect(() => {
    async function doPasswordChange() {
      if (userObj && shouldUpdatePassword) {
        try {
          await updateUser({ password });
          push('/');
        } catch (error) {}
      }
    }

    doPasswordChange();
  }, [shouldUpdatePassword, userObj, password, updateUser, push]);

  const isDisabled =
    !validate.password(password) || password !== confirmPassword;

  return (
    <Form onSubmit={handleSubmit}>
      <Column.Group centered>
        <Column
          className="has-content-spaced-between"
          widescreen={{ size: 11 }}
        >
          <legend>
            <Title textAlign="centered">{t('title')}</Title>
          </legend>

          <br />

          <Column.Group centered>
            <Column size={11}>
              {error ? (
                <Message color="danger">
                  <Message.Header>{t('error:title')}</Message.Header>
                  <Message.Body>
                    <p>{t(error)}</p>

                    <br />

                    <Button
                      as={Link}
                      color="primary"
                      to={ROUTES.RESET_PASSWORD.clientPath}
                    >
                      Go back
                    </Button>
                  </Message.Body>
                </Message>
              ) : (
                <fieldset>
                  <PasswordSelection
                    isLoading={false}
                    password={password}
                    confirmPassword={confirmPassword}
                    handleChange={handleChange}
                  />

                  <Button disabled={isDisabled}>Change Password</Button>
                </fieldset>
              )}
            </Column>
          </Column.Group>
        </Column>
      </Column.Group>
    </Form>
  );
}
