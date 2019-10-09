import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { validate } from '../../../utils/validators';
import { ValidityIconLeft, Required, Field } from '../../../components';
import {
  Column,
  Title,
  Section,
  Image,
  Label,
  Button,
  Control,
  Input,
} from 'rbx';
import { ForgotPasswordSvg } from '../../../assets/svg';

function ResetPasswordRoute() {
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
    <form
      className="has-content-spaced-between"
      spellCheck={false}
      onSubmit={handleSubmit}
    >
      <legend>
        <Title textAlign="centered">Reset Password</Title>
      </legend>

      <Image.Container size="16by9">
        <ForgotPasswordSvg />
      </Image.Container>

      <Column.Group centered>
        <Column size={10}>
          <Title size={5} as="p" textWeight="normal">
            Enter your email address and we'll send you an email with
            instructions to reset your password.
          </Title>

          <Section paddingless>
            <fieldset disabled={isLoading}>
              <Field isFloatingLabel>
                <Label htmlFor="mail">
                  Email address
                  <Required />
                </Label>

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

              <Required.Hint />

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
          </Section>
        </Column>
      </Column.Group>
      <p className="has-text-centered has-text-grey">
        Forget it, send me back to the <Link to="/login">Sign in</Link> screen.
      </p>
    </form>
  );
}

export default ResetPasswordRoute;
