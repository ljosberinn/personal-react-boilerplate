import type { I18nextResources } from '../../../karma/client/i18n';
// DE
import de_auth from '../../../public/static/locales/de/auth.json';
import de_i18n from '../../../public/static/locales/de/i18n.json';
import de_serviceWorker from '../../../public/static/locales/de/serviceWorker.json';
import de_theme from '../../../public/static/locales/de/theme.json';
// EN
import en_auth from '../../../public/static/locales/en/auth.json';
import en_i18n from '../../../public/static/locales/en/i18n.json';
import en_serviceWorker from '../../../public/static/locales/en/serviceWorker.json';
import en_theme from '../../../public/static/locales/en/theme.json';

export const i18nCache: I18nextResources = {
  de: {
    auth: de_auth,
    i18n: de_i18n,
    serviceWorker: de_serviceWorker,
    theme: de_theme,
  },
  en: {
    auth: en_auth,
    i18n: en_i18n,
    serviceWorker: en_serviceWorker,
    theme: en_theme,
  },
};
