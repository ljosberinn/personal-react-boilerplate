export const REPO_LINK = process.env.REACT_APP_REPO_LINK;
export const BRAND_NAME = process.env.REACT_APP_BRAND_NAME;
export const SITE_URL = process.env.REACT_APP_SITE_URL;
export const ENABLED_LANGUAGES = process.env.REACT_APP_ENABLED_LANGUAGES.split(
  ',',
).sort();
export const ENABLED_PROVIDER = process.env.REACT_APP_ENABLED_PROVIDER.split(
  ',',
);
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
export const DISCORD_LINK = process.env.REACT_APP_DISCORD_LINK;
export const LOGROCKET_ID = process.env.REACT_APP_LOGROCKET_ID;
export const IS_LIVE = process.env.NODE_ENV !== 'development';
