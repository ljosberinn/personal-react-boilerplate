import React, { useState, useEffect, memo } from 'react';
import { ValidityIconLeft, Icon, Required } from '../../../components';
import { validate, pattern } from '../../../utils/validators';
import { Field, Label, Help, Input, Control, Progress, Tag } from 'rbx';
import {
  stringContainsNumber,
  stringContainsSpecialCharacter,
  sanitizeClassArray,
  allowedSpecialCharacters,
} from '../../../utils';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Shake from 'react-reveal/Shake';
import Fade from 'react-reveal/Fade';
import styles from './PasswordSelection.module.scss';
import { errors } from '..';

const criteria = [
  {
    validate: password => stringContainsNumber(password),
    info: '- must contain at least one number',
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

const PasswordSelection = memo(
  ({ handleChange, password, confirmPassword, isLoading, error }) => {
    const [type, setType] = useState('password');
    const [infoOpacityIsReduced, setInfoOpacity] = useState(false);

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
      let isSubscribed = true;

      if (progressColor !== 'success') {
        setInfoOpacity(false);
        return;
      }

      setTimeout(() => {
        if (isSubscribed) {
          setInfoOpacity(true);
        }
      }, 250);

      return () => {
        isSubscribed = false;
      };
    }, [progressColor]);

    const isValidPassword = validate.password(password);

    return (
      <>
        <Field>
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

          {error && error === 'password.unsafe' && (
            <Fade>
              <Help color="danger">{errors[error]}</Help>
            </Fade>
          )}
        </Field>

        <div
          className={sanitizeClassArray([
            styles.smallBox,
            infoOpacityIsReduced && 'anim-opacity-to-40',
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

        <Field>
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
                isValidPassword ? '' : 'please first enter a valid password'
              }
              required
              autoComplete="new-password"
            />
            <ValidityIconLeft type="password" value={confirmPassword} />
          </Control>

          {confirmPassword.length > 7 && password !== confirmPassword && (
            <Fade>
              <div>
                <Shake>
                  <Help color="danger">Passwords do not match!</Help>
                </Shake>
              </div>
            </Fade>
          )}

          {error && error === 'password.mismatch' && (
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
