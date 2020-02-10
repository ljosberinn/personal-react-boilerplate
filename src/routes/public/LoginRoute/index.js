import { useIdentityContext } from 'react-netlify-identity';

import {
  Card,
  Section,
  Title,
  Field,
  Divider,
  Label,
  Control,
  Input,
  Column,
  Button,
  Generic,
} from 'rbx';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// TODO: remove once https://github.com/dennismorello/react-awesome-reveal/issues/14 might be resolved
import Shake from 'react-reveal/Shake';
import { Link, useParams } from 'react-router-dom';

import {
  ValidityIconLeft,
  TemplatedHelmet,
  Form,
  Error,
  LoginProviderGroup,
} from '../../../components';
import { REGISTER, RESET_PASSWORD } from '../../../constants/routes';
import {
  validate,
  pattern,
  passwordMinLength,
} from '../../../utils/validators';
import RedirectToHome from '../../RedirectToHome';

import styles from './Login.module.scss';

const INITIAL_STATE = {
  mail: '',
  password: '',
};

const errors = {
  'Email not confirmed': 'mailUnconfirmed',
  'No user found with this email': 'unknownUser',
  'Invalid Password': 'passwordInvalid',
};

export default function LoginRoute() {
  const { t } = useTranslation(['login', 'error']);
  const { isLoggedIn, loginUser } = useIdentityContext();

  const params = useParams();

  const isValidMailParam = params.mail && validate.mail(params.mail);

  const [data, setData] = useState(
    (() => {
      if (isValidMailParam) {
        return {
          ...INITIAL_STATE,
          mail: params.mail,
        };
      }

      return INITIAL_STATE;
    })(),
  );

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();

    if (error) {
      setError(null);
    }

    setLoading(true);

    try {
      await loginUser(mail, password, true);
    } catch (error) {
      if (error?.json?.error_description) {
        const { error_description } = error.json;
        setError(
          errors[error_description]
            ? errors[error_description]
            : 'unknownError',
        );
      }
      console.error(error);

      setLoading(false);
    }
  };

  const handleChange = useCallback(
    ({ target: { name, type, value } }) => {
      if (error) {
        setError(null);
      }

      setData(data => ({ ...data, [name]: value }));
    },
    [error],
  );

  if (isLoggedIn) {
    return <RedirectToHome />;
  }

  const { mail, password } = data;

  const isDisabled =
    mail.length === 0 ||
    password.length === 0 ||
    !validate.mail(mail) ||
    !validate.password(password);

  return (
    <>
      <TemplatedHelmet>
        <title>{t('title')}</title>
      </TemplatedHelmet>
      <Section
        className={`has-background-svg ${styles.container}`}
        aria-labelledby="section-title"
      >
        <Column.Group centered>
          <Column widescreen={{ size: 6 }} tablet={{ size: 9 }}>
            <Card>
              <Card.Content>
                <Form onSubmit={handleSubmit}>
                  <Column.Group centered>
                    <Column
                      className="has-content-spaced-between"
                      widescreen={{ size: 11 }}
                    >
                      <legend>
                        <Title textAlign="centered" id="section-title">
                          {t('signIn')}
                        </Title>
                        <Title subtitle textAlign="centered">
                          {t('or')}{' '}
                          <Link to={REGISTER.clientPath}>
                            {t('createAccount')}
                          </Link>
                        </Title>
                      </legend>

                      <Column.Group centered>
                        <Column size={11}>
                          <Shake duration={500} when={error}>
                            <fieldset disabled={isLoading}>
                              <LoginProviderGroup />

                              <Divider data-content={t('orWithMail')} />

                              <Field>
                                <Label htmlFor="mail">{t('email')}</Label>

                                <Control iconLeft loading={isLoading}>
                                  <Input
                                    type="mail"
                                    placeholder="email@example.com"
                                    name="mail"
                                    id="mail"
                                    onInput={handleChange}
                                    autoFocus={!isValidMailParam}
                                    required
                                    autoComplete="username"
                                    defaultValue={mail}
                                    data-testid="mail"
                                  />
                                  <ValidityIconLeft type="mail" value={mail} />
                                </Control>

                                {error &&
                                  [
                                    'unknownUser',
                                    'mailUnknown',
                                    'mailUnconfirmed',
                                  ].includes(error) && (
                                    <Error>{t(`error:${error}`)}</Error>
                                  )}
                              </Field>

                              <Field>
                                <Label htmlFor="password">
                                  {t('password')}
                                </Label>

                                <Control iconLeft loading={isLoading}>
                                  <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onInput={handleChange}
                                    autoFocus={data.mail.length > 0}
                                    pattern={pattern.password}
                                    required
                                    autoComplete="current-password"
                                    data-testid="password"
                                    minLength={passwordMinLength}
                                  />
                                  <ValidityIconLeft
                                    type="password"
                                    value={password}
                                  />
                                </Control>

                                {error && error.includes('password') && (
                                  <Error>{t(`error:${error}`)}</Error>
                                )}
                              </Field>

                              <Button
                                color="primary"
                                state={isLoading ? 'loading' : undefined}
                                fullwidth
                                disabled={isDisabled}
                                type="submit"
                                data-testid="sign-in"
                              >
                                {t('signIn')}
                              </Button>

                              <br />

                              <Generic textAlign="centered">
                                <Title
                                  size={6}
                                  as={Link}
                                  to={RESET_PASSWORD.clientPath}
                                >
                                  {t('forgotPassword')}
                                </Title>
                              </Generic>
                            </fieldset>
                          </Shake>
                        </Column>
                      </Column.Group>

                      <Generic as="p" textAlign="centered">
                        {t('dontHaveAnAccount')}{' '}
                        <Link to={REGISTER.clientPath}>{t('signUp')}</Link>
                      </Generic>
                    </Column>
                  </Column.Group>
                </Form>
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
