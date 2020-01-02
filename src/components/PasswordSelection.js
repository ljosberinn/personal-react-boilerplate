import React, { useCallback, useState, useEffect, memo } from 'react';
import { ValidityIconLeft, Icon, Field } from '.';
import { validate, pattern } from '../utils/validators';
import { Message, Label, Help, Input, Control, Block } from 'rbx';
import { stringContainsNumber, stringContainsLetter } from '../utils';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './PasswordSelection.module.scss';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

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
 * @returns {React.NamedExoticComponent<{
 * handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 * password: string,
 * confirmPassword: string,
 * isLoading: boolean,
 * error: string|null
 * }>} PasswordSelection
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
          <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>

          <Control iconLeft loading={isLoading}>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
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
              data-testid="confirmPassword"
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
 * @returns {React.FC<{
 *  password: string,
 * t: import('i18next').TFunction
 * }>} PasswordCriteria
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
 * @returns {React.FC<{
 * isFulfilled: boolean,
 * info: string
 * }>} PasswordCriteriaInformation
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
