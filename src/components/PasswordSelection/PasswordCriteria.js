import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Message, Help } from 'rbx';
import React from 'react';

import { stringContainsNumber, stringContainsLetter } from '../../utils';
import styles from './PasswordSelection.module.scss';

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
];

/**
 *
 * @param {{
 * password: string,
 * t: import('i18next').TFunction
 * }}
 */
export default function PasswordCriteria({ password, t }) {
  const fulfilledCriteriaArr = criteria.map(({ validate }) =>
    validate(password),
  );
  const fulfilledCriteria = fulfilledCriteriaArr.filter(Boolean).length;

  return (
    <Message>
      <Message.Body
        className={classnames(
          styles.smallBox,
          fulfilledCriteria === criteria.length && 'anim-opacity-to-40',
        )}
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

PasswordCriteria.propTypes = {
  password: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

/**
 *
 * @param {{
 * isFulfilled: boolean,
 * info: string,
 * t: import('i18next').TFunction
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

PasswordCriteriaInformation.propTypes = {
  isFulfilled: PropTypes.bool.isRequired,
  info: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};
