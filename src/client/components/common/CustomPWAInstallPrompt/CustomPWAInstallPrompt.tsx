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
import React, { useEffect, useRef } from 'react';

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
  readonly platforms: Array<string>;

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
  prompt(): Promise<void>;
}

export default function CustomPWAInstallPrompt() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const promptEvent = useRef<BeforeInstallPromptEvent>(null!);

  useEffect(() => {
    function onBeforeInstall(event: BeforeInstallPromptEvent) {
      event.preventDefault();

      promptEvent.current = event;
      setTimeout(onOpen, 5000);
    }

    // @ts-expect-error
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    return () =>
      // @ts-expect-error
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, [onOpen]);

  /* async */ function install() {
    promptEvent.current.prompt();

    // const { outcome, platform } = await promptEvent.current.userChoice;
    // console.log({ outcome, platform });

    onClose();
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
        <Modal onClose={onClose} isOpen={true}>
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
