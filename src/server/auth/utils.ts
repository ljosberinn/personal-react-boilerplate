import type { IncomingMessage } from 'http';
import type { NextApiResponse } from 'next';

import type { ExternalProvider } from '../../client/context/AuthContext/types';
import { FOUND_MOVED_TEMPORARILY } from '../../utils/statusCodes';
import type { OAuth2GetParams, OAuth2Response } from './types';

/**
 * @see https://github.com/jekrb/next-absolute-url/blob/master/index.ts
 */
export const getOrigin = (req: IncomingMessage): string => {
  const host = (() => {
    const xForwardedHost = req.headers['x-forwarded-host'];

    if (xForwardedHost && !Array.isArray(xForwardedHost)) {
      return xForwardedHost;
    }

    return req.headers.host ?? 'localhost:3000';
  })();

  const protocol =
    req.headers['x-forwarded-proto'] ?? host.includes('localhost')
      ? 'http:'
      : 'https:';

  return `${protocol}//${host}`;
};

export const buildBaseRedirectUrl = (
  origin: string,
  type: ExternalProvider
): string => {
  const params = new URLSearchParams({
    type,
  }).toString();

  return `${origin}/api/v1/auth/provider?${params}`;
};

const commonRequiredOAuthHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

export const getOAuth2Data = async <Params>(
  url: string,
  params: OAuth2GetParams<Params>,
  headers?: Record<string, string>
): Promise<OAuth2Response> => {
  const body = new URLSearchParams({
    ...params,
    grant_type: 'authorization_code',
  }).toString();

  const response = await fetch(url, {
    body,
    headers: {
      ...commonRequiredOAuthHeaders,
      ...headers,
    },
    method: 'POST',
  });

  return response.json();
};

export const redirect = (
  res: NextApiResponse,
  baseUrl: string,
  additionalParams: Record<string, string>
): void => {
  const params = new URLSearchParams({
    ...additionalParams,
    response_type: 'code',
  }).toString();

  const location = `${baseUrl}?${params}`;

  res.status(FOUND_MOVED_TEMPORARILY).setHeader('Location', location);
};
