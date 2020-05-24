import { Profile } from 'passport-github2';
export const isGithubProfile = (profile: object): profile is Profile =>
  ['id', 'displayName', 'username', 'profileUrl', 'photos', 'emails'].every(
    key => key in profile
  );
