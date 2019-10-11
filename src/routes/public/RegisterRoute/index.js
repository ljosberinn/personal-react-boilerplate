import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import {
  ValidityIconLeft,
  Required,
  Checkbox,
  Field,
} from '../../../components';
import PasswordSelection from './PasswordSelection';
import {
  Column,
  Tag,
  Title,
  Section,
  Help,
  Label,
  Button,
  Image,
  Control,
  Input,
} from 'rbx';
import { ProfileSvg, MailSvg } from '../../../assets/svg';
import Shake from 'react-reveal/Shake';
import { Fade } from 'react-reveal';

export const errors = {
  'mail.duplicate': (
    <span>
      An account with this email already exists. Did you{' '}
      <Link to="/reset-password">forget your password</Link>?
    </span>
  ),
  'mail.registrationPending':
    'This mail already has a recent registration pending.',
  'mail.invalid': 'Please enter a valid mail.',
  'password.unsafe': 'The chosen password is insecure.',
  'password.mismatch': 'Passwords do not match.',
  tos: 'Please agree to the Terms of Service.',
};

function RegisterRoute() {
  const [data, setData] = useState({
    mail: '',
    password: '',
    confirmPassword: '',
    tos: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successfullyRegistered, setSuccsesfullyRegistered] = useState(false);

  const handleChange = useCallback(
    ({ target: { name, type, checked, value } }) => {
      switch (type) {
        case 'checkbox':
          setData(data => ({ ...data, [name]: checked }));
          break;
        default:
          setData(data => ({ ...data, [name]: value }));
          break;
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      //alert(JSON.stringify(data));

      setIsLoading(true);

      setTimeout(() => {
        if (Math.floor(Math.random() * 10) >= 5) {
          const availableErrors = Object.keys(errors);
          setError(
            availableErrors[Math.floor(Math.random() * availableErrors.length)],
          );
          setIsLoading(false);

          return;
        }

        setSuccsesfullyRegistered(true);
        if (error) {
          setError(null);
        }
      }, 1500);
    },
    [error],
  );

  return (
    <form
      className="has-content-spaced-between"
      spellCheck={false}
      autoCorrect="off"
      onSubmit={handleSubmit}
    >
      <legend>
        <Title textAlign="centered">Create your account</Title>
        <Title subtitle textAlign="centered">
          or <Link to="/login">sign in</Link>
        </Title>
      </legend>

      {!successfullyRegistered && (
        <Image.Container size="16by9">
          <ProfileSvg />
        </Image.Container>
      )}

      <Column.Group centered>
        <Column size={10}>
          {successfullyRegistered ? (
            <RegistrationSuccess mail={data.mail} />
          ) : (
            <RegistrationForm
              {...{
                handleChange,
                error,
                isLoading,
                ...data,
              }}
            />
          )}
        </Column>
      </Column.Group>
      <p className="has-text-centered has-text-grey">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}

function RegistrationSuccess({ mail }) {
  return (
    <Fade right>
      <Image.Container size="16by9">
        <MailSvg />
      </Image.Container>

      <Section>
        <Title size={6}>
          A mail was sent to <Tag color="info">{mail}</Tag> containing further
          details!
        </Title>
      </Section>
    </Fade>
  );
}

function RegistrationForm({
  error,
  handleChange,
  isLoading,
  mail,
  password,
  confirmPassword,
  tos,
}) {
  const passwordsAreMatching = password === confirmPassword;

  const isDisabled =
    mail.length === 0 ||
    password.length === 0 ||
    confirmPassword.length === 0 ||
    !passwordsAreMatching ||
    !validate.mail(mail) ||
    !tos;

  const hasMailError = error && error.indexOf('mail') > -1;

  return (
    <Shake duration={500} when={error}>
      <fieldset disabled={isLoading}>
        <Field isFloatingLabel>
          <Label htmlFor="mail">
            <Required>Email address</Required>
          </Label>

          <Control iconLeft loading={isLoading}>
            <Input
              type="mail"
              placeholder="email@example.com"
              name="mail"
              id="mail"
              onInput={handleChange}
              required
              autoComplete="username"
              autoFocus
              color={hasMailError ? 'danger' : undefined}
            />
            <ValidityIconLeft type="mail" value={mail} />
          </Control>

          {hasMailError && (
            <Fade>
              <Help color="danger">{errors[error]}</Help>
            </Fade>
          )}
        </Field>

        <PasswordSelection
          {...{
            handleChange,
            password,
            confirmPassword,
            isLoading,
            error,
          }}
        />

        <Field>
          <Control>
            <Checkbox
              id="tos"
              name="tos"
              required
              disabled={isLoading}
              onChange={handleChange}
            />
            <Label htmlFor="tos">
              <Required>
                I agree to the <Link to="/tos">Terms of Service</Link>.
              </Required>
            </Label>
          </Control>

          {error && error === 'tos' && (
            <Fade>
              <Help color="danger">{errors[error]}</Help>
            </Fade>
          )}
        </Field>

        <Required.Hint />

        <Field kind="grouped">
          <Button
            color="primary"
            state={isLoading ? 'loading' : undefined}
            fullwidth
            disabled={isDisabled}
          >
            Sign up
          </Button>
        </Field>
      </fieldset>
    </Shake>
  );
}

export default RegisterRoute;
