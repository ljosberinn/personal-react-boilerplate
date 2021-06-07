import type {
  OAuth2RedirectHandler,
  OAuth2CallbackHandler,
} from '../../../client/context/AuthContext/types';
import { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from '../../../constants';
import type { OAuth2Response } from '../types';
import { getOAuth2Data, redirect } from '../utils';

export type FacebookProfile = {
  id: string;
  name: string;
};

const client_id = FACEBOOK_CLIENT_ID;
const client_secret = FACEBOOK_CLIENT_SECRET;

const authorizationUrl = 'https://www.facebook.com/v7.0/dialog/oauth';
const accessTokenUrl = 'https://graph.facebook.com/v7.0/oauth/access_token';
const profileDataUrl = 'https://graph.facebook.com/v7.0/me';
const scope = '';

const getProfileData = async ({
  token_type,
  access_token,
}: OAuth2Response): Promise<FacebookProfile> => {
  const params = new URLSearchParams({
    access_token,
  }).toString();

  const url = `${profileDataUrl}?${params}`;
  const authorization = `${token_type} ${access_token}`;

  const response = await fetch(url, {
    headers: {
      authorization,
    },
  });

  return response.json();
};

export const redirectToFacebook: OAuth2RedirectHandler = (
  _,
  res,
  redirect_uri
): void => {
  redirect(res, authorizationUrl, {
    client_id,
    redirect_uri,
    scope,
  });
};

export const processFacebookCallback: OAuth2CallbackHandler<FacebookProfile> =
  async (_, __, { redirect_uri, code }) => {
    try {
      const oauthResponse = await getOAuth2Data(accessTokenUrl, {
        client_id,
        client_secret,
        code,
        redirect_uri,
      });

      return await getProfileData(oauthResponse);
    } catch {
      return null;
    }
  };
