module.exports = {
  navigateFallback: '',
  navigateFallbackWhitelist: [/^\/.netlify/, /^\/_/, /[^/?]+\\.[^/]+$/],
  skipWaiting: false,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'google-fonts-webfonts',
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
  ],
};
