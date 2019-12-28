const requiredEnvVariables = [
  'REPO_LINK',
  'BRAND_NAME',
  'SITE_URL',
  'ENABLED_LANGUAGES',
];

const optionalEnvVariables = [
  'SENTRY_DSN',
  'FAUNA_DB_SECRET',
  'LOGROCKET_ID',
  'DISCORD_LINK',
];

export default [...requiredEnvVariables, ...optionalEnvVariables].reduce(
  (carry, envName) => {
    const key = `REACT_APP_${envName}`;

    if (process.env[key] && process.env[key].length > 0) {
      carry[envName] = process.env[key];
    } else if (requiredEnvVariables.includes(envName)) {
      throw new Error(`missing env variable: ${key}`);
    }

    return carry;
  },
  {},
);
