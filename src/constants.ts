export const REPOSITORY_LINK = process.env.NEXT_PUBLIC_REPO_LINK!;

/* i18n start */
export const ENABLED_LANGUAGES = process.env.NEXT_PUBLIC_ENABLED_LANGUAGES!.split(
  ','
);

export const SUPPORTED_LANGUAGES_MAP = ENABLED_LANGUAGES.reduce<{
  [key: string]: string;
}>((carry, lang) => {
  carry[lang] = lang;
  return carry;
}, {});

/* i18n end */

/* utils start */
export const IS_BROWSER = typeof window !== 'undefined';
export const IS_PROD = process.env.NODE_ENV === 'production';
/* utils end */
