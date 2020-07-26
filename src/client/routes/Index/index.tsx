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
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  IconButton,
  chakra,
  Image,
} from '@chakra-ui/core';
import React, { ReactNode } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FcSettings } from 'react-icons/fc';
import { MdDehaze } from 'react-icons/md';

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
  const _hoverBg = useColorModeValue('gray.300', 'whiteAlpha.100');

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

const StyledLink = chakra(ExternalLink, {
  baseStyle: {
    _first: {
      mt: 0,
    },
    _focus: {
      boxShadow: 'outline',
    },
    borderRadius: 'sm',
    display: 'block',
    mt: 1,
    outline: 'none',
    px: '2',
    py: '1',
    transition: 'all 0.2s',
  },
});

interface MobileNavLinKProps {
  children: ReactNode;
  href: string;
}

function MobileNavLink({ children, href }: MobileNavLinKProps) {
  const hoverColor = useColorModeValue('gray.900', 'whiteAlpha.900');
  const color = useColorModeValue('gray.700', 'whiteAlpha.900');

  return (
    <StyledLink
      href={href}
      mx={-2}
      color={color}
      _hover={{
        color: hoverColor,
        transform: 'translateX(2px)',
      }}
    >
      <span>{children}</span>
    </StyledLink>
  );
}

function MobileNav() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        display={{
          md: 'none',
          sm: 'inline-flex',
        }}
        aria-label="Open menu"
        fontSize="20px"
        variant="ghost"
        icon={<MdDehaze />}
        onClick={onToggle}
      />
      {isOpen && (
        <Drawer size="xs" isOpen placement="left" onClose={onClose}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerBody p={0}>
                <Box
                  position="relative"
                  overflowY="auto"
                  borderRightWidth="1px"
                >
                  <Box
                    as="nav"
                    height="100vh"
                    aria-label="Main navigation"
                    fontSize="sm"
                    px="6"
                    pt="10"
                    pb="6"
                  >
                    <Box mb="10">
                      <Heading
                        size="xs"
                        letterSpacing="wide"
                        textTransform="uppercase"
                        mb="4"
                      >
                        Getting Started
                      </Heading>
                      <MobileNavLink href="//ljosberinn.gitbook.io/next-karma/getting-started-1/setting-up-a-new-project">
                        Setting up a new project
                      </MobileNavLink>
                    </Box>

                    <Box mb="10">
                      <Heading
                        size="xs"
                        letterSpacing="wide"
                        textTransform="uppercase"
                        mb="4"
                      >
                        Guides
                      </Heading>

                      <MobileNavLink href="//ljosberinn.gitbook.io/next-karma/guides/api-routes-with-next-connect">
                        API Routes with next-connect
                      </MobileNavLink>

                      <MobileNavLink href="//ljosberinn.gitbook.io/next-karma/guides/api-routes-with-next-connect/using-custom-middlewares">
                        Using custom middlewares
                      </MobileNavLink>
                    </Box>
                  </Box>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      )}
    </>
  );
}

function Header() {
  const bg = useColorModeValue('gray.100', 'gray.700');

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
        p="3"
      >
        <Flex align="center">
          <KarmaIcon size="3rem" />{' '}
          <Text fontWeight="500" pl="2">
            next-karma
          </Text>
          <HStack
            as="nav"
            spacing="4"
            ml="12"
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

        <Flex width="auto" maxW="720px" align="center" color="gray.500">
          <Stack align="center" direction="row" spacing="3">
            <ExternalLink omitIcon href={gitUrl}>
              <Icon as={FaGithub} boxSize="6" />
            </ExternalLink>
            <ThemeSwitchAlt />
          </Stack>
          <MobileNav />
        </Flex>
      </Flex>
    </Box>
  );
}

function FadedText({ children }: { children: ReactNode }) {
  const color = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');

  return (
    <Text color={color} fontSize="xl" mt="6">
      {children}
    </Text>
  );
}

