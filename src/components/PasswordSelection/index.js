import { Label, Control, Input, Block } from 'rbx';
import React, { useCallback, useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLock, FaLockOpen, FaEye, FaEyeSlash } from 'react-icons/fa';

import {
  isValidPassword,
  pattern,
  passwordMinLength,
} from '../../utils/validators';
import Field from '../Field';
import Icon from '../Icon';
import ValidityIcon from '../ValidityIcon';
import PasswordCriteria from './PasswordCriteria';

/**
 * @param {{
 * handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 * password: string,
 * confirmPassword: string,
 * isLoading: boolean,
 * error: string|null
 * }}
 */

export default memo(function PasswordSelection({
  handleChange,
  password,
  confirmPassword,
  isLoading,
}) {
  const [type, setType] = useState('password');
  const { t } = useTranslation(['registration', 'login']);

  useEffect(() => {
    // hide password on submit
    if (isLoading && type === 'text') {
      setType('password');
    }
  }, [isLoading, type]);

  const handlePasswordVisibilityChange = useCallback(
    () => setType(type => (type === 'text' ? 'password' : 'text')),
    [],
  );

  const passwordIsValid = isValidPassword(password);

  const hasConfirmPassword =
    password.length > 0 && confirmPassword.length === password.length;
  const passwordsMatch =
    passwordIsValid && hasConfirmPassword && password === confirmPassword;

  return (
    <>
      <Field>
        <Label htmlFor="password">{t('login:password')}</Label>

        <PasswordCriteria password={password} t={t} />

        <Control iconLeft iconRight={!isLoading} loading={isLoading}>
          <Input
            type={type}
            name="password"
            id="password"
            onChange={handleChange}
            pattern={pattern.password}
            required
            autoComplete="new-password"
            data-testid="password"
            minLength={passwordMinLength}
          />
          <ValidityIcon align="left" type="password" value={password} />

          {!isLoading && (
            <Icon
              className="is-clickable"
              data-testid="toggle-input-type-icon"
              align="right"
              svg={type === 'password' ? FaEye : FaEyeSlash}
              onClick={handlePasswordVisibilityChange}
            />
          )}
        </Control>
      </Field>

      <Block>
        <Field>
          <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>

          <Control iconLeft loading={isLoading}>
            <Input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              onChange={handleChange}
              pattern={pattern.password}
              disabled={!passwordIsValid}
              placeholder={!passwordIsValid ? t('enterValidPasswordFirst') : ''}
              required
              autoComplete="new-password"
              color={
                passwordsMatch
                  ? undefined
                  : hasConfirmPassword
                  ? 'danger'
                  : undefined
              }
              data-testid="confirm-password"
              minLength={passwordMinLength}
            />

            <Icon
              align="left"
              svg={passwordsMatch ? FaLock : FaLockOpen}
              color={
                passwordsMatch
                  ? 'success'
                  : hasConfirmPassword
                  ? 'danger'
                  : undefined
              }
            />
          </Control>
        </Field>
      </Block>
    </>
  );
});
