import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

import type { I18nextResources } from '../src/client/karma/i18n';

/**
 * reads top level `locales` folder, retrieving all! locales, namespaces and
 * corresponding translations dynamically.
 *
 * if you want to use `ENABLED_LANGUAGES` only in your tests, replace
 *
 * `readdirSync(resolve('locales'))`
 * with
 * `ENABLED_LANGUAGES`
 */
export const i18nCache = Object.fromEntries(
  readdirSync(resolve('locales')).map((locale) => {
    const namespaces = Object.fromEntries(
      readdirSync(resolve('locales', locale)).map((file) => {
        const bundle = JSON.parse(
          readFileSync(resolve('locales', locale, file), 'utf-8')
        );
        const namespace = file.replace('.json', '');

        return [namespace, bundle];
      })
    );

    return [locale, namespaces];
  })
) as I18nextResources;
