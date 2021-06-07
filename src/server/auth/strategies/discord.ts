import type {
  OAuth2CallbackHandler,
  OAuth2RedirectHandler,
} from '../../../client/context/AuthContext/types';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../../constants';
import type { OAuth2Response } from '../types';
import { getOAuth2Data, redirect } from '../utils';

export type DiscordProfile = {
  avatar: string;
  discriminator: string;
  email: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  public_flags: number;
  username: string;
  verified: boolean;
};

const client_id = DISCORD_CLIENT_ID;
const client_secret = DISCORD_CLIENT_SECRET;

const authorizationUrl = 'https://discord.com/api/oauth2/authorize';
const accessTokenUrl = 'https://discord.com/api/oauth2/token';
const profileDataUrl = 'https://discord.com/api/users/@me';
const scope = ['identify', 'email'].join(' ');

const getProfileData = async ({
  token_type,
  access_token,
}: OAuth2Response): Promise<DiscordProfile> => {
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

export const redirectToDiscord: OAuth2RedirectHandler = (
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

export const processDiscordCallback: OAuth2CallbackHandler<DiscordProfile> =
  async (_, __, { redirect_uri, code }) => {
    try {
      const oauthResponse = await getOAuth2Data(accessTokenUrl, {
        client_id,
        client_secret,
        code,
        redirect_uri,
      });

      return await getProfileData(oauthResponse);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  };
