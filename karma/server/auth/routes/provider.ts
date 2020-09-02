import absoluteUrl from 'next-absolute-url';
import nextConnect from 'next-connect';

import type { ExternalProvider } from '../../../../karma/client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../../src/constants';
import {
  FOUND_MOVED_TEMPORARILY,
  INTERNAL_SERVER_ERROR,
} from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import { encryptSession, setSessionCookie } from '../cookie';
import { config, getRedirectUrl, getOAuthData, getProfileData } from '../oauth';

const useExternalProvider: RequestHandler = async (req, res, next) => {
  const [provider] = req.query.authRouter as ExternalProvider[];

  if (ENABLED_PROVIDER.includes(provider)) {
    const { authorizationUrl, tokenUrl, profileDataUrl } = config[provider];

    const { origin } = absoluteUrl(req);
    const redirect_uri = `${origin}/api/v1/auth/${provider}`;

    // prepare redirect to provider - no get params given
    if (Object.keys(req.query).length === 1) {
      const url = getRedirectUrl(authorizationUrl, redirect_uri, provider);

      res.status(FOUND_MOVED_TEMPORARILY).setHeader('Location', url);

      return res.end();
    }

    // get params given; must be callback from provider
    const { code, error, prompt } = req.query as {
      [key: string]: string;
    };

    if (!code || Array.isArray(code) || error) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      return res.status(INTERNAL_SERVER_ERROR).end();
    }

    const oauthResponse = await getOAuthData(tokenUrl, {
      code,
      prompt,
      provider,
      redirect_uri,
    });

    const profileJson = await getProfileData(
      profileDataUrl,
      provider,
      oauthResponse
    );

    const token = encryptSession(profileJson);
    setSessionCookie(token, res);

    res.status(FOUND_MOVED_TEMPORARILY).setHeader('Location', origin);

    return res.end();
  }

  next();
};

export const externalProviderHandler = nextConnect().get(useExternalProvider);
