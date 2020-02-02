import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import { Message, Label, Help, Input, Control, Block } from 'rbx';
import React, { useCallback, useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { stringContainsNumber, stringContainsLetter } from '../utils';
import { validate, pattern, passwordMinLength } from '../utils/validators';

import Field from './Field';
import Icon from './Icon';
import styles from './PasswordSelection.module.scss';
import ValidityIconLeft from './ValidityIconLeft';

const criteria = [
  {
    validate: password => stringContainsLetter(password),
    info: 'passwordCriteriaLetter',
  },
  {
    validate: password => stringContainsNumber(password),
    info: 'passwordCriteriaNumber',
  },
  {
    validate: password => password.length > 7,
    info: 'passwordCriteriaLength',
  },
  /*{
    validate: password => stringContainsSpecialCharacter(password),
    info: (
      <span>
        - must contain at least one special character{' '}
        <Tag>{allowedSpecialCharacters.join(' ')}</Tag>
      </span>
    ),
  },*/
];

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

  const isValidPassword = validate.password(password);

  const hasConfirmPassword =
    password.length > 0 && confirmPassword.length === password.length;
  const passwordsMatch =
    isValidPassword && hasConfirmPassword && password === confirmPassword;

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
          <ValidityIconLeft type="password" value={password} />

          {!isLoading && (
            <Icon
              className="is-clickable"
              align="right"
              icon={type === 'password' ? faEye : faEyeSlash}
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
              disabled={!isValidPassword}
              placeholder={!isValidPassword ? t('enterValidPasswordFirst') : ''}
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
              icon={
                passwordsMatch
                  ? faLock
                  : hasConfirmPassword
                  ? faLockOpen
                  : faLockOpen
              }
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

/**
 *
 * @param {{
 * password: string,
 * t: import('i18next').TFunction
 * }}
 */
function PasswordCriteria({ password, t }) {
  const fulfilledCriteriaArr = criteria.map(({ validate }) =>
    validate(password),
  );
  const fulfilledCriteria = fulfilledCriteriaArr.filter(Boolean).length;

  return (
    <Message>
      <Message.Body
        className={classnames([
          styles.smallBox,
          fulfilledCriteria === criteria.length && 'anim-opacity-to-40',
        ])}
      >
        {criteria.map(({ info }, index) => (
          <PasswordCriteriaInformation
            info={t(info)}
            isFulfilled={fulfilledCriteriaArr[index]}
            t={t}
            key={index}
          />
        ))}
      </Message.Body>
    </Message>
  );
}

/**
 *
 * @param {{
 * isFulfilled: boolean,
 * info: string
 * }}
 */
function PasswordCriteriaInformation({ isFulfilled, info, t }) {
  return (
    <Help
      color={isFulfilled ? 'success' : undefined}
      tooltip={isFulfilled ? undefined : t('fulfillRequirement')}
    >
      {isFulfilled && '✓'} {info}
    </Help>
  );
}
