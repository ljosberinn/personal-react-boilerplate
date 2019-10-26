import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import {
  ValidityIconLeft,
  Checkbox,
  Field,
  GoogleSignInButton,
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
  Button,
  Image,
  Divider,
  Control,
  Input,
} from 'rbx';
import { MailSvg } from '../../../assets/svg';
import Shake from 'react-reveal/Shake';
import { Fade } from 'react-reveal';
import styles from './Registration.module.scss';
import * as ROUTES from '../../../constants/routes';
import Helmet from 'react-helmet';
import { errors } from './errors';
import { useAuth } from '../../../hooks';

export default function RegisterRoute() {
  const { registerWithMailAndPassword, loginWithGoogle } = useAuth();

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
        await registerWithMailAndPassword(data.mail, data.password);
        setSuccsesfullyRegistered(true);
      } catch (error) {
        setError(error.code);
        setIsLoading(false);
      }
    },
    [registerWithMailAndPassword, data.mail, data.password],
  );

  const proxyGoogleSignIn = useCallback(async () => {
    setIsLoading(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [loginWithGoogle]);

  return (
    <>
      <Helmet>
        <title>Registration | {process.env.REACT_APP_BRAND_NAME}</title>
      </Helmet>
      <Section className={styles.container}>
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
                        <Title textAlign="centered">Create your account</Title>
                      </legend>

                      <br />

                      <Column.Group centered>
                        <Column size={11}>
                          <Content>
                            {successfullyRegistered ? (
                              <RegistrationSuccess mail={data.mail} />
                            ) : (
                              <RegistrationForm
                                {...{
                                  handleChange,
                                  proxyGoogleSignIn,
                                  error,
                                  isLoading,
                                  ...data,
                                }}
                              />
                            )}
                          </Content>
                        </Column>
                      </Column.Group>

                      <p className="has-text-centered has-text-grey">
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
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

function RegistrationSuccess({ mail }) {
  return (
    <Fade>
      <Image.Container size="16by9">
        <MailSvg />
      </Image.Container>

      <Section textAlign="centered">
        <p>A mail was sent to</p>
        <Tag color="info">{mail}</Tag>
        <p>containing further details!</p>
      </Section>
    </Fade>
  );
}

function RegistrationForm({
  error,
  handleChange,
  proxyGoogleSignIn,
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

  const hasMailError = error && error.indexOf('mail') > -1;

  return (
    <Shake duration={500} when={error}>
      <fieldset disabled={isLoading}>
        <GoogleSignInButton onClick={proxyGoogleSignIn} />

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
                I agree to the <Link to={ROUTES.TOS}>Terms of Service</Link>.
              </Label>
            </Control>

            {error && error === 'tos' && (
              <Fade>
                <Help color="danger">{errors[error]}</Help>
              </Fade>
            )}
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
