import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { IS_BROWSER } from '../../../../constants';

export function HtmlLangAttrSynchronizer() {
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    if (IS_BROWSER) {
      const html = document.querySelector('html');

      if (html) {
        html.setAttribute('lang', language);
      }
    }
  }, [language]);

  return null;
}
