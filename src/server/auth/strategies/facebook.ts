import type {
  OAuthRedirectHandler,
  OAuthCallbackHandler,
} from '../../../client/context/AuthContext/types';
import { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from '../../../constants';
import { FOUND_MOVED_TEMPORARILY } from '../../../utils/statusCodes';
import type { OAuth2GetParams, OAuth2Response } from '../types';
import { getOAuth2Data } from '../utils';

export type FacebookProfile = {
  id: string;
  name: string;
};

const buildRedirectUrl = (redirect_uri: string) => {
  const params = new URLSearchParams({
    client_id: FACEBOOK_CLIENT_ID,
    redirect_uri,
    response_type: 'code',
    scope: '',
  }).toString();

  return `https://www.facebook.com/v7.0/dialog/oauth?${params}`;
};

const getProfileData = async ({
  token_type,
  access_token,
}: OAuth2Response): Promise<FacebookProfile> => {
  const params = new URLSearchParams({
    access_token,
  }).toString();

  const url = `https://graph.facebook.com/v7.0/me?${params}`;
  const authorization = `${token_type} ${access_token}`;

  const response = await fetch(url, {
    headers: {
      authorization,
    },
  });

  return response.json();
};

export const redirectToFacebook: OAuthRedirectHandler = (
  _,
  res,
  { baseRedirectUrl }
): void => {
  res
    .status(FOUND_MOVED_TEMPORARILY)
    .setHeader('Location', buildRedirectUrl(baseRedirectUrl));
};

export const processFacebookCallback: OAuthCallbackHandler = async (
  _,
  __,
  { baseRedirectUrl: redirect_uri, code }
) => {
  const url = 'https://graph.facebook.com/v7.0/oauth/access_token';
  const params: OAuth2GetParams = {
    client_id: FACEBOOK_CLIENT_ID,
    client_secret: FACEBOOK_CLIENT_SECRET,
    code,
    redirect_uri,
  };

  try {
    const oauthResponse = await getOAuth2Data(url, params);

    return await getProfileData(oauthResponse);
  } catch {
    return null;
  }
};
