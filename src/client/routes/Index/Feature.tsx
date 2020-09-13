import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/core';
import type { ReactNode } from 'react';
import { FaArrowRight } from 'react-icons/fa';

import type { WithChildren } from '../../../../karma/client/Karma';
import { ExternalLink } from '../../components/ExternalLink';
import { InternalLink } from '../../components/InternalLink';

export interface FeatureProps extends WithChildren {
  title: string;
  icon: ReactNode;
  href?: string;
  learnMoreHref?: string;
}

export function Feature({
  title,
  href,
  children,
  icon,
  learnMoreHref,
}: FeatureProps): JSX.Element {
  const hoverBg = useColorModeValue('gray.100', 'gray.800');
  const bg = useColorModeValue('white', 'gray.700');

  return (
    <Flex
      bg={bg}
      _hover={{ bg: hoverBg }}
      borderRadius="5px"
      as="section"
      rounded="12px"
      shadow="base"
      p={10}
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
            sx={{
              ':hover > svg': {
                transform: 'rotate(-45deg)',
              },
            }}
            onClick={(event) => event.preventDefault()}
          >
            Learn more (soon!)
            <Icon
              ml={2}
              transition="transform 200ms ease-in-out"
              as={FaArrowRight}
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
