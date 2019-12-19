import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from './LanguageSwitch';

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
    <Helmet titleTemplate={`%s | ${process.env.REACT_APP_BRAND_NAME}`}>
      <html lang={language} />
      <link rel="canonical" href={process.env.REACT_APP_SITE_URL} />
      {availableLanguages
        .filter(lng => lng !== 'en')
        .map(lng => (
          <link
            rel="alternate"
            href={[process.env.REACT_APP_SITE_URL, lng].join('/')}
            hrefLang={lng}
            key={lng}
          />
        ))}
      {children}
    </Helmet>
  );
}
