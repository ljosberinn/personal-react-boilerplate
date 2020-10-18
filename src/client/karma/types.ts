import type { ChakraProviderProps, StorageManager } from '@chakra-ui/core';
import type { ReactNode } from 'react';

import type { Namespace } from '../../constants';
import type { User } from '../context/AuthContext/AuthContext';
import type { I18nextResourceLocale } from '../i18n';
import type { KarmaSSGProps } from './SSG';
import type { KarmaSSRProps } from './SSR';

export type WithChildren<Props = {}> = Props & {
  children: ReactNode;
};

/** ********************
 * shared utils
 *********************/
/**
 * component props including karma props.
 *
 * use in combination with `KarmaSSRProps` or `KarmaSSGProps`
 *
 * @see `KarmaSSRProps`
 * @see `KarmaSSGProps`
 */
export type WithKarmaProps<KarmaProps, Props = {}> = {
  karma: KarmaProps;
} & Props;

export type IsomorphicI18nRequirements = {
  language?: string;
  namespaces?: Namespace[];
};

export type IsomorphicKarmaProps = KarmaSSGProps | KarmaSSRProps;

export type KarmaMode = 'ssr' | 'ssg';

export type KarmaCoreProps = {
  /**
   * props forwarded onto `ChakraProvider`
   */
  chakra?: Omit<ChakraProviderProps, 'colorModeManager' | 'children'>;

  i18n: {
    /**
     * The language to initialize i18n with
     */
    language: string;
    /**
     * The initial bundle to initialize i18n with
     */
    bundle: I18nextResourceLocale | Partial<I18nextResourceLocale>;
  };

  auth: {
    /**
     * The session to initialize a render with
     */
    session: User | null;
    /**
     * Whether to attempt to re-authenticate a user on a SSG'd page
     *
     * @default false
     */
    shouldAttemptReauthentication?: boolean;
    /**
     * Redirects to given URL if re-authentication failed
     *
     * @default undefined
     */
    redirectDestinationIfUnauthenticated?: string;
  };

  /**
   * Chakras colorModeManager taking care of color mode persistence
   * managed by Karma
   *
   * @default undefined
   */
  colorModeManager?: StorageManager;

  /**
   * Internal indicator which mode we're rendering in
   */
  mode: KarmaMode;
};
