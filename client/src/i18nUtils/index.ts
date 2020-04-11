import i18n from 'i18next';
export const delayedAddResourceBundle = (bundle: object, ns: string) => {
  i18n.on('initialized', () => {
    Object.entries(bundle).forEach(([slug, data]) => {
      i18n.addResourceBundle(slug, ns, data, true);
    });
  });
};
