import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { SITE_URL, BRAND_NAME } from '../constants/env';
import languages from '../constants/languages';

/**
 *
 * @returns {React.FC<{
 * children: React.ReactChildren
 * }>} TemplatedHelmet
 */
export default function TemplatedHelmet({ children }) {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <Helmet titleTemplate={`%s | ${BRAND_NAME}`}>
      <html lang={language} />
      <link rel="canonical" href={SITE_URL} />
      {languages
        .filter(lng => lng !== 'en')
        .map(lng => (
          <link
            rel="alternate"
            href={[SITE_URL, lng].join('/')}
            hrefLang={lng}
            key={lng}
          />
        ))}
      {children}
    </Helmet>
  );
}
