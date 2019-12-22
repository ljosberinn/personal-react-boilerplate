import React from 'react';
import { validate } from '../../../utils/validators';
import {
  ValidityIconLeft,
  Checkbox,
  Field,
  LoginProviderButton,
} from '../../../components';
import PasswordSelection from './PasswordSelection';
import {
  Column,
  Block,
  Help,
  Label,
  Button,
  Divider,
  Control,
  Input,
} from 'rbx';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import { Trans } from 'react-i18next';
import { Fade } from 'react-awesome-reveal';
import Shake from 'react-reveal/Shake';

/**
 *
 * @returns {React.FC<{
 * error: string,
 * handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 * isLoading: boolean,
 * mail: string,
 * password: string,
 * confirmPassword: string,
 * tos: boolean,
 * t: import('i18next').TFunction
 * }>} RegistrationForm
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
        <Column.Group>
          <Column>
            <LoginProviderButton provider="google" />
          </Column>
          <Column>
            <LoginProviderButton provider="github" />
          </Column>
        </Column.Group>

        <Divider data-content={t('login:or')} />

        <Field>
          <Label htmlFor="mail">{t('login:email-address')}</Label>

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
                  <Link to={ROUTES.RESET_PASSWORD.normalizedPath}>
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
                i18nKey="agree-to-tos"
                ns="registration"
              >
                I agree to the{' '}
                <Link to={ROUTES.TOS.normalizedPath}>
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
            {t('login:sign-up')}
          </Button>
        </Field>
      </fieldset>
    </Shake>
  );
}
