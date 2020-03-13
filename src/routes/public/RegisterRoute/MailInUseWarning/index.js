import { Help } from 'rbx';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { Trans } from 'react-i18next';

import { useNavigationContext } from '../../../../context';

export default function MailInUseWarning() {
  const {
    routes: { RESET_PASSWORD },
    PreloadingLink,
  } = useNavigationContext();

  return (
    <Fade>
      <Help color="danger">
        <Trans parent="span" ns="registration" i18nKey="mail-in-use">
          An account with this email already exists. Did you{' '}
          <PreloadingLink to={RESET_PASSWORD}>
            forget your password
          </PreloadingLink>
          ?
        </Trans>
      </Help>
    </Fade>
  );
}
