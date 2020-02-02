import { Block, Help, Label, Button, Divider, Control, Input } from 'rbx';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { Trans } from 'react-i18next';
import Shake from 'react-reveal/Shake';
import { Link } from 'react-router-dom';

import {
  ValidityIconLeft,
  Checkbox,
  Field,
  LoginProviderGroup,
  PasswordSelection,
} from '../../../components';
import * as ROUTES from '../../../constants/routes';
import { validate } from '../../../utils/validators';

/**
 *
 * @param {{
 * error: string,
 * handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 * isLoading: boolean,
 * mail: string,
 * password: string,
 * confirmPassword: string,
 * tos: boolean,
 * t: import('i18next').TFunction
 * }}
 */
export default function RegistrationForm({
  error,
  handleChange,
  isLoading,
  mail,
  password,
  confirmPassword,
  tos,
  t,
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

  const mailInUse = error === 'mail-in-use';

  return (
    <Shake duration={500} when={error}>
      <fieldset disabled={isLoading}>
        <LoginProviderGroup />

        <Divider data-content={t('login:orWithMail')} />

        <Field>
          <Label htmlFor="mail">{t('login:email')}</Label>

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
              color={mailInUse ? 'danger' : undefined}
              data-testid="mail"
            />
            <ValidityIconLeft type="mail" value={mail} />
          </Control>

          {mailInUse && (
            <Fade>
              <Help color="danger">
                <Trans parent="span" ns="registration" i18nKey="mail-in-use">
                  An account with this email already exists. Did you{' '}
                  <Link to={ROUTES.RESET_PASSWORD.clientPath}>
                    forget your password
                  </Link>
                  ?
                </Trans>
              </Help>
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
                data-testid="tos"
              />
              <Trans
                parent={Label}
                htmlFor="tos"
                i18nKey="agreeToTos"
                ns="registration"
              >
                I agree to the{' '}
                <Link to={ROUTES.TOS.clientPath}>
                  {{ tos: t('routes:tos') }}
                </Link>
              </Trans>
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
            data-testid="sign-up"
          >
            {t('login:signUp')}
          </Button>
        </Field>
      </fieldset>
    </Shake>
  );
}
