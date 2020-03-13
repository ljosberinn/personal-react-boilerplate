import {
  Column,
  Title,
  Content,
  Label,
  Input,
  Control,
  Message,
  Button,
  Generic,
} from 'rbx';
import React, { useReducer, useCallback } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation, Trans } from 'react-i18next';
import { useIdentityContext } from 'react-netlify-identity';
import { Link } from 'react-router-dom';

import { ValidityIcon, Field, Form, Error } from '../../../../components';
import { isValidMail } from '../../../../utils/validators';

const errors = {
  'User not found': 'unknownUser',
};

const INITIAL_STATE = {
  mail: '',
  isLoading: false,
  error: null,
  mailSent: false,
};

const reducer = (state, { type, value }) => {
  switch (type) {
    case 'SET_LOADING':
      return { ...state, isLoading: !state.isLoading };
    case 'SET_MAIL':
      return { ...state, mail: value };
    case 'SET_ERROR':
      return { ...state, error: value };
    case 'SET_MAIL_SENT':
      return { ...state, mailSent: !state.mailSent };
    default:
      return state;
  }
};

export default function ResetPasswordForm() {
  const { t } = useTranslation(['resetPassword', 'login', 'error']);
  const { requestPasswordRecovery } = useIdentityContext();
  const [{ mail, isLoading, error, mailSent }, dispatch] = useReducer(
    reducer,
    INITIAL_STATE,
  );

  const handleChange = useCallback(({ target: { value } }) => {
    dispatch({ type: 'SET_MAIL', value });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    dispatch({ type: 'SET_LOADING' });

    requestPasswordRecovery(mail)
      .then(() => {
        dispatch({
          type: 'SET_MAIL_SENT',
        });

        if (error) {
          dispatch({
            type: 'SET_ERROR',
            value: null,
          });
        }
      })
      .catch(error => {
        if (error?.json?.msg) {
          const { msg } = error.json;

          dispatch({
            type: 'SET_ERROR',
            value: errors[msg] ? errors[msg] : 'unknownError',
          });
        }
        console.error(error);
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING' });
      });
  }

  const isDisabled = mail.length === 0 || !isValidMail(mail);

  if (mailSent) {
    return (
      <Fade>
        <Message color="success" data-testid="success-message">
          <Message.Header>{t('success')}</Message.Header>
          <Message.Body>{t('mailSent')}</Message.Body>
        </Message>
      </Fade>
    );
  }

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
              <Title size={5} as="p" textWeight="normal">
                {t('instructions')}
              </Title>
              <Content>
                <fieldset disabled={isLoading}>
                  <Field>
                    <Label htmlFor="mail">{t('login:email')}</Label>

                    <Control iconLeft loading={isLoading}>
                      <Input
                        type="mail"
                        placeholder="email@example.com"
                        name="mail"
                        id="mail"
                        data-testid="mail-input"
                        onInput={handleChange}
                        autoFocus
                        required
                        autoComplete="username"
                      />
                      <ValidityIcon align="left" type="mail" value={mail} />
                    </Control>
                  </Field>

                  <Field kind="grouped">
                    <Button
                      color="primary"
                      state={isLoading ? 'loading' : undefined}
                      fullwidth
                      disabled={isDisabled}
                      data-testid="submit-button"
                    >
                      {t('requestRecovery')}
                    </Button>
                  </Field>

                  {error && <Error>{t(`error:${error}`)}</Error>}
                </fieldset>
              </Content>
            </Column>
          </Column.Group>
          <Trans
            parent={Generic}
            as="p"
            textAlign="centered"
            ns="resetPassword"
            i18nKey="loginLink"
          >
            Forget it, send me back to the <Link to="/login">Sign in</Link>{' '}
            screen.
          </Trans>
        </Column>
      </Column.Group>
    </Form>
  );
}
