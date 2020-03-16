import React from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigationContext } from '../../context';
import Icon from '../Icon';

export default function AuthenticatedLinks() {
  const { t } = useTranslation('routes');
  const {
    routes: { SETTINGS },
    PreloadingLink,
  } = useNavigationContext();

  if (!SETTINGS) {
    return null;
  }

  return (
    <li>
      <PreloadingLink to={SETTINGS}>
        <Icon svg={SETTINGS.icon} />
        <span>{t(SETTINGS.title)}</span>
      </PreloadingLink>
    </li>
  );
}
