module.config = {
  navigateFallbackBlacklist: [
    new RegExp('^/.netlify'),
    new RegExp('^/_'),
    new RegExp('/[^/?]+\\.[^/]+$'),
  ],
};
