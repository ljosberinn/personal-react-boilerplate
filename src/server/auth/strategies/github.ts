import type {
  OAuth2CallbackHandler,
  OAuth2RedirectHandler,
} from '../../../client/context/AuthContext/types';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../../constants';
import type { OAuth2Response } from '../types';
import { getOAuth2Data, redirect } from '../utils';

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
  created_at: string;
  updated_at: string;
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

const client_id = GITHUB_CLIENT_ID;
const client_secret = GITHUB_CLIENT_SECRET;

const authorizationUrl = 'https://github.com/login/oauth/authorize';
const accessTokenUrl = 'https://github.com/login/oauth/access_token';
const profileDataUrl = 'https://api.github.com/user';
const scope = ['user'].join(' ');

const getProfileData = async ({
  access_token,
}: OAuth2Response): Promise<GitHubProfile> => {
  const params = new URLSearchParams({
    access_token,
  }).toString();

  const url = `${profileDataUrl}?${params}`;
  const authorization = `token ${access_token}`;

  const response = await fetch(url, {
    headers: {
      authorization,
    },
  });

  return response.json();
};

export const redirectToGitHub: OAuth2RedirectHandler = (
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

export const processGitHubCallback: OAuth2CallbackHandler<GitHubProfile> =
  async (_, __, { redirect_uri, code }) => {
    try {
      const oauthResponse = await getOAuth2Data(
        accessTokenUrl,
        {
          client_id,
          client_secret,
          code,
          redirect_uri,
        },
        {
          Accept: 'application/json',
        }
      );

      return await getProfileData(oauthResponse);
    } catch {
      return null;
    }
  };
