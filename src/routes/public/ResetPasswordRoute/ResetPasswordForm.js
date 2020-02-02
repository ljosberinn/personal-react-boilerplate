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

import { ValidityIconLeft, Field, Form, Error } from '../../../components';
import { validate } from '../../../utils/validators';

const errors = {
  'User not found': 'unknownUser',
};

const INITIAL_STATE = {
  mail: '',
  isLoading: false,
  error: null,
  mailSent: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: !state.isLoading };
    case 'SET_MAIL':
      return { ...state, mail: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.value };
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

  const handleChange = useCallback(({ target: { name, value } }) => {
    dispatch({ type: 'SET_MAIL', value });
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();

    dispatch({ type: 'SET_LOADING' });

    try {
      await requestPasswordRecovery(mail);

      dispatch({
        type: 'SET_MAIL_SENT',
      });

      if (error) {
        dispatch({
          type: 'SET_ERROR',
          value: null,
        });
      }
    } catch (error) {
      if (error?.json?.msg) {
        const { msg } = error.json;

        dispatch({
          type: 'SET_ERROR',
          value: errors[msg] ? errors[msg] : 'unknownError',
        });
      }
      console.error(error);
    }

    dispatch({ type: 'SET_LOADING' });
  };

  const isDisabled = mail.length === 0 || !validate.mail(mail);

  if (mailSent) {
    return (
      <Fade>
        <Message color="success">
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
                        onInput={handleChange}
                        autoFocus
                        required
                        autoComplete="username"
                      />
                      <ValidityIconLeft type="mail" value={mail} />
                    </Control>
                  </Field>

                  <Field kind="grouped">
                    <Button
                      color="primary"
                      state={isLoading ? 'loading' : undefined}
                      fullwidth
                      disabled={isDisabled}
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
            i18nKey="login-link"
          >
            Forget it, send me back to the <Link to="/login">Sign in</Link>{' '}
            screen.
          </Trans>
        </Column>
      </Column.Group>
    </Form>
  );
}
