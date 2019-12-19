import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import {
  ValidityIconLeft,
  Checkbox,
  Field,
  LoginProviderButton,
  Loader,
  TemplatedHelmet,
} from '../../../components';
import PasswordSelection from './PasswordSelection';
import {
  Column,
  Content,
  Block,
  Tag,
  Title,
  Section,
  Help,
  Label,
  Card,
  Message,
  Button,
  Image,
  Divider,
  Control,
  Input,
} from 'rbx';
import { MailSvg } from '../../../assets/svg';
import Shake from 'react-reveal/Shake';
import { Fade } from 'react-awesome-reveal';
import * as ROUTES from '../../../constants/routes';
import { errors } from './errors';
import RedirectToHome from '../../RedirectToHome';
import { useIdentityContext } from 'react-netlify-identity';
import CountUp from 'react-countup';

/**
 * @returns {React.FC} RegisterRoute
 */
export default function RegisterRoute() {
  const { signupUser, isLoggedIn, isConfirmedUser } = useIdentityContext();

  const [data, setData] = useState({
    mail: '',
    password: '',
    confirmPassword: '',
    tos: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successfullyRegistered, setSuccsesfullyRegistered] = useState(false);

  const handleChange = useCallback(({ target: { name, type, value } }) => {
    switch (type) {
      case 'checkbox':
        setData(data => ({ ...data, [name]: !data[name] }));
        break;
      default:
        setData(data => ({ ...data, [name]: value }));
        break;
    }
  }, []);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      setIsLoading(true);

      try {
        await signupUser(data.mail, data.password);
        setSuccsesfullyRegistered(true);
      } catch (error) {
        console.log(error);
        setError(error.message);
        setIsLoading(false);
      }
    },
    [signupUser, data.mail, data.password],
  );

  if (isLoggedIn && isConfirmedUser) {
    return <RedirectToHome />;
  }

  return (
    <>
      <TemplatedHelmet>
        <title>Registration</title>
      </TemplatedHelmet>
      <Section className="register-bg">
        <Column.Group centered>
          <Column widescreen={{ size: 5 }} tablet={{ size: 8 }}>
            <Card>
              <Card.Content>
                <form
                  spellCheck={false}
                  autoCorrect="off"
                  onSubmit={handleSubmit}
                >
                  <Column.Group centered>
                    <Column
                      className="has-content-spaced-between"
                      widescreen={{ size: 11 }}
                    >
                      <legend>
                        <Title textAlign="centered">
                          {successfullyRegistered
                            ? 'Almost there! Please verify your mail'
                            : 'Create your account'}
                        </Title>
                      </legend>

                      <br />

                      <Column.Group centered>
                        <Column size={11}>
                          <Content>
                            {successfullyRegistered ? (
                              <RegistrationSuccess
                                mail={data.mail}
                                password={data.password}
                              />
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
                          </Content>
                        </Column>
                      </Column.Group>

                      {!successfullyRegistered && (
                        <p className="has-text-centered has-text-grey">
                          Already have an account?{' '}
                          <Link to={ROUTES.LOGIN.normalizedPath}>Sign in</Link>
                        </p>
                      )}
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

const REGISTRATION_CONFIRMATION_INTERVAL_SECONDS = 15;

function RegistrationSuccess({ mail, password }) {
  const { loginUser } = useIdentityContext();

  const [attempt, setAttempt] = useState(false);

  useEffect(() => {
    let timeout;

    (async function() {
      if (attempt) {
        try {
          await loginUser(mail, password, true);
          setAttempt(false);
        } catch (error) {
          setAttempt(false);
        }
      } else if (!timeout) {
        timeout = setTimeout(() => {
          setAttempt(true);
        }, REGISTRATION_CONFIRMATION_INTERVAL_SECONDS * 1000);
      }
    })();

    return () => timeout && clearTimeout(timeout);
  }, [attempt, loginUser, mail, password]);

  return (
    <Fade>
      <Image.Container size="16by9">
        <MailSvg />
      </Image.Container>

      <Message>
        <Message.Body textAlign="centered">
          <p>
            You have successfully registered but have not yet confirmed your
            mail.
            <br />A message was sent to
          </p>
          <p>
            <Tag color="info">{mail}</Tag>
          </p>
          <p>just now. Please confirm your mail to proceed.</p>

          <p>
            Trying again{' '}
            {!attempt && (
              <>
                in...{' '}
                <CountUp
                  start={REGISTRATION_CONFIRMATION_INTERVAL_SECONDS}
                  end={0}
                  useEasing={false}
                  duration={REGISTRATION_CONFIRMATION_INTERVAL_SECONDS}
                />
              </>
            )}
          </p>
          {attempt && <Loader />}
        </Message.Body>
      </Message>
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
    !validate.password(password) ||
    !passwordsAreMatching ||
    !validate.mail(mail) ||
    !tos;

  const hasMailError = error && error.includes('mail');

  return (
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
              required
              autoFocus
              autoComplete="username"
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

        <Block>
          <Field>
            <Control>
              <Checkbox
                id="tos"
                name="tos"
                required
                disabled={isLoading}
                onChange={handleChange}
                circled
              />
              <Label htmlFor="tos">
                I agree to the{' '}
                <Link to={ROUTES.TOS.normalizedPath}>Terms of Service</Link>.
              </Label>
            </Control>
          </Field>
        </Block>

        <Field>
          <Button
            type="submit"
            color="primary"
            state={isLoading ? 'loading' : undefined}
            disabled={isDisabled}
            fullwidth
          >
            Sign up
          </Button>
        </Field>
      </fieldset>
    </Shake>
  );
}
