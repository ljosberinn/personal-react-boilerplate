import { Block, Label, Button, Divider, Control, Input } from 'rbx';
import React, { lazy } from 'react';
import { Trans } from 'react-i18next';
import Shake from 'react-reveal/Shake';

import {
  ValidityIconLeft,
  Checkbox,
  Field,
  LoginProviderGroup,
  PasswordSelection,
} from '../../../components';
import { withSuspense } from '../../../hocs';
import { useNavigationContext } from '../../../hooks';
import { isValidPassword, isValidMail } from '../../../utils/validators';

const MailInUseWarning = withSuspense(
  lazy(() =>
    import(
      /* webpackChunkName: "registration_form.mail_in_use_warning"*/ './MailInUseWarning'
    ),
  ),
);

/**
 *
 * @param {{
 * error: string;
 * handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 * isLoading: boolean;
 * mail: string;
 * password: string;
 * confirmPassword: string;
 * tos: boolean;
 * t: import('i18next').TFunction;
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
  const {
    routes: { TOS },
    PreloadingLink,
  } = useNavigationContext();
  const passwordsAreMatching = password === confirmPassword;

  const isDisabled =
    mail.length === 0 ||
    password.length === 0 ||
    confirmPassword.length === 0 ||
    !isValidPassword(password) ||
    !passwordsAreMatching ||
    !isValidMail(mail) ||
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

          {mailInUse && <MailInUseWarning />}
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
                <PreloadingLink to={TOS}>
                  {{ tos: t('routes:tos') }}
                </PreloadingLink>
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
