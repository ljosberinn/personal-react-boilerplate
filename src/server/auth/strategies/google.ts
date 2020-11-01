import type {
  OAuthRedirectHandler,
  OAuthCallbackHandler,
} from '../../../client/context/AuthContext/types';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../../constants';
import {
  BAD_REQUEST,
  FOUND_MOVED_TEMPORARILY,
} from '../../../utils/statusCodes';
import type { OAuth2GetParams, OAuth2Response } from '../types';
import { getOAuth2Data } from '../utils';

export type GoogleProfile = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

const buildRedirectUrl = (redirect_uri: string) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri,
    response_type: 'code',
    scope: ['openid', 'profile', 'email'].join(' '),
  }).toString();

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

const getProfileData = async ({
  token_type,
  access_token,
}: OAuth2Response): Promise<GoogleProfile> => {
  const params = new URLSearchParams({
    access_token,
  }).toString();

  const url = `https://www.googleapis.com/oauth2/v3/userinfo?${params}`;
  const authorization = `${token_type} ${access_token}`;

  const response = await fetch(url, {
    headers: {
      authorization,
    },
  });

  return response.json();
};

export const redirectToGoogle: OAuthRedirectHandler = (
  _,
  res,
  { baseRedirectUrl }
): void => {
  res
    .status(FOUND_MOVED_TEMPORARILY)
    .setHeader('Location', buildRedirectUrl(baseRedirectUrl));
};

export const processGoogleCallback: OAuthCallbackHandler = async (
  req,
  res,
  { baseRedirectUrl: redirect_uri, code }
) => {
  const { prompt } = req.query;

  if (!prompt || Array.isArray(prompt)) {
    res.status(BAD_REQUEST);
    return null;
  }

  const url = 'https://www.googleapis.com/oauth2/v4/token';
  const params: OAuth2GetParams<{ prompt: string }> = {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    code,
    prompt,
    redirect_uri,
  };

  try {
    const oauthResponse = await getOAuth2Data(url, params);

    return await getProfileData(oauthResponse);
  } catch {
    return null;
  }
};
