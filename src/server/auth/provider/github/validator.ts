import { Profile as GithubProfile } from 'passport-github2';

/**
 * Determines whether the given object matches the GithubProfile interface
 *
 * @param {object} profile
 */
export const isGithubProfile = (profile: object): profile is GithubProfile =>
  'profileUrl' in profile;
