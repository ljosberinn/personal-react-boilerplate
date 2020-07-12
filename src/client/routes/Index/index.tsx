import {
  Box,
  Grid,
  Tooltip,
  Code,
  Flex,
  HStack,
  Stack,
  Icon,
  useColorModeValue,
  Text,
  Heading,
  Divider,
  Button,
} from '@chakra-ui/core';
import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

import { ENABLED_PROVIDER } from '../../../constants';
import {
  ExternalLink,
  ExternalLinkProps,
} from '../../components/common/ExternalLink';
import { ThemeSwitchAlt } from '../../components/common/ThemeSwitchAlt';
import { Feature } from './Feature';
import { ChakraIcon } from './icons/ChakraIcon';
import { ESLintIcon } from './icons/ESLintIcon';
import { GithubActionsLogo } from './icons/GithubActionsIcon';
import { I18NextIcon } from './icons/I18NextIcon';
import { JestIcon } from './icons/JestIcon';
import { KarmaIcon } from './icons/KarmaIcon';
import { NextIcon } from './icons/NextIcon';
import { OAuth2Icon } from './icons/OAuth2Icon';
import { PWAIcon } from './icons/PWAIcon';
import { SentryIcon } from './icons/SentryIcon';
import { TypeScriptIcon } from './icons/TypeScriptIcon';

const gitUrl = '//github.com/ljosberinn/personal-react-boilerplate';

type CustomExternalLinkProps = Pick<ExternalLinkProps, 'href' | 'children'>;

function CustomExternalLink({ href, children }: CustomExternalLinkProps) {
  const _hoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <ExternalLink
      omitIcon
      href={href}
      transition="all 0.2s"
      _hover={{ bg: _hoverBg }}
      py="1"
      px="3"
      borderRadius="4px"
    >
      {children}
    </ExternalLink>
  );
}

