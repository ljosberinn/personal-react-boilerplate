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
import { Fade } from 'react-reveal';
import Shake from 'react-reveal/Shake';
import RedirectToHome from '../../RedirectToHome';
import { Link, useParams } from 'react-router-dom';
import {
  ValidityIconLeft,
  Checkbox,
  GoogleSignInButton,
  TemplatedHelmet,
  GithubSignInButton,
} from '../../../components';
import { useIdentityContext } from 'react-netlify-identity';

const initialState = {
  mail: '',
  password: '',
  rememberMe: false,
};

const errors = {
  'No user found with this email': 'unknown_user',
  'Email not confirmed': 'mail_not_confirmed',
};

export default function LoginRoute() {
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

      const storedData = localStorage.getItem('brandName');

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await loginUser(mail, password, data.rememberMe);
    } catch (error) {
      setError(error);
      console.error(error);
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
        <title>Login</title>
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
                        <Title textAlign="centered">Sign in</Title>
                        <Title subtitle textAlign="centered">
                          or <Link to="/register">create account</Link>
                        </Title>
                      </legend>

                      <Column.Group centered>
                        <Column size={11}>
                          <Shake duration={500} when={error}>
                            <fieldset disabled={isLoading}>
                              <Column.Group>
                                <Column>
                                  <GoogleSignInButton />
                                </Column>
                                <Column>
                                  <GithubSignInButton />
                                </Column>
                              </Column.Group>

                              <Divider data-content="or" />

                              <Field>
                                <Label htmlFor="mail">Email address</Label>

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
                                  />
                                  <ValidityIconLeft type="mail" value={mail} />
                                </Control>
                                {/*error && error.indexOf('mail') > -1 && (
                                  <Fade>
                                    <Help color="danger">{errors[error]}</Help>
                                  </Fade>
                                )*/}
                              </Field>

                              <Field>
                                <Label htmlFor="password">Password</Label>

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
                                  />
                                  <ValidityIconLeft
                                    type="password"
                                    value={password}
                                  />
                                </Control>

                                {/*error && error.indexOf('password') > -1 && (
                                  <Fade>
                                    <Help color="danger">{errors[error]}</Help>
                                  </Fade>
                                )*/}
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
                                    Remember me
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
                              >
                                Sign in
                              </Button>

                              <br />

                              <div className="has-text-centered">
                                <Title
                                  className="has-text-grey"
                                  size={6}
                                  as={Link}
                                  to="/reset-password"
                                >
                                  Forgot password?
                                </Title>
                              </div>
                            </fieldset>
                          </Shake>
                        </Column>
                      </Column.Group>

                      <p className="has-text-centered has-text-grey">
                        Don't have an account?{' '}
                        <Link to="/register">Sign up</Link>
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
