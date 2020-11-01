import type { CookieSerializeOptions } from 'cookie';

import type {
  OAuthRedirectHandler,
  OAuthCallbackHandler,
} from '../../../client/context/AuthContext/types';
import {
  BATTLENET_CLIENT_ID,
  BATTLENET_CLIENT_SECRET,
  IS_PROD,
} from '../../../constants';
import {
  BAD_REQUEST,
  FOUND_MOVED_TEMPORARILY,
} from '../../../utils/statusCodes';
import { parseCookies, removeCookie, setCookie } from '../cookie';
import type { OAuth2GetParams, OAuth2Response } from '../types';
import { getOAuth2Data } from '../utils';

const scope = 'wow.profile' as const;
const BATTLE_NET_STATE_COOKIE_NAME = 'bnetstateref';

// type CrossLink = {
//   href: string;
// };

// type Class =
//   | 'Hunter'
//   | 'Paladin'
//   | 'Warrior'
//   | 'Mage'
//   | 'Priest'
//   | 'Rogue'
//   | 'Death Knight'
//   | 'Demon Hunter'
//   | 'Shaman'
//   | 'Monk'
//   | 'Warlock';

// type Race =
//   | 'Tauren'
//   | 'Dwarf'
//   | 'Human'
//   | 'Blood Elf'
//   | 'Night Elf'
//   | 'Orc'
//   | 'Undead';

// type Character = {
//   character: CrossLink;
//   faction: {
//     type: 'HORDE' | 'ALLIANCE';
//     name: 'Horde' | 'Alliance';
//   };
//   gender: {
//     type: 'MALE' | 'FEMALE';
//     name: 'Male' | 'Female';
//   };
//   id: number;
//   level: number;
//   name: string;
//   playable_class: {
//     key: CrossLink;
//     id: number;
//     name: Class;
//   };
//   playable_race: {
//     key: CrossLink;
//     id: number;
//     name: Race;
//   };
//   protected_character: CrossLink;
//   realm: {
//     name: string;
//     id: number;
//     slug: string;
//     key: CrossLink;
//   };
// };

// type WorldOfWarcraftAccount = {
//   characters: Character[];
//   id: number;
// };

// type BattleNetProfile = {
//   collections: CrossLink;
//   id: number;
//   wow_accounts: WorldOfWarcraftAccount[];
//   _links: {
//     profile: CrossLink;
//     self: CrossLink;
//     user: CrossLink;
//   };
// };

export type BattleNetRegion = 'eu' | 'us' | 'apac' | 'cn';

const isValidRegion = (region: string): region is BattleNetRegion =>
  ['eu', 'us', 'apac', 'cn'].includes(region);

const buildRedirectUrl = (
  redirect_uri: string,
  region: BattleNetRegion,
  state: string
) => {
  const params = new URLSearchParams({
    client_id: BATTLENET_CLIENT_ID,
    redirect_uri,
    response_type: 'code',
    scope,
    state,
  }).toString();

  if (region === 'cn') {
    return `https://www.battlenet.com.cn/oauth/authorize?${params}`;
  }

  return `https://${region}.battle.net/oauth/authorize?${params}`;
};

const getTokenUrl = (region: BattleNetRegion) => {
  if (region === 'cn') {
    return 'https://www.battlenet.com.cn/oauth/token';
  }

  return `https://${region}.battle.net/oauth/token`;
};

// const getProfileUrl = (region: BattleNetRegion) =>
//   `https://${region}.api.blizzard.com/profile/user/wow`;

// const getProfileData = async (
//   { token_type, access_token }: OAuthResponse,
//   region: BattleNetRegion
// ): Promise<Character[]> => {
//   const params = new URLSearchParams({
//     access_token,
//     namespace: `profile-${region}`,
//     region,
//   }).toString();

//   const url = getProfileUrl(region);
//   const authorization = `${token_type} ${access_token}`;

//   const response = await fetch(`${url}?${params}`, {
//     headers: {
//       authorization,
//     },
//   });

//   const { wow_accounts }: BattleNetProfile = await response.json();

//   const level50Characters = wow_accounts.flatMap((account) =>
//     account.characters.filter((character) => character.level === 50)
//   );

//   return level50Characters;
// };

export const redirectToBattleNet: OAuthRedirectHandler = (
  req,
  res,
  { baseRedirectUrl }
) => {
  const { region } = req.query;

  if (!region || Array.isArray(region) || !isValidRegion(region)) {
    return res.status(BAD_REQUEST).end();
  }

  const state = `${region}-${Math.floor(Math.random() * 100 ** Math.PI)}`;

  const options: CookieSerializeOptions = {
    expires: new Date(Date.now() + 600),
    httpOnly: true,
    maxAge: 600,
    path: '/',
    // required for OAuth2 to work instantly in FF
    sameSite: 'lax',
    secure: IS_PROD,
  };

  setCookie(
    {
      name: BATTLE_NET_STATE_COOKIE_NAME,
      options,
      value: state,
    },
    res
  );

  const url = buildRedirectUrl(baseRedirectUrl, region, state);

  res.status(FOUND_MOVED_TEMPORARILY).setHeader('Location', url);
};

export const processBattleNetCallback: OAuthCallbackHandler = async (
  req,
  res,
  { baseRedirectUrl, code }
) => {
  const [region, persistedState] =
    parseCookies(req)[BATTLE_NET_STATE_COOKIE_NAME]?.split('-') ?? '';
  const { state } = req.query;

  if (
    !region ||
    Array.isArray(region) ||
    !isValidRegion(region) ||
    // state must be present
    !state ||
    Array.isArray(state) ||
    // just like persisted state
    !persistedState ||
    // and match
    !state.startsWith(region) ||
    !state.endsWith(persistedState)
  ) {
    res.status(BAD_REQUEST);

    return null;
  }

  removeCookie(BATTLE_NET_STATE_COOKIE_NAME, res);

  const url = getTokenUrl(region);
  const params: OAuth2GetParams<{ region: string }> = {
    client_id: BATTLENET_CLIENT_ID,
    client_secret: BATTLENET_CLIENT_SECRET,
    code,
    redirect_uri: baseRedirectUrl,
    region,
  };

  try {
    const oauthResponse = await getOAuth2Data(url, params);

    return {
      ...oauthResponse,
      expires_at: Date.now() + oauthResponse.expires_in * 1000,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

export type BattleNetProfile = OAuth2Response & { expires_at: number };