function Header() {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      as="header"
      borderBottomWidth="1px"
      height="4rem"
      position="fixed"
      width="full"
      bg={bg}
      zIndex="1"
    >
      <Flex
        boxSize="100%"
        align="center"
        justify="space-between"
        maxWidth="72rem"
        ml="auto"
        mr="auto"
      >
        <Flex align="center">
          <KarmaIcon /> <Text fontWeight="500">next-karma</Text>
          <HStack
            as="nav"
            spacing="4"
            ml="24px"
            display={{ base: 'none', md: 'flex' }}
          >
            <CustomExternalLink href="//ljosberinn.gitbook.io/next-karma">
              Docs
            </CustomExternalLink>

            <CustomExternalLink href="//ljosberinn.gitbook.io/next-karma/guides/">
              Guides
            </CustomExternalLink>
          </HStack>
        </Flex>

        <Flex
          width={['auto', 'auto', '100%']}
          maxW="720px"
          align="center"
          color="gray.500"
        >
          <Stack align="center" direction="row" spacing="3">
            <ExternalLink omitIcon href={gitUrl}>
              <Icon as={FaGithub} boxSize="6" />
            </ExternalLink>
            <ThemeSwitchAlt />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

function Hero() {
  return (
    <Box as="section" pt={40} pb={16} maxW="xl" mx="auto" textAlign="center">
      <KarmaIcon size={16} />

      <Heading as="h1" size="xl" fontWeight="500" mt="2">
        next-karma
      </Heading>

      <Text opacity={0.7} fontSize="xl" mt="6">
        A slighly opinionated batteries-included Next.js template.
      </Text>

      <Box mt="6">
        <Button
          as={ExternalLink}
          omitIcon
          href="//ljosberinn.gitbook.io/next-karma"
          size="lg"
          colorScheme="teal"
        >
          Get Started
        </Button>
        <Button
          as={ExternalLink}
          omitIcon
          size="lg"
          ml={4}
          href={gitUrl}
          leftIcon={<FaGithub size="1.5em" />}
        >
          GitHub
        </Button>
      </Box>
    </Box>
  );
}

const title = <Text as="b">next-karma</Text>;

function StackOverview() {
  return (
    <Grid
      templateColumns={{ lg: 'repeat(3, 1fr)', md: 'repeat(1, 1fr)' }}
      gap={10}
      px={12}
      as="section"
    >
      <Feature icon={NextIcon} title="Next.js" href="//nextjs.org">
        Built on top of Next.js, {title} can near seamlessly integrate into
        existing apps or serve as starting point for new projects.
      </Feature>

      <Feature
        icon={TypeScriptIcon}
        title="TypeScript"
        href="//typescriptlang.org"
      >
        To ensure scalability, long-term robustness and decent autocompletion.
      </Feature>

      <Feature icon={ChakraIcon} title="Chakra" href="//chakra-ui.com/">
        Chakra provides composable and accessible low-level building blocks. By
        default, it's visually similar to Tailwind and offers every
        customization possible.
      </Feature>

      <Feature
        icon={I18NextIcon}
        title="react-i18next"
        href="//react.i18next.com/"
      >
        A Serverless- & SSR-compatible, JSON-based i18n solution is implemented
        via{' '}
        <ExternalLink href="https://react.i18next.com/">
          react-i18next
        </ExternalLink>
        . Assets can be exchanged on the fly through an API route.
      </Feature>

      <Feature icon={OAuth2Icon} title="OAuth2" href="//oauth.net/2/">
        Support for{' '}
        <Tooltip label={ENABLED_PROVIDER.join(', ')}>
          4 external providers
        </Tooltip>{' '}
        is included out of the box as well as means to implement homegrown
        authentication, all based on httpOnly cookies.
      </Feature>

      <Feature icon={SentryIcon} title="Sentry" href="//sentry.io">
        Miss no bugs with{' '}
        <ExternalLink href="http://sentry.io/">Sentry</ExternalLink>, neither on
        the frontend, nor in Next.js core functionality or API routes. Every
        deploy creates a new release, separately visible in Sentrys dashboard.
      </Feature>

      <Feature icon={JestIcon} title="Jest" href="//jestjs.io">
        All tests, integration or unit, run through Jest. To test API routes, a{' '}
        <Code>testLambda</Code> function is included. {title} comes with 90%
        code coverage out of the box.
      </Feature>

      <Feature
        icon="/testing-lib.png"
        title="@testing-library/react"
        href="//testing-library.com/docs/react-testing-library/intro"
      >
        Following best practices and with help from{' '}
        <ExternalLink href="https://testing-playground.com">
          Testing Playground
        </ExternalLink>
        , all example components are well tested. A{' '}
        <ExternalLink href="https://testing-library.com/docs/native-testing-library/setup#custom-render">
          custom render
        </ExternalLink>{' '}
        function with sensible defaults is included.
      </Feature>

      <Feature
        icon={GithubActionsLogo}
        title="Github Actions"
        href="//github.com/features/actions"
      >
        Before deploying, Github Actions will ensure your linting setup,
        typecheck, execute tests as well as upload code coverage to{' '}
        <ExternalLink href="https://codeclimate.com/">CodeClimate</ExternalLink>
        .
      </Feature>

      <Feature
        icon={PWAIcon}
        title="PWA"
        href="//web.dev/progressive-web-apps/"
      >
        Thanks to{' '}
        <ExternalLink href="https://github.com/hanford/next-offline">
          next-offline
        </ExternalLink>
        , a ServiceWorker will be created on each deploy. An example component
        notifying users on found updates is included. To prevent being too
        opinionated here, no other PWA capabilities are included.
      </Feature>

      <Feature icon={ESLintIcon} title="ESLint" href="//eslint.org">
        Built on top of industry standards & community best practices, {title}{' '}
        comes with{' '}
        <ExternalLink href="https://github.com/ljosberinn/eslint-config-galex">
          my personal eslint config
        </ExternalLink>
        . You may of course swap at any time.
      </Feature>

      <Feature title="...and more!">
        <ExternalLink
          omitIcon
          href="//docs.github.com/en/github/building-a-strong-community/configuring-issue-templates-for-your-repository"
        >
          GitHub Issue templates
        </ExternalLink>
        ,{' '}
        <ExternalLink
          omitIcon
          href="//github.com/conventional-changelog/commitlint"
        >
          commitlint
        </ExternalLink>
        ,{' '}
        <ExternalLink omitIcon href="//github.com/okonet/lint-staged">
          lint-staged
        </ExternalLink>
        ,{' '}
        <ExternalLink omitIcon href="//github.com/typicode/husky">
          husky
        </ExternalLink>
        ,{' '}
        <ExternalLink omitIcon href="//github.com/garmeeh/next-seo">
          next-seo
        </ExternalLink>
        ,{' '}
        <ExternalLink omitIcon href="//prettier.io">
          prettier
        </ExternalLink>
        , ...
      </Feature>
    </Grid>
  );
}

const links = [
  {
    href: 'https://github.com/ljosberinn',
    icon: FaGithub,
    text: 'ljosberinn',
  },
  {
    href: 'https://twitter.com/gerrit_alex',
    icon: FaTwitter,
    text: '@gerrit_alex',
  },
  {
    href: 'https://linkedin.com/in/gerrit-alex/',
    icon: FaLinkedin,
    text: 'Gerrit Alex',
  },
];

function Footer() {
  return (
    <Box as="footer" mt={12} mb={20} textAlign="center">
      <Text fontSize="sm">
        <Box as="span" ml="3">
          MIT by <ExternalLink href="//gerritalex.de">Gerrit Alex</ExternalLink>
        </Box>
      </Text>
      <Stack mt={4} direction="row" spacing="12px" justify="center">
        {links.map(({ href, icon, text }) => (
          <ExternalLink omitIcon display="inline-block" href={href} key={href}>
            <Icon as={icon} fontSize="xl" color="gray.400" /> {text}
          </ExternalLink>
        ))}
      </Stack>
    </Box>
  );
}

export function Index() {
  return (
    <>
      <Header />
      <Box as="main" maxWidth="72rem" ml="auto" mr="auto">
        <Hero />
        <Divider my={16} />
        <StackOverview />
      </Box>
      <Divider my={16} />
      <Footer />
    </>
  );
}
