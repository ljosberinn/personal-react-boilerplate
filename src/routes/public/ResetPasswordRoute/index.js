import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import { ValidityIconLeft, Field, TemplatedHelmet } from '../../../components';
import {
  Column,
  Card,
  Title,
  Section,
  Label,
  Button,
  Control,
  Help,
  Input,
  Content,
  Message,
} from 'rbx';
import { useIdentityContext } from 'react-netlify-identity';
import { Fade } from 'react-awesome-reveal';

const errors = {
  'User not found': 'unknown_user',
};

export default function ResetPasswordRoute() {
  const { requestPasswordRecovery } = useIdentityContext();
  const [mail, setMail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback(({ target: { name, value } }) => {
    setMail(value);
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await requestPasswordRecovery(mail);
      setMailSent(true);

      if (error) {
        setError(null);
      }
    } catch (error) {
      if (error?.json?.msg) {
        const { msg } = error.json;
        setError(errors[msg] ? errors[msg] : 'unknown_error');
      }
      console.error(error);
    }

    setIsLoading(false);
  };

  const isDisabled = mail.length === 0 || !validate.mail(mail);

  return (
    <>
      <TemplatedHelmet>
        <title>Reset Password</title>
      </TemplatedHelmet>
      <Section className="reset-password-bg">
        <Column.Group centered>
          <Column widescreen={{ size: 5 }} tablet={{ size: 8 }}>
            <Card>
              <Card.Content>
                {mailSent ? (
                  <Fade>
                    <Message color="success">
                      <Message.Header>
                        <p>Success</p>
                      </Message.Header>
                      <Message.Body>
                        A mail has been sent. Please check your inbox as well as
                        your spam folder.
                      </Message.Body>
                    </Message>
                  </Fade>
                ) : (
                  <form spellCheck={false} onSubmit={handleSubmit}>
                    <Column.Group centered>
                      <Column
                        className="has-content-spaced-between"
                        widescreen={{ size: 11 }}
                      >
                        <legend>
                          <Title textAlign="centered">Reset Password</Title>
                        </legend>

                        <br />

                        <Column.Group centered>
                          <Column size={11}>
                            <Title size={5} as="p" textWeight="normal">
                              Enter your email address and we'll send you an
                              email with instructions to reset your password.
                            </Title>
                            <Content>
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
                                      autoFocus
                                      required
                                      autoComplete="username"
                                    />
                                    <ValidityIconLeft
                                      type="mail"
                                      value={mail}
                                    />
                                  </Control>
                                </Field>

                                <Field kind="grouped">
                                  <Button
                                    color="primary"
                                    state={isLoading ? 'loading' : undefined}
                                    fullwidth
                                    disabled={isDisabled}
                                  >
                                    Send Password Reset Link
                                  </Button>
                                </Field>

                                {error && <Help color="danger">{error}</Help>}
                              </fieldset>
                            </Content>
                          </Column>
                        </Column.Group>
                        <p className="has-text-centered has-text-grey">
                          Forget it, send me back to the{' '}
                          <Link to="/login">Sign in</Link> screen.
                        </p>
                      </Column>
                    </Column.Group>
                  </form>
                )}
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
