import { I18nextResourceLocale } from '../../../../src/client/i18n';
import { ENABLED_LANGUAGES } from '../../../../src/constants';
import i18nCache from '../../../../src/server/i18n';
import { BAD_REQUEST, FORBIDDEN } from '../../../../src/utils/statusCodes';
import { RequestHandler } from '../../types';

const i18nGetHandler: RequestHandler<{}, I18nextResourceLocale> = (
  { query: { language } },
  res
) => {
  const [nextLanguage] = language;

  if (
    !nextLanguage ||
    !ENABLED_LANGUAGES.includes(nextLanguage) ||
    Array.isArray(nextLanguage)
  ) {
    return res.status(FORBIDDEN).end();
  }

  const data = i18nCache[nextLanguage];

  if (!data) {
    return res.status(BAD_REQUEST).end();
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(data);
};

export default i18nGetHandler;
