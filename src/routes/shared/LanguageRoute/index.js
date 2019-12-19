import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../../../components/LanguageSwitch';
import { useLocation, useHistory } from 'react-router-dom';

/**
 * @returns {null}
 */
export default function LanguageRoute() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const { replace } = useHistory();
  const lng = pathname.indexOf('/') === 0 && pathname.substr(1);

  useEffect(() => {
    if (i18n.language !== lng && availableLanguages.includes(lng)) {
      i18n.changeLanguage(lng);
    }

    replace('/');
  });

  return null;
}
