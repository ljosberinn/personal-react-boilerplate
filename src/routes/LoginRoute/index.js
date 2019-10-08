import React, { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { validate, pattern } from '../../utils/validators';
import { ValidityIconLeft, Checkbox, Required } from '../../components';
import {
  Column,
  Title,
  Section,
  Field,
  Label,
  Help,
  Button,
  Control,
  Input,
  Image,
} from 'rbx';
import { AuthSvg } from '../../assets/svg';
import { Fade } from 'react-reveal';
import Shake from 'react-reveal/Shake';

const errors = {
  'mail.invalid': 'Please enter a valid mail.',
  'password.insecure': 'Please provide a valid password.',
  'data.invalid': 'The provided mail or password is invalid.',
};

function LoginRoute() {
  const params = useParams();

  const [data, setData] = useState({
    mail: params.mail && validate.mail(params.mail) ? params.mail : '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback(
    ({ target: { name, type, value, checked } }) => {
      if (type === 'checkbox') {
        setData(data => ({ ...data, [name]: checked }));
        return;
      }

      setData(data => ({ ...data, [name]: value }));
    },
    [],
  );

  const handleSubmit = event => {
    event.preventDefault();

    setIsLoading(true);

    if (Math.floor(Math.random() * 10) >= 5) {
      const availableErrors = Object.keys(errors);
      setError(
        availableErrors[Math.floor(Math.random() * availableErrors.length)],
      );
      setIsLoading(false);

      return;
    }

    alert(JSON.stringify(data));

    setTimeout(() => setIsLoading(false), 1500);
  };

  const { mail, password } = data;

  const isDisabled =
    mail.length === 0 ||
    password.length === 0 ||
    !validate.mail(mail) ||
    !validate.password(password);

  return (
    <Column className="has-content-vspaced has-padding-large has-background-white fade-in">
      <div>
        <Title textAlign="centered">Sign in</Title>
        <Title subtitle textAlign="centered">
          or <Link to="/register">create account</Link>
        </Title>
      </div>

      <Image.Container size="16by9">
        <AuthSvg />
      </Image.Container>

      <Column.Group centered>
        <Column size={10}>
          <Shake duration={500} when={error}>
            <Section paddingless>
              <form spellCheck={false} onSubmit={handleSubmit}>
                <Field>
                  <Label htmlFor="mail">
                    Email address
                    <Required />
                  </Label>

                  <Control iconLeft>
                    <Input
                      type="mail"
                      placeholder="email@example.com"
                      name="mail"
                      id="mail"
                      onInput={handleChange}
                      autoFocus
                      disabled={isLoading}
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
                  <Label htmlFor="password">
                    Password
                    <Required />
                  </Label>

                  <Control iconLeft>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      onInput={handleChange}
                      pattern={pattern.password}
                      disabled={isLoading}
                      required
                      autoComplete="current-password"
                    />
                    <ValidityIconLeft type="password" value={password} />
                  </Control>

                  {error && error.indexOf('password') > -1 && (
                    <Fade>
                      <Help color="danger">{errors[error]}</Help>
                    </Fade>
                  )}
                </Field>

                <Field>
                  <Checkbox
                    name="rememberMe"
                    id="remember-me"
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember-me">Remember me</Label>
                </Field>

                {error && error === 'data.invalid' && (
                  <Fade>
                    <Help color="danger">{errors[error]}</Help>
                  </Fade>
                )}

                <Required.Hint />

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
              </form>
            </Section>
          </Shake>
        </Column>
      </Column.Group>
      <p className="has-text-centered has-text-grey">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </Column>
  );
}

export default LoginRoute;
