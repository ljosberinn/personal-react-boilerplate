import React, { useState, useCallback } from 'react';
import { validate, pattern } from '../../../utils/validators';
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
  Help,
} from 'rbx';
import { Fade } from 'react-awesome-reveal';
// TODO: remove once https://github.com/dennismorello/react-awesome-reveal/issues/14 might be resolved
import Shake from 'react-reveal/Shake';
import RedirectToHome from '../../RedirectToHome';
import { Link, useParams } from 'react-router-dom';
import {
  ValidityIconLeft,
  Checkbox,
  TemplatedHelmet,
  LoginProviderButton,
} from '../../../components';
import { useIdentityContext } from 'react-netlify-identity';
import { useTranslation } from 'react-i18next';
import LogRocket from 'logrocket';

const initialState = {
  mail: '',
  password: '',
  rememberMe: false,
};

const errors = {
  'Email not confirmed': 'mail_unconfirmed',
  'No user found with this email': 'unknown_user',
  'Invalid Password': 'password-invalid',
};

/**
 * @returns {React.FC} LoginRoute
 */
export default function LoginRoute() {
  const { t } = useTranslation('login');
  const { isLoggedIn, loginUser } = useIdentityContext();

  const params = useParams();

  const isValidMailParam = params.mail && validate.mail(params.mail);

  const [data, setData] = useState(
    (() => {
      if (isValidMailParam) {
        return {
          ...initialState,
          mail: params.mail,
        };
      }

      const storedData = localStorage.getItem(
        process.env.REACT_APP_BRAND_NAME.split(' ').join('-'),
      );

      if (storedData) {
        const { mail } = JSON.parse(storedData);

        return {
          ...initialState,
          mail,
          rememberMe: true,
        };
      }

      return initialState;
    })(),
  );

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();

    setLoading(true);

    try {
      const { id, created_at, confirmed_at } = await loginUser(
        mail,
        password,
        data.rememberMe,
      );

      LogRocket.identify(id, {
        email: mail,
        provider: 'mail',
        created_at,
        confirmed_at,
      });
    } catch (error) {
      if (error?.json?.error_description) {
        const { error_description } = error.json;
        setError(
          errors[error_description]
            ? errors[error_description]
            : 'unknown_error',
        );
      }
      console.error(error);

      setLoading(false);
    }
  };

  const handleChange = useCallback(
    ({ target: { name, type, value, checked } }) => {
      switch (type) {
        case 'checkbox':
          setData(data => ({ ...data, [name]: checked }));
          break;
        default:
          setData(data => ({ ...data, [name]: value }));
      }
    },
    [],
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
      <Section className="login-bg">
        <Column.Group centered>
          <Column widescreen={{ size: 5 }} tablet={{ size: 8 }}>
            <Card>
              <Card.Content>
                <form spellCheck={false} onSubmit={handleSubmit}>
                  <Column.Group centered>
                    <Column
                      className="has-content-spaced-between"
                      widescreen={{ size: 11 }}
                    >
                      <legend>
                        <Title textAlign="centered">{t('sign-in')}</Title>
                        <Title subtitle textAlign="centered">
                          {t('or')}{' '}
                          <Link to="/register">{t('create-account')}</Link>
                        </Title>
                      </legend>

                      <Column.Group centered>
                        <Column size={11}>
                          <Shake duration={500} when={error}>
                            <fieldset disabled={isLoading}>
                              <Column.Group>
                                <Column>
                                  <LoginProviderButton provider="google" />
                                </Column>
                                <Column>
                                  <LoginProviderButton provider="github" />
                                </Column>
                              </Column.Group>

                              <Divider data-content={t('or')} />

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

                                {error && error.includes('mail') && (
                                  <Fade>
                                    <Help color="danger">{t(error)}</Help>
                                  </Fade>
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
                                  />
                                  <ValidityIconLeft
                                    type="password"
                                    value={password}
                                  />
                                </Control>

                                {error && error.includes('password') && (
                                  <Fade>
                                    <Help color="danger">{t(error)}</Help>
                                  </Fade>
                                )}
                              </Field>

                              <Field>
                                <Control>
                                  <Checkbox
                                    name="rememberMe"
                                    id="remember-me"
                                    onChange={handleChange}
                                    circled
                                    checked={data.rememberMe}
                                  />
                                  <Label htmlFor="remember-me">
                                    {t('remember-me')}
                                  </Label>
                                </Control>
                                {/*error && error === 'data.invalid' && (
                                  <Fade>
                                    <Help color="danger">{errors[error]}</Help>
                                  </Fade>
                                )*/}
                              </Field>

                              <Button
                                color="primary"
                                state={isLoading ? 'loading' : undefined}
                                fullwidth
                                disabled={isDisabled}
                                type="submit"
                                data-testid="sign-in"
                              >
                                {t('sign-in')}
                              </Button>

                              <br />

                              <div className="has-text-centered">
                                <Title
                                  className="has-text-grey"
                                  size={6}
                                  as={Link}
                                  to="/reset-password"
                                >
                                  {t('forgot-password')}
                                </Title>
                              </div>
                            </fieldset>
                          </Shake>
                        </Column>
                      </Column.Group>

                      <p className="has-text-centered has-text-grey">
                        {t('dont-have-an-account')}{' '}
                        <Link to="/register">{t('sign-up')}</Link>
                      </p>
                    </Column>
                  </Column.Group>
                </form>
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
