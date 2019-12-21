import React from 'react';
import { Image, Message, Tag } from 'rbx';
import { MailSvg } from '../../../assets/svg';
import { Fade } from 'react-awesome-reveal';
import { Trans } from 'react-i18next';

/**
 *
 * @returns {React.FC<{
 * mail: string
 * }>} RegistrationSuccess
 */
export default function PasswordSuccess({ mail }) {
  return (
    <Fade>
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
            <Tag color="info">{{ mail }}</Tag>
          </p>
          <p>just now. Please also check your spam folder.</p>
        </Trans>
      </Message>
    </Fade>
  );
}
