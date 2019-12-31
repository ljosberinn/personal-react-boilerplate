import React, { useState, useEffect } from 'react';
import { PasswordSelection, Form } from '../../../components';
import { Title, Column, Button, Message, Help } from 'rbx';
import { useIdentityContext } from 'react-netlify-identity';
import { useHistory } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import { useTranslation } from 'react-i18next';
import * as ROUTES from '../../../constants/routes';

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
  const { t } = useTranslation(['resetPassword', 'error', 'settings']);

  const { replace } = useHistory();
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

  // only runs if a token exists that hasn't been validated yet
  useEffect(() => {
    async function verifyToken() {
      if (!shouldUpdatePassword) {
        try {
          const user = await recoverAccount(token);

          if (user.app_metadata.provider !== 'email') {
            setError(errors.isProvider);
          } else {
            setUserObj(user);
            setShouldUpdatePassword(true);
          }
        } catch (error) {
          setError(errors.invalidToken);
        }
      }
    }
    verifyToken();
    // token can't change via props
    // shouldUpdatePassword is condition to run and can only change to false
    // recoverAccount will change because of react-netlify-identity internal state change during calling it
    // eslint-disable-next-line
  }, []);

  // changes the password after re-render with login
  useEffect(() => {
    async function doPasswordChange() {
      if (userObj && shouldUpdatePassword) {
        try {
          // update the password
          await updateUser({ password });
          // kill internal react-netlify-identity state
          setUser(undefined);
          // move use to login
          replace(ROUTES.LOGIN.clientPath);
        } catch (error) {
          // ignore errors here - react-netlify-identity
        }
      }
    }

    doPasswordChange();
  }, [shouldUpdatePassword, userObj, password, updateUser, replace, setUser]);

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
            <Title textAlign="centered" id="section-title">
              {t('title')}
            </Title>
          </legend>

          <br />

          <Column.Group centered>
            <Column size={11}>
              {error ? (
                <Message color="danger">
                  <Message.Header>{t('error:title')}</Message.Header>
                  <Message.Body>
                    <Help role="alert">{t(`error:${error}`)}</Help>
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

                  <Button disabled={isDisabled}>
                    {t('settings:changePassword')}
                  </Button>
                </fieldset>
              )}
            </Column>
          </Column.Group>
        </Column>
      </Column.Group>
    </Form>
  );
}
