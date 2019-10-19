import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import { ValidityIconLeft, Field } from '../../../components';
import {
  Column,
  Card,
  Title,
  Section,
  Label,
  Button,
  Control,
  Input,
  Content,
} from 'rbx';
import styles from './ResetPassword.module.scss';
import Helmet from 'react-helmet';
export default function ResetPasswordRoute() {
  const [data, setData] = useState({
    mail: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(({ target: { name, value } }) => {
    setData(data => ({ ...data, [name]: value }));
  }, []);

  const handleSubmit = event => {
    event.preventDefault();

    setIsLoading(true);

    alert(JSON.stringify(data));

    setTimeout(() => setIsLoading(false), 1500);
  };

  const { mail } = data;

  const isDisabled = mail.length === 0 || !validate.mail(mail);

  return (
    <>
      <Helmet>
        <title>Reset Password | Brand Name</title>
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
                        <Title textAlign="centered">Reset Password</Title>
                      </legend>

                      <br />

                      <Column.Group centered>
                        <Column size={11}>
                          <Title size={5} as="p" textWeight="normal">
                            Enter your email address and we'll send you an email
                            with instructions to reset your password.
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
                                  <ValidityIconLeft type="mail" value={mail} />
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
              </Card.Content>
            </Card>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
