import { IconButton, Icon } from '@chakra-ui/react';
import type { IconButtonProps } from '@chakra-ui/react';
import { MdShare } from 'react-icons/md';

import { captureException } from '../../utils/sentry/client';
import { usePageIsHydrated } from '../hooks/usePageIsHydrated';

export type WebShareButtonProps = Omit<
  IconButtonProps,
  'icon' | 'background' | 'onClick'
> & {
  /**
   * Title of the shared dialogue.
   */
  title?: string;
  /**
   * URL to share.
   *
   * @default window.location.origin
   */
  url?: string;
  /**
   * Message body.
   */
  text?: string;
};

/**
 * @see https://web.dev/web-share/
 */
export function WebShareButton({
  title,
  url,
  text,
  ...rest
}: WebShareButtonProps): JSX.Element | null {
  // required to omit the element during SSR
  const isHydrated = usePageIsHydrated();

  if (!isHydrated || !navigator.share) {
    return null;
  }

  async function handleShare() {
    try {
      await navigator.share({
        text,
        title,
        url: url ?? window.location.origin,
      });
    } catch (error) {
      // istanbul ignore next
      // canceling a share throws an `AbortError` or `InvalidStateError`
      // we most likely don't care about that
      if (
        error instanceof Error &&
        error.name !== 'InvalidStateError' &&
        error.name !== 'AbortError'
      ) {
        captureException(error);
      }

      // istanbul ignore next
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  return (
    <IconButton
      {...rest}
      onClick={handleShare}
      background="none"
      icon={<Icon as={MdShare} boxSize="5" />}
    />
  );
}
