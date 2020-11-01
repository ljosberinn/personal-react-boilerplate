import type {
  OAuthCallbackHandler,
  OAuthRedirectHandler,
} from '../../../client/context/AuthContext/types';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../../constants';
import { FOUND_MOVED_TEMPORARILY } from '../../../utils/statusCodes';
import type { OAuth2GetParams, OAuth2Response } from '../types';
import { getOAuth2Data } from '../utils';

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

const buildRedirectUrl = (redirect_uri: string) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri,
    response_type: 'code',
    scope: 'identify email',
  }).toString();

  return `https://discord.com/api/oauth2/authorize?${params}`;
};

const getProfileData = async ({
  token_type,
  access_token,
}: OAuth2Response): Promise<DiscordProfile> => {
  const params = new URLSearchParams({
    access_token,
  }).toString();

  const url = `https://discord.com/api/users/@me?${params}`;
  const authorization = `${token_type} ${access_token}`;

  const response = await fetch(url, {
    headers: {
      authorization,
    },
  });

  return response.json();
};

export const redirectToDiscord: OAuthRedirectHandler = (
  _,
  res,
  { baseRedirectUrl }
): void => {
  res
    .status(FOUND_MOVED_TEMPORARILY)
    .setHeader('Location', buildRedirectUrl(baseRedirectUrl));
};

export const processDiscordCallback: OAuthCallbackHandler = async (
  _,
  __,
  { baseRedirectUrl: redirect_uri, code }
) => {
  const url = 'https://discord.com/api/oauth2/token';
  const params: OAuth2GetParams = {
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    code,
    redirect_uri,
  };

  try {
    const oauthResponse = await getOAuth2Data(url, params);

    return await getProfileData(oauthResponse);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};
