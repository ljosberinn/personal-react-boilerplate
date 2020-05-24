import { Profile } from 'passport';

export interface GoogleProfile extends Profile {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  language: string;
  picture: string;
  sub: string;
  verified: boolean;
}

/**
 * Determines whether the given object matches the GoogleProfile interface
 *
 * @param {object} profile
 */
export const isGoogleProfile = (profile: object): profile is GoogleProfile =>
  [
    'email',
    'email_verified',
    'family_name',
    'given_name',
    'language',
    'picture',
    'sub',
    'verified',
  ].every(key => key in profile);
