export interface GoogleProfile {
  displayName: string;
  email: string;
  email_verified: boolean;
  emails: { value: string; type: string }[];
  family_name: string;
  given_name: string;
  id: string;
  language: string;
  name: {
    givenName: string;
    familyName: string;
  };
  photos: { value: string; type: string }[];
  picture: string;
  provider: 'google';
  sub: string;
  verified: boolean;
}

export const isGoogleProfile = (profile: object): profile is GoogleProfile =>
  [
    'displayName',
    'email',
    'email_verified',
    'emails',
    'family_name',
    'given_name',
    'id',
    'language',
    'name',
    'photos',
    'picture',
    'provider',
    'sub',
    'verified',
  ].every(key => key in profile);
