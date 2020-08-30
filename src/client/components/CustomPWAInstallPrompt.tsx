import {
  Button,
  Slide,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/core';
import { useEffect, useRef } from 'react';

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: string[];

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt: () => Promise<void>;
}

export function CustomPWAInstallPrompt(): null | JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const promptEvent = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstall = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();

      promptEvent.current = event;
      onOpen();
    };

    // @ts-expect-error event not available in all browsers
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    return () =>
      // @ts-expect-error event not available in all browsers
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, [onOpen]);

  /* async */ function install() {
    if (promptEvent.current) {
      // eslint-disable-next-line no-console
      promptEvent.current.prompt().catch(console.error);

      // const { outcome, platform } = await promptEvent.current.userChoice;
      // console.log({ outcome, platform });

      onClose();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Slide placement="top" in={isOpen}>
      {({
        left,
        right,
        top,
        maxWidth,
        willChange,
        position,
        transition,
        transform,
      }) => (
        <Modal onClose={onClose} isOpen>
          <ModalOverlay />
          <ModalContent
            pb={5}
            left={left}
            right={right}
            top={top}
            maxWidth={maxWidth}
            willChange={willChange}
            position={position}
            transition={transition}
            transform={transform}
          >
            <ModalHeader>Install now</ModalHeader>
            <ModalCloseButton onClick={onClose} />
            <ModalBody>
              <Button onClick={install}>install</Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Slide>
  );
}
