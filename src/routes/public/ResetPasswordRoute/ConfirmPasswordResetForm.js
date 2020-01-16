import React, { useState, useEffect } from 'react';
import { PasswordSelection, Form, Error } from '../../../components';
import { Title, Column, Button, Message } from 'rbx';
import { useIdentityContext } from 'react-netlify-identity';
import { useHistory } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import { useTranslation } from 'react-i18next';
import * as ROUTES from '../../../constants/routes';

const errors = {
  invalidToken: 'invalidToken',
  isProvider: 'isProvider',
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

  const handleChange = ({ target: { value, name } }) => {
    setPassword(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!userObj) {
      return;
    }

    updateUser({ password })
      .then(() => {
        // kill internal react-netlify-identity state
        setUser(undefined);
        // move use to login
        replace(ROUTES.LOGIN.clientPath);
      })
      .catch(error => {
        // ignore errors here - react-netlify-identity
        console.error(error);
      });
  };

  // only runs if a token exists that hasn't been validated yet
  useEffect(() => {
    recoverAccount()
      .then(user => {
        if (user.app_metadata.provider !== 'email') {
          setError(errors.isProvider);
        } else {
          setUserObj(user);
        }
      })
      .catch(() => {
        setError(errors.invalidToken);
      });
    // react-netlify-identity functions are excluded because they trigger a re-run
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

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
                    <Error>{t(`error:${error}`)}</Error>
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

                  <Button type="submit" color="primary" disabled={isDisabled}>
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
