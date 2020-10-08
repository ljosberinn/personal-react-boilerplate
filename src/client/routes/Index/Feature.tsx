import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/core';
import type { ReactNode, MouseEvent } from 'react';
import { FaArrowRight } from 'react-icons/fa';

import type { WithChildren } from '../../Karma';
import { ExternalLink } from '../../components/ExternalLink';
import { InternalLink } from '../../components/InternalLink';

export type FeatureProps = WithChildren<{
  title: string;
  icon: ReactNode;
  href?: string;
  learnMoreHref?: string;
}>;

function handleClick(event: MouseEvent) {
  event.preventDefault();
}

const staticStyles = {
  flex: {
    _hover: { transform: 'translateY(-3px)' },
  },
  internalLink: {
    sx: {
      ':hover > svg': {
        transform: 'rotate(-45deg)',
      },
    },
  },
};

export function Feature({
  title,
  href,
  children,
  icon,
  learnMoreHref,
}: FeatureProps): JSX.Element {
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Flex
      bg={bg}
      transition="transform 0.1s ease 0s"
      _hover={staticStyles.flex._hover}
      borderRadius="5px"
      as="section"
      rounded="12px"
      shadow="base"
      p={10}
      boxShadow="rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px"
      flexDirection="column"
      justifyContent="space-between"
      pb={8}
    >
      <Box>
        <Box justifySelf="start">{icon}</Box>
        <Header href={href} title={title} />

        <Text fontSize="lg" opacity={0.8} pt={2}>
          {children}
        </Text>
      </Box>

      <Box
        textAlign="right"
        fontStyle="italic"
        pt={learnMoreHref ? 6 : undefined}
      >
        {learnMoreHref && (
          <InternalLink
            href={learnMoreHref}
            sx={staticStyles.internalLink.sx}
            onClick={handleClick}
          >
            Learn more (soon!)
            <Icon
              ml={2}
              transition="all 200ms ease-in-out"
              as={FaArrowRight}
              className="fa-arrow-right"
            />
          </InternalLink>
        )}
      </Box>
    </Flex>
  );
}

type HeaderProps = Pick<FeatureProps, 'title' | 'href'>;

function Header({ title, href }: HeaderProps) {
  const heading = (
    <Heading
      as="h3"
      d="inline-block"
      size="md"
      fontWeight="semibold"
      mt="1em"
      mb="0.5em"
    >
      {title}
    </Heading>
  );

  if (href) {
    return (
      <ExternalLink omitIcon href={href} width="fit-content">
        {heading}
      </ExternalLink>
    );
  }

  return heading;
}
