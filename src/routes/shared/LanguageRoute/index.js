import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import languages from '../../../constants/languages';

/**
 * @returns {null}
 */
export default function LanguageRoute() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const { replace } = useHistory();
  const lng = pathname.indexOf('/') === 0 && pathname.substr(1);

  useEffect(() => {
    if (i18n.language !== lng && languages.includes(lng)) {
      i18n.changeLanguage(lng);
    }

    replace('/');
  });

  return null;
}
