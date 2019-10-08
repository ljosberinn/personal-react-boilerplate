import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../../utils/validators';
import {
  PasswordSelection,
  ValidityIconLeft,
  Required,
  Checkbox,
} from '../../components';
import {
  Column,
  Tag,
  Title,
  Section,
  Help,
  Field,
  Label,
  Button,
  Image,
  Control,
  Input,
} from 'rbx';
import { ProfileSvg, MailSvg } from '../../assets/svg';
import Shake from 'react-reveal/Shake';
import Fade from 'react-reveal/Fade';

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
    <Column className="has-content-vspaced has-padding-large has-background-white fade-in">
      <div>
        <Title textAlign="centered">Create your account</Title>
        <Title subtitle textAlign="centered">
          or <Link to="/login">sign in</Link>
        </Title>
      </div>

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
                handleSubmit,
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
    </Column>
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
  handleSubmit,
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

  return (
    <Shake duration={500} when={error}>
      <Section paddingless>
        <form
          spellCheck={false}
          autoCorrect="off"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
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
                required
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
              <ValidityIconLeft type="mail" value={mail} />
            </Control>

            {error && error.indexOf('mail') > -1 && (
              <Fade>
                <Help color="danger">{errors[error]}</Help>
              </Fade>
            )}
          </Field>

          <PasswordSelection
            {...{
              handleChange,
              isLoading,
              password,
              confirmPassword,
              error,
            }}
          />

          <Field>
            <Control>
              <Checkbox
                id="tos"
                name="tos"
                required
                onChange={handleChange}
                disabled={isLoading}
              />
              <Label htmlFor="tos">
                I agree to the{' '}
                <Link to="/tos">
                  Terms of Service.
                  <Required />
                </Link>
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
        </form>
      </Section>
    </Shake>
  );
}

export default RegisterRoute;
