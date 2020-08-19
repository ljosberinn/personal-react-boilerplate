import {
  Box,
  Grid,
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
  keyframes,
} from '@chakra-ui/core';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FcSettings } from 'react-icons/fc';
import { MdDehaze } from 'react-icons/md';

import { WithChildren } from '../../Karma';
import { ColorModeSwitchAlt } from '../../components/ColorModeSwitchAlt';
import { ExternalLink, ExternalLinkProps } from '../../components/ExternalLink';
import { Feature } from './Feature';
import {
  ChakraIcon,
  ESLintIcon,
  GithubActionsLogo,
  I18NextIcon,
  JestIcon,
  KarmaIcon,
  NextIcon,
  OAuth2Icon,
  TypeScriptIcon,
  PWAIcon,
  SentryIcon,
} from './icons';

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

interface MobileNavLinKProps extends WithChildren {
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
      height="4em"
      position="fixed"
      width="full"
      bg={bg}
      zIndex="1"
    >
      <Flex
        boxSize="100%"
        align="center"
        justify="space-between"
        maxWidth="72em"
        ml="auto"
        mr="auto"
        p="3"
      >
        <Flex align="center">
          <KarmaIcon size="3em" />{' '}
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
            <ColorModeSwitchAlt />
          </Stack>
          <MobileNav />
        </Flex>
      </Flex>
    </Box>
  );
}

function FadedText({ children }: WithChildren) {
  const color = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');

  return (
    <Text color={color} fontSize="xl" mt="6" px={2}>
      {children}
    </Text>
  );
}

function Hero() {
  return (
    <Box as="section" pt={40} pb={24} maxW="xl" mx="auto" textAlign="center">
      <KarmaIcon height="24em" width="24em" />
      <Heading as="h1" mt={8} mb={16}>
        next-karma
      </Heading>

      <Text fontStyle="italic">_still wip_</Text>

      <FadedText>
        A slighly opinionated batteries-included Next.js template
      </FadedText>
      <FadedText>
        supporting Authentication, Error Handling & Internationalization and
        more out of the box.
      </FadedText>
      <Box mt={12}>
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

const iconSize = '3em';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

function StackOverview() {
  return (
    <Box p={16} as="article">
      <Heading as="h2" id="features" mb={16} textAlign="center">
        Features
      </Heading>

      <Grid
        templateColumns={{
          lg: 'repeat(2, 1fr)',
          sm: 'repeat(1, 1fr)',
        }}
        gap={10}
        maxWidth="86em"
        ml="auto"
        mr="auto"
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
          icon={<TypeScriptIcon height={iconSize} width={iconSize} />}
          title="TypeScript"
          href="//typescriptlang.org"
        >
          To ensure scalability, long-term robustness and decent autocompletion,{' '}
          {title} is 100% TypeScript.
        </Feature>

        <Feature
          icon={<ChakraIcon height={iconSize} width="auto" />}
          title="Chakra"
          href="//chakra-ui.com/"
        >
          Chakra provides composable and accessible low-level building blocks.
          By default, it's visually similar to Tailwind and offers every
          customization possible.
        </Feature>

        <Feature
          icon={<I18NextIcon height={iconSize} width={iconSize} />}
          title="react-i18next"
          href="//react.i18next.com/"
        >
          A Serverless- & SSR-compatible, JSON-based i18n solution is
          implemented via{' '}
          <ExternalLink href="https://react.i18next.com/">
            react-i18next
          </ExternalLink>
          . Assets can be exchanged on the fly through an API route.
        </Feature>

        <Feature
          icon={<OAuth2Icon height={iconSize} width={iconSize} />}
          title="OAuth2"
          href="//oauth.net/2/"
        >
          Support for 4 external providers is included out of the box as well as
          means to implement homegrown authentication, all based on httpOnly
          cookies.
        </Feature>

        <Feature
          icon={<SentryIcon size={iconSize} />}
          title="Sentry"
          href="//sentry.io"
        >
          Miss no bugs with{' '}
          <ExternalLink href="http://sentry.io/">Sentry</ExternalLink>, neither
          on the frontend, nor in Next.js core functionality or API routes.
          Every deploy creates a new release, separately visible in Sentrys
          dashboard.
        </Feature>

        <Feature
          icon={<JestIcon height={iconSize} width={iconSize} />}
          title="Jest"
          href="//jestjs.io"
        >
          All tests, integration or unit, run through Jest. To test API routes,
          a <Code>testLambda</Code> function is included. {title} comes with 90%
          code coverage out of the box.
        </Feature>

        <Feature
          icon={
            <Image
              src="/testing-lib.png"
              height={iconSize}
              width={iconSize}
              alt="Testing Library Logo"
              ignoreFallback
            />
          }
          title="@testing-library/react"
          href="//testing-library.com/docs/react-testing-library/intro"
        >
          Following best practices and with help from{' '}
          <ExternalLink href="https://testing-playground.com">
            Testing Playground
          </ExternalLink>
          ,{' '}
          <ExternalLink href="https://github.com/nickcolley/jest-axe">
            jest-axe
          </ExternalLink>{' '}
          and{' '}
          <ExternalLink href="https://html-validate.org/frameworks/jest.html">
            html-validate/jest
          </ExternalLink>
          , all example components are well tested. A{' '}
          <ExternalLink href="https://testing-library.com/docs/react-testing-library/setup#custom-render">
            custom render
          </ExternalLink>{' '}
          function with sensible defaults is included.
        </Feature>

        <Feature
          icon={
            <GithubActionsLogo width={iconSize} height={iconSize} fill="none" />
          }
          title="Github Actions"
          href="//github.com/features/actions"
        >
          Before deploying, Github Actions will ensure your linting setup,
          typecheck, execute tests as well as upload code coverage to{' '}
          <ExternalLink href="https://codeclimate.com/">
            CodeClimate
          </ExternalLink>
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
          icon={<ESLintIcon height={iconSize} width={iconSize} />}
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

        <Feature
          icon={
            <Box
              as={FcSettings}
              version={undefined}
              height={iconSize}
              width={iconSize}
              css={{
                '@media (prefers-reduced-motion: no-preference)': {
                  animation: `${spin} infinite 3s linear`,
                },
              }}
            />
          }
          title="...and more!"
        >
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
          <ExternalLink omitIcon href="//prettier.io">
            prettier
          </ExternalLink>
          , ...
        </Feature>
      </Grid>
    </Box>
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
      <Box as="main" maxWidth="86em" ml="auto" mr="auto">
        <Hero />
      </Box>
      <Divider
        role={undefined}
        aria-orientation={undefined}
        boxSizing="border-box"
        border="1px solid #d41143"
      />
      <StackOverview />
      <Divider
        role={undefined}
        aria-orientation={undefined}
        boxSizing="border-box"
        border="1px solid #d41143"
      />
      <Footer />
    </>
  );
}
