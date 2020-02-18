module.exports = {
  //navigateFallbackWhitelist: [/^\/.netlify/, /^\/_/, /[^/?]+\\.[^/]+$/],
  navigateFallbackBlacklist: [
    new RegExp('^/.netlify'),
    new RegExp('^/_'),
    new RegExp('/[^/?]+\\.[^/]+$'),
  ],
};
