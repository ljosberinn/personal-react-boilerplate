import React, { PropsWithChildren } from 'react';
import { Helmet as RealHelmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { ENABLED_LANGUAGES, PROJECT_NAME } from '../../constants/env';

export default function Helmet({ children }: PropsWithChildren<{}>) {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <RealHelmet
      defaultTitle={PROJECT_NAME}
      titleTemplate={`%s | ${PROJECT_NAME}`}
    >
      <html lang={language} />
      {ENABLED_LANGUAGES.filter(lng => lng !== 'en').map(lng => (
        <link
          rel="alternate"
          href={[PROJECT_NAME, lng].join('/')}
          hrefLang={lng}
          key={lng}
        />
      ))}
      {children}
    </RealHelmet>
  );
}
