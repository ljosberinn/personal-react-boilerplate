import React, { useState, useCallback, useContext } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import { validate, pattern } from '../../../utils/validators';
import { ValidityIconLeft, Checkbox, Field } from '../../../components';
import {
  Card,
  Column,
  Title,
  Label,
  Help,
  Button,
  Control,
  Section,
  Input,
} from 'rbx';
import { Fade } from 'react-reveal';
import Shake from 'react-reveal/Shake';
import styles from './Login.module.scss';
import Helmet from 'react-helmet';
import { AuthContext } from '../../../context/AuthContext';

const errors = {
  'mail.invalid': 'Please enter a valid mail.',
  'password.insecure': 'Please provide a valid password.',
  'data.invalid': 'The provided mail or password is invalid.',
};

const initialState = {
  mail: '',
  password: '',
  rememberMe: false,
};

function LoginRoute() {
  const { user, login } = useContext(AuthContext);

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

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      setIsLoading(true);

      if (data.rememberMe) {
        localStorage.setItem('brandName', JSON.stringify({ mail: data.mail }));
      }

      try {
        await login(data.mail, data.password);
      } catch (error) {
        if (data.rememberMe) {
          localStorage.removeItem('brandName');
        }
        setError('data.invalid');
        setIsLoading(false);
      }
    },
    [data.mail, data.password, data.rememberMe, login],
  );

  const { mail, password } = data;

  const isDisabled =
    mail.length === 0 ||
    password.length === 0 ||
    !validate.mail(mail) ||
    !validate.password(password);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Login | {process.env.REACT_APP_BRAND_NAME}</title>
      </Helmet>
      <Section className={styles.container}>
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
                                {error && error.indexOf('mail') > -1 && (
                                  <Fade>
                                    <Help color="danger">{errors[error]}</Help>
                                  </Fade>
                                )}
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

                                {error && error.indexOf('password') > -1 && (
                                  <Fade>
                                    <Help color="danger">{errors[error]}</Help>
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
                                    Remember me
                                  </Label>
                                </Control>
                                {error && error === 'data.invalid' && (
                                  <Fade>
                                    <Help color="danger">{errors[error]}</Help>
                                  </Fade>
                                )}
                              </Field>

                              <Field kind="grouped">
                                <Button
                                  color="primary"
                                  state={isLoading ? 'loading' : undefined}
                                  fullwidth
                                  disabled={isDisabled}
                                >
                                  Sign in
                                </Button>
                              </Field>

                              <div className="has-text-centered">
                                <Title
                                  className="has-text-grey"
                                  size={7}
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

export default LoginRoute;
