import type {
  OAuthCallbackHandler,
  OAuthRedirectHandler,
} from '../../../client/context/AuthContext/types';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../../constants';
import { FOUND_MOVED_TEMPORARILY } from '../../../utils/statusCodes';
import type { OAuth2Response } from '../types';
import { getOAuth2Data } from '../utils';

export type GitHubProfile = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User';
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: null | string;
  hireable: null | string;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: {
    collaborators: number;
    name: 'free';
    private_repos: number;
  };
};

const getProfileData = async ({
  access_token,
}: OAuth2Response): Promise<GitHubProfile> => {
  const params = new URLSearchParams({
    access_token,
  }).toString();

  const url = `https://api.github.com/user?${params}`;
  const authorization = `token ${access_token}`;

  const response = await fetch(url, {
    headers: {
      authorization,
    },
  });

  return response.json();
};

export const redirectToGitHub: OAuthRedirectHandler = (
  _,
  res,
  { baseRedirectUrl }
): void => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: baseRedirectUrl,
    response_type: 'code',
    scope: 'user',
  }).toString();

  const location = `https://github.com/login/oauth/authorize?${params}`;

  res.status(FOUND_MOVED_TEMPORARILY).setHeader('Location', location);
};

export const processGitHubCallback: OAuthCallbackHandler = async (
  _,
  __,
  { baseRedirectUrl: redirect_uri, code }
) => {
  const url = 'https://github.com/login/oauth/access_token';

  const params = {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code,
    redirect_uri,
  };

  const headers = {
    Accept: 'application/json',
  };

  try {
    const oauthResponse = await getOAuth2Data(url, params, headers);

    return await getProfileData(oauthResponse);
  } catch {
    return null;
  }
};
