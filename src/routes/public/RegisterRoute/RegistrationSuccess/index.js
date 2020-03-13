import PropTypes from 'prop-types';
import { Image, Message, Tag } from 'rbx';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { Trans } from 'react-i18next';

import { MailSvg } from '../../../../assets/svg';
import styles from './RegistrationSuccess.module.scss';

/**
 *
 * @param {{
 * mail: string
 * }}
 */
export default function RegistrationSuccess({ mail }) {
  return (
    <Fade className={styles.marginTop}>
      <Image.Container size="16by9">
        <MailSvg />
      </Image.Container>

      <Message>
        <Trans
          parent={Message.Body}
          textAlign="centered"
          ns="registration"
          i18nKey="registration-successful"
          mail={mail}
        >
          <p>
            You have successfully registered but still need to confirmed your
            mail.
            <br />A message was sent to
          </p>
          <p>
            <Tag color="info" data-testid="registration-success-mail-hint">
              {{ mail }}
            </Tag>
          </p>
          <p>just now. Please also check your spam folder.</p>
        </Trans>
      </Message>
    </Fade>
  );
}

RegistrationSuccess.propTypes = {
  mail: PropTypes.string.isRequired,
};
