import { Message } from 'rbx';
import React from 'react';
import { Flip } from 'react-awesome-reveal';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

export const SUCCESS_MSG_DISPLAY_SECONDS = 10;

export default function SuccessfulPasswordChange() {
  const { t } = useTranslation('settings');

  return (
    <Flip direction="vertical">
      <Message color="success" data-testid="successful-password-change">
        <Message.Header>
          <span>{t('success')}</span>
          <CountUp
            duration={SUCCESS_MSG_DISPLAY_SECONDS}
            start={SUCCESS_MSG_DISPLAY_SECONDS}
            end={0}
            useEasing={false}
          />
        </Message.Header>
        <Message.Body>{t('changePasswordSuccess')}</Message.Body>
      </Message>
    </Flip>
  );
}
