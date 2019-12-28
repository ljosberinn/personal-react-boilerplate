import React, { useReducer, useCallback } from 'react';
import {
  Column,
  Title,
  Content,
  Label,
  Input,
  Control,
  Message,
  Button,
  Help,
} from 'rbx';
import { Link } from 'react-router-dom';
import { ValidityIconLeft, Field, Form } from '../../../components';
import { useIdentityContext } from 'react-netlify-identity';
import { validate } from '../../../utils/validators';
import { Fade } from 'react-awesome-reveal';
import { useTranslation, Trans } from 'react-i18next';

const errors = {
  'User not found': 'unknown_user',
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

/**
 *
 * @returns {React.FC} ResetPasswordForm
 */
export default function ResetPasswordForm() {
  const { t } = useTranslation(['resetPassword', 'login']);
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
          value: errors[msg] ? errors[msg] : 'unknown_error',
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
          <Message.Header>Success</Message.Header>
          <Message.Body>
            A mail has been sent. Please check your inbox as well as your spam
            folder.
          </Message.Body>
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
            <Title textAlign="centered">{t('title')}</Title>
          </legend>

          <br />

          <Column.Group centered>
            <Column size={11}>
              <Title size={5} as="p" textWeight="normal">
                Enter your email address and we'll send you an email with
                instructions to reset your password.
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
                      Request Password Recovery
                    </Button>
                  </Field>

                  {error && <Help color="danger">{error}</Help>}
                </fieldset>
              </Content>
            </Column>
          </Column.Group>
          <p className="has-text-centered has-text-grey">
            Forget it, send me back to the <Link to="/login">Sign in</Link>{' '}
            screen.
          </p>
        </Column>
      </Column.Group>
    </Form>
  );
}
