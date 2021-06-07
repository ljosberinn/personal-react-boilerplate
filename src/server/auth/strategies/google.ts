import type {
  OAuth2RedirectHandler,
  OAuth2CallbackHandler,
} from '../../../client/context/AuthContext/types';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../../constants';
import { BAD_REQUEST } from '../../../utils/statusCodes';
import type { OAuth2Response } from '../types';
import { getOAuth2Data, redirect } from '../utils';

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

const client_id = GOOGLE_CLIENT_ID;
const client_secret = GOOGLE_CLIENT_SECRET;

const authorizationUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
const accessTokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
const profileDataUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
const scope = ['openid', 'profile', 'email'].join(' ');

const getProfileData = async ({
  token_type,
  access_token,
}: OAuth2Response): Promise<GoogleProfile> => {
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

export const redirectToGoogle: OAuth2RedirectHandler = (
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

export const processGoogleCallback: OAuth2CallbackHandler<GoogleProfile> =
  async (req, res, { redirect_uri, code }) => {
    const { prompt } = req.query;

    if (!prompt || Array.isArray(prompt)) {
      res.status(BAD_REQUEST);

      return null;
    }

    try {
      const oauthResponse = await getOAuth2Data<{ prompt: string }>(
        accessTokenUrl,
        {
          client_id,
          client_secret,
          code,
          prompt,
          redirect_uri,
        }
      );

      return await getProfileData(oauthResponse);
    } catch {
      return null;
    }
  };
