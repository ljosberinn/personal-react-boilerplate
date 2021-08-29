import type { ChakraProviderProps } from '@chakra-ui/provider';
import type { StorageManager } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import type { Namespace } from '../../constants';
import type { User } from '../context/AuthContext/types';
import type { KarmaSSGProps } from './SSG';
import type { KarmaSSRProps } from './SSR';
import type { I18nextResources } from './i18n';

export type WithChildren<Props = Record<string, unknown>> = Props & {
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
export type WithKarmaProps<KarmaProps, Props = Record<string, unknown>> = {
  karma: KarmaProps;
} & Props;

export type IsomorphicI18nRequirements = {
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
    locale: string;
    /**
     * The initial bundle to initialize i18n with
     */
    resources: I18nextResources;
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

export type UnknownObjectValues<T extends string> = Record<T, unknown>;
