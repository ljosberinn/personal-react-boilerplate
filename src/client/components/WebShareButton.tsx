import { IconButton, Icon, IconButtonProps } from '@chakra-ui/core';
import React from 'react';
import { MdShare } from 'react-icons/md';

import { captureException } from '../../../karma/utils/sentry/client';
import { IS_BROWSER } from '../../constants';

export interface WebShareButtonProps
  extends Omit<IconButtonProps, 'icon' | 'background' | 'onClick'> {
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
}
export const canShare = IS_BROWSER && !!navigator.share;

/**
 * @see https://web.dev/web-share/
 */
export function WebShareButton({
  title,
  url,
  text,
  ...rest
}: WebShareButtonProps): JSX.Element | null {
  async function handleShare() {
    try {
      await navigator.share({
        text,
        title,
        url: url ?? window.location.origin,
      });
    } catch (error) {
      // canceling a share throws, like AbortController, an AbortError
      // we most likely don't care about that
      if (error.name !== 'AbortError') {
        captureException(error);
      }

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
