import type {
  ExternalProvider,
  OAuth2RedirectHandler,
  OAuth2CallbackHandler,
  User,
} from '../../../client/context/AuthContext/types';
import { ENABLED_PROVIDER } from '../../../constants';
import {
  BAD_REQUEST,
  FOUND_MOVED_TEMPORARILY,
  INTERNAL_SERVER_ERROR,
} from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import { encryptSession, setSessionCookie } from '../cookie';
import {
  redirectToBattleNet,
  processBattleNetCallback,
} from '../strategies/battlenet';
import type { BattleNetRegion } from '../strategies/battlenet';
import {
  redirectToDiscord,
  processDiscordCallback,
} from '../strategies/discord';
import {
  redirectToFacebook,
  processFacebookCallback,
} from '../strategies/facebook';
import { redirectToGitHub, processGitHubCallback } from '../strategies/github';
import { redirectToGoogle, processGoogleCallback } from '../strategies/google';
import { buildBaseRedirectUrl, getOrigin } from '../utils';

const redirectHandlerMap: Record<ExternalProvider, OAuth2RedirectHandler> = {
  battlenet: redirectToBattleNet,
  discord: redirectToDiscord,
  facebook: redirectToFacebook,
  github: redirectToGitHub,
  google: redirectToGoogle,
};

const callbackHandlerMap: Record<
  ExternalProvider,
  OAuth2CallbackHandler<User>
> = {
  battlenet: processBattleNetCallback,
  discord: processDiscordCallback,
  facebook: processFacebookCallback,
  github: processGitHubCallback,
  google: processGoogleCallback,
};

type ExpectedQueryParams = {
  init?: string;
  __nextLocale: string;
  type: ExternalProvider;
  region?: BattleNetRegion;
  // only present if in callback from external provider
  code?: string;
  error?: string;
  prompt?: string;
};

type Request = {
  query: {
    init?: string;
  };
};

export const providerHandler: RequestHandler<undefined, Request> = async (
  req,
  res,
  next
) => {
  const { type, code, error } = req.query as ExpectedQueryParams;

  if (ENABLED_PROVIDER.includes(type)) {
    const origin = getOrigin(req);
    const redirect_uri = buildBaseRedirectUrl(origin, type);

    if ('init' in req.query) {
      const redirectHandler = redirectHandlerMap[type];
      redirectHandler(req, res, redirect_uri);

      res.end();
      return;
    }

    if (!code || Array.isArray(code) || error) {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      res.status(BAD_REQUEST).end();
      return;
    }

    const callbackHandler = callbackHandlerMap[type];
    const profile = await callbackHandler(req, res, {
      code,
      redirect_uri,
    });

    res.status(profile ? FOUND_MOVED_TEMPORARILY : INTERNAL_SERVER_ERROR);

    if (profile) {
      const token = encryptSession(profile);
      setSessionCookie(token, res);

      res.setHeader('Location', origin);
    }

    res.end();
    return;
  }

  next();
};
