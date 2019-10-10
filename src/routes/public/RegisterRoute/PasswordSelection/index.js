import React, { useState, useEffect, memo } from 'react';
import {
  ValidityIconLeft,
  Icon,
  Required,
  Field,
} from '../../../../components';
import { validate, pattern } from '../../../../utils/validators';
import { Label, Help, Input, Control, Progress, Tag } from 'rbx';
import {
  stringContainsNumber,
  stringContainsSpecialCharacter,
  sanitizeClassArray,
  allowedSpecialCharacters,
  stringContainsUppercaseCharacter,
} from '../../../../utils';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Shake from 'react-reveal/Shake';
import { Fade } from 'react-reveal';
import styles from './PasswordSelection.module.scss';
import { errors } from '..';

const criteria = [
  {
    validate: password => stringContainsNumber(password),
    info: '- must contain at least one number',
  },
  {
    validate: password => stringContainsUppercaseCharacter(password),
    info: '- must contain at least one upper case character',
  },
  {
    validate: password => password.length > 7,
    info: '- must be at least 8 characters long',
  },
  {
    validate: password => stringContainsSpecialCharacter(password),
    info: (
      <span>
        - must contain at least one special character{' '}
        <Tag>{allowedSpecialCharacters.join(' ')}</Tag>
      </span>
    ),
  },
];

/**
 * @param {{
 *  handleChange: (e:React.ChangeEvent<HTMLInputElement>) => void,
 *  password: string,
 *  confirmPassword: string,
 *  isLoading: boolean,
 *  error: string|null
 * }} props
 */
const PasswordSelection = memo(
  ({ handleChange, password, confirmPassword, isLoading, error }) => {
    const [type, setType] = useState('password');

    const fulfilledCriteriaArr = criteria.map(({ validate }) =>
      validate(password),
    );
    const fulfilledCriteria = fulfilledCriteriaArr.filter(Boolean).length;

    const progressColor =
      fulfilledCriteria === 1
        ? 'danger'
        : fulfilledCriteria < 3
        ? 'warning'
        : 'success';

    useEffect(() => {
      // hide password on submit
      if (isLoading && type === 'text') {
        setType('password');
      }
    }, [isLoading, type]);

    const isValidPassword = validate.password(password);

    const passwordIsUnsafe = error && error === 'password.unsafe';
    const passwordsDoNotMatch =
      (confirmPassword.length > 7 && password !== confirmPassword) ||
      (error && error === 'password.mismatch');

    return (
      <>
        <Field isFloatingLabel>
          <Label htmlFor="password">
            Password
            <Required />
          </Label>

          <Control iconLeft iconRight={!isLoading} loading={isLoading}>
            <Input
              type={type}
              name="password"
              id="password"
              onInput={handleChange}
              pattern={pattern.password}
              required
              autoComplete="new-password"
              color={passwordIsUnsafe ? 'danger' : undefined}
            />
            <ValidityIconLeft type="password" value={password} />

            {!isLoading && (
              <Icon
                className="is-clickable"
                align="right"
                icon={type === 'password' ? faEye : faEyeSlash}
                onClick={() =>
                  setType(type === 'password' ? 'text' : 'password')
                }
              />
            )}
          </Control>

          {passwordIsUnsafe && (
            <Fade>
              <Help color="danger">{errors[error]}</Help>
            </Fade>
          )}
        </Field>

        <div
          className={sanitizeClassArray([
            styles.smallBox,
            progressColor === 'success' && 'anim-opacity-to-40',
          ])}
        >
          {criteria.map(({ info }, index) => (
            <Help
              color={fulfilledCriteriaArr[index] ? 'success' : undefined}
              key={info}
            >
              {info}
            </Help>
          ))}

          <Help>
            <Progress
              size="small"
              value={fulfilledCriteria}
              color={progressColor}
              max={3}
            />
          </Help>
        </div>

        <Field isFloatingLabel>
          <Label htmlFor="confirmPassword">
            Confirm password
            <Required />
          </Label>

          <Control iconLeft loading={isLoading}>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              onInput={handleChange}
              pattern={pattern.password}
              disabled={!isValidPassword}
              placeholder={
                !isValidPassword ? 'please first enter a valid password' : ''
              }
              required
              autoComplete="new-password"
              color={passwordsDoNotMatch ? 'danger' : undefined}
            />
            <ValidityIconLeft type="password" value={confirmPassword} />
          </Control>

          {passwordsDoNotMatch && (
            <Fade>
              <div>
                <Shake>
                  <Help color="danger">Passwords do not match!</Help>
                </Shake>
              </div>
            </Fade>
          )}

          {passwordsDoNotMatch && (
            <Fade>
              <Help color="danger">{errors[error]}</Help>
            </Fade>
          )}
        </Field>
      </>
    );
  },
);

export default PasswordSelection;
