import React, { useState, useEffect, memo } from 'react';
import { ValidityIconLeft, Icon, Field } from '../../../../components';
import { validate, pattern } from '../../../../utils/validators';
import { Message, Label, Help, Input, Control, Block } from 'rbx';
import {
  stringContainsNumber,
  sanitizeClassArray,
  stringContainsLetter,
} from '../../../../utils';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Shake from 'react-reveal/Shake';
import { Fade } from 'react-reveal';
import styles from './PasswordSelection.module.scss';
import { errors } from '../errors';

const criteria = [
  {
    validate: password => stringContainsNumber(password),
    info: 'must contain at least one number',
  },
  {
    validate: password => stringContainsLetter(password),
    info: 'must contain at least one letter',
  },
  {
    validate: password => password.length > 7,
    info: 'must be at least 8 characters long',
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
        <Field>
          <Label htmlFor="password">Password</Label>

          <Message>
            <Message.Body
              className={sanitizeClassArray([
                styles.smallBox,
                fulfilledCriteria === criteria.length && 'anim-opacity-to-40',
              ])}
            >
              {criteria.map(({ info }, index) => (
                <PasswordCriteriaInformation
                  info={info}
                  isFulfilled={fulfilledCriteriaArr[index]}
                  key={index}
                />
              ))}
            </Message.Body>
          </Message>

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

        <Block>
          <Field>
            <Label htmlFor="confirmPassword">Confirm password</Label>

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
              <Shake>
                <Fade>
                  <Help color="danger">{errors['password.mismatch']}</Help>
                </Fade>
              </Shake>
            )}
          </Field>
        </Block>
      </>
    );
  },
);

function PasswordCriteriaInformation({ isFulfilled, info }) {
  return (
    <Help
      color={isFulfilled ? 'success' : undefined}
      tooltip={isFulfilled ? undefined : 'Please fulfill this requirement'}
    >
      {isFulfilled && '✓'} {info}
    </Help>
  );
}

export default PasswordSelection;
