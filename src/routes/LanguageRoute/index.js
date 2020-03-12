import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';

import { ENABLED_LANGUAGES } from '../../constants/env';
import { withSentry } from '../../hocs';

export default withSentry(function LanguageRoute() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const { replace } = useHistory();
  const lng = pathname.startsWith('/') && pathname.substr(1);

  useEffect(() => {
    if (i18n.language !== lng && ENABLED_LANGUAGES.includes(lng)) {
      i18n.changeLanguage(lng).then(() => replace('/'));
    } else {
      replace('/');
    }
  }, [i18n, lng, replace]);

  return null;
});
