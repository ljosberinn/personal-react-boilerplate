import type { CookieSerializeOptions } from 'cookie';

import type {
  OAuth2RedirectHandler,
  OAuth2CallbackHandler,
} from '../../../client/context/AuthContext/types';
import {
  BATTLENET_CLIENT_ID,
  BATTLENET_CLIENT_SECRET,
  IS_PROD,
} from '../../../constants';
import { BAD_REQUEST } from '../../../utils/statusCodes';
import { removeCookie, setCookie } from '../cookie';
import type { OAuth2Response } from '../types';
import { getOAuth2Data, redirect } from '../utils';

const client_id = BATTLENET_CLIENT_ID;
const client_secret = BATTLENET_CLIENT_SECRET;

const scope = ['wow.profile'].join(' ');
export const BATTLE_NET_STATE_COOKIE_NAME = 'bnetstateref';

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

const getAccessTokenUrl = (region: BattleNetRegion) => {
  if (region === 'cn') {
    return 'https://www.battlenet.com.cn/oauth/token';
  }

  return `https://${region}.battle.net/oauth/token`;
};

// const getProfileDataUrl = (region: BattleNetRegion) =>
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

//   const url = getProfileDataUrl(region);
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

export const redirectToBattleNet: OAuth2RedirectHandler = (
  req,
  res,
  redirect_uri
) => {
  const { region } = req.query;

  if (!region || Array.isArray(region) || !isValidRegion(region)) {
    res.status(BAD_REQUEST).end();
    return;
  }

  const state = `${region}-${Math.floor(Math.random() * 100 ** Math.PI)}`;

  const options: CookieSerializeOptions = {
    expires: new Date(Date.now() + 60),
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

  const url =
    region === 'cn'
      ? 'https://www.battlenet.com.cn/oauth/authorize'
      : `https://${region}.battle.net/oauth/authorize`;

  redirect(res, url, {
    client_id,
    redirect_uri,
    scope,
    state,
  });
};

export const processBattleNetCallback: OAuth2CallbackHandler<BattleNetProfile> =
  async (req, res, { redirect_uri, code }) => {
    const [region, persistedState] =
      req.cookies[BATTLE_NET_STATE_COOKIE_NAME]?.split('-') ?? '';
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

    const url = getAccessTokenUrl(region);

    try {
      const oauthResponse = await getOAuth2Data<{ region: BattleNetRegion }>(
        url,
        {
          client_id,
          client_secret,
          code,
          redirect_uri,
          region,
        }
      );

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