function Hero() {
  return (
    <Box as="section" pt={40} pb={16} maxW="xl" mx="auto" textAlign="center">
      <KarmaIcon size="16rem" />

      <Heading as="h1" size="xl" fontWeight="500" mt="2">
        next-karma
      </Heading>

      <FadedText>
        A slighly opinionated batteries-included Next.js template.
      </FadedText>

      <FadedText>
        Supports Authentication, Error Handling & Internationalization and more
        out of the box.
      </FadedText>

      <Box mt="6">
        <Button
          as={ExternalLink}
          omitIcon
          omitTextDecoration
          href="//ljosberinn.gitbook.io/next-karma"
          size="lg"
          colorScheme="teal"
        >
          Get Started
        </Button>
        <Button
          as={ExternalLink}
          omitIcon
          omitTextDecoration
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

const title = (
  <Text as="b" whiteSpace="nowrap">
    next-karma
  </Text>
);

const iconSize = '3rem';

function StackOverview() {
  return (
    <Grid
      templateColumns={{
        lg: 'repeat(2, 1fr)',
        sm: 'repeat(1, 1fr)',
      }}
      gap={10}
      px={12}
      as="section"
    >
      <Feature
        icon={<NextIcon size={iconSize} />}
        title="Next.js"
        href="//nextjs.org"
      >
        Built on top of Next.js, {title} can near seamlessly integrate into
        existing apps or serve as starting point for new projects.
      </Feature>

      <Feature
        icon={<TypeScriptIcon size={iconSize} />}
        title="TypeScript"
        href="//typescriptlang.org"
      >
        To ensure scalability, long-term robustness and decent autocompletion,{' '}
        {title} is 100% TypeScript.
      </Feature>

      <Feature
        icon={<ChakraIcon size={iconSize} />}
        title="Chakra"
        href="//chakra-ui.com/"
      >
        Chakra provides composable and accessible low-level building blocks. By
        default, it's visually similar to Tailwind and offers every
        customization possible.
      </Feature>

      <Feature
        icon={<I18NextIcon size={iconSize} />}
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

      <Feature
        icon={<OAuth2Icon size={iconSize} />}
        title="OAuth2"
        href="//oauth.net/2/"
      >
        Support for{' '}
        <Tooltip label={ENABLED_PROVIDER.join(', ')}>
          4 external providers
        </Tooltip>{' '}
        is included out of the box as well as means to implement homegrown
        authentication, all based on httpOnly cookies.
      </Feature>

      <Feature
        icon={<SentryIcon size={iconSize} />}
        title="Sentry"
        href="//sentry.io"
      >
        Miss no bugs with{' '}
        <ExternalLink href="http://sentry.io/">Sentry</ExternalLink>, neither on
        the frontend, nor in Next.js core functionality or API routes. Every
        deploy creates a new release, separately visible in Sentrys dashboard.
      </Feature>

      <Feature
        icon={<JestIcon size={iconSize} />}
        title="Jest"
        href="//jestjs.io"
      >
        All tests, integration or unit, run through Jest. To test API routes, a{' '}
        <Code>testLambda</Code> function is included. {title} comes with 90%
        code coverage out of the box.
      </Feature>

      <Feature
        icon={
          <Image
            src="/testing-lib.png"
            height={iconSize}
            width={iconSize}
            alt={`${title} Logo`}
          />
        }
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
        icon={<GithubActionsLogo size={iconSize} />}
        title="Github Actions"
        href="//github.com/features/actions"
      >
        Before deploying, Github Actions will ensure your linting setup,
        typecheck, execute tests as well as upload code coverage to{' '}
        <ExternalLink href="https://codeclimate.com/">CodeClimate</ExternalLink>
        .
      </Feature>

      <Feature
        icon={<PWAIcon size={iconSize} />}
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

      <Feature
        icon={<ESLintIcon size={iconSize} />}
        title="ESLint"
        href="//eslint.org"
      >
        Built on top of industry standards & community best practices, {title}{' '}
        comes with{' '}
        <ExternalLink href="https://github.com/ljosberinn/eslint-config-galex">
          my personal eslint config
        </ExternalLink>
        . You may of course swap at any time.
      </Feature>

      <Feature icon={<FcSettings size={iconSize} />} title="...and more!">
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
      <Stack
        mt={4}
        direction={['column', 'row']}
        spacing="12px"
        justify="center"
      >
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
      <Box as="main" maxWidth="86rem" ml="auto" mr="auto">
        <Hero />
        <Divider my={16} />
        <StackOverview />
      </Box>
      <Divider my={16} />
      <Footer />
    </>
  );
}
