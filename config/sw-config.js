module.exports = {
  //navigateFallbackWhitelist: [/^\/.netlify/, /^\/_/, /[^/?]+\\.[^/]+$/],
  navigateFallbackWhitelist: [
    new RegExp('^/.netlify'),
    new RegExp('^/_'),
    new RegExp('/[^/?]+\\.[^/]+$'),
  ],
};
