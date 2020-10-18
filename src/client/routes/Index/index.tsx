import {
  Box,
  Grid,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Heading,
  Divider,
  Button,
  Image,
  keyframes,
  Code,
  chakra,
  Container,
} from '@chakra-ui/core';
import { FaGithub, FaArrowRight } from 'react-icons/fa';
import { FcSettings } from 'react-icons/fc';

import { ExternalLink } from '../../components/ExternalLink';
import { InternalLink } from '../../components/InternalLink';
import { useMotionAwareAnimation } from '../../hooks/useMotionAwareAnimation';
import type { WithChildren } from '../../karma/types';
import { gitUrl } from '../../layouts/CommonLayout';
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
  karmaShades,
} from './icons';

function FadedText({ children }: WithChildren) {
  return (
    <Text as="span" color={karmaShades.regular} mt="6" mr={2}>
      {children}
    </Text>
  );
}

function Hero() {
  const bg = useColorModeValue('cyan.50', 'gray.800');

  return (
    <Box bg={bg} borderBottom="1px solid" borderColor="gray.700">
      <Container
        d="flex"
        maxWidth={{ base: '100%', md: '85%' }}
        pt={40}
        pb={12}
        mx="auto"
        justifyContent="center"
        alignContent="center"
        flexDirection={{ base: 'column', lg: 'row' }}
        textAlign={{ base: 'center', lg: 'initial' }}
      >
        <Flex justifyContent="center">
          <KarmaIcon size="24em" animated />
        </Flex>
        <Box>
          <Heading as="h1" size="xl">
            React is{' '}
            <Text as="span" fontStyle="italic" color="green.500">
              "just javascript"
            </Text>
          </Heading>
          <Heading as="h2" size="2xl" mt={4}>
            <FadedText>Karma</FadedText>
            is{' '}
            <Text as="span" fontStyle="italic" color="green.500">
              "just Next.js"
            </Text>
          </Heading>

          <Divider role={undefined} aria-orientation={undefined} mt={2} />

          <Box bg={bg} p={6} mt={6} mb={6} borderRadius={8}>
            <Text as="span" fontSize="xl" lineHeight="tall">
              Stop worrying about nitty gritty low-level details in an
              ever-growing, ever more complex ecosystem. Focus on what's
              important: creating awesome features for your users in a fast and
              reliable way, yet retain all flexibility you might (n)ever need.
            </Text>

            <Text fontStyle="italic" mt={6}>
              _still wip_ & docs coming soon
            </Text>
          </Box>

          <Box mt={6}>
            <Button
              as={InternalLink}
              omitTextDecoration
              href="/docs"
              size="lg"
              colorScheme="teal"
              rightIcon={<Icon as={FaArrowRight} fontSize="sm" />}
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
              sx={{
                '.chakra-button__icon > svg': {
                  height: 5,
                  width: 5,
                },
              }}
              leftIcon={<Icon d="flex" as={FaGithub} />}
            >
              GitHub
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function Title() {
  const color = useColorModeValue(karmaShades.regular, 'red.300');

  return (
    <Text as="b" whiteSpace="nowrap" color={color}>
      Karma
    </Text>
  );
}

const iconSize = '3em';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

function StackOverview() {
  const animation = useMotionAwareAnimation(`${spin} infinite 3s linear`);

  return (
    <chakra.article p={16}>
      <Heading as="h2" id="stack" mb={16} textAlign="center">
        Stack
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
          Built on top of Next.js, <Title /> should ideally serve as starting
          point for new projects, but of course may provide inspiration for
          existing projects. <Title /> is built entirely on top of{' '}
          <Code>getStaticPaths</Code> / <Code>getStaticProps</Code> /
          <Code>getServerSideProps</Code> and thus supports both{' '}
          <Code>SSG</Code> & <Code>SSR</Code>!
        </Feature>

        <Feature
          icon={<TypeScriptIcon height={iconSize} width={iconSize} />}
          title="TypeScript"
          href="//typescriptlang.org"
        >
          To ensure scalability, long-term robustness and decent autocompletion,{' '}
          <Title /> is 100% TypeScript.
        </Feature>

        <Feature
          icon={<ChakraIcon height={iconSize} width="auto" />}
          title="Chakra"
          href="//chakra-ui.com/"
        >
          Chakra provides composable and accessible UI building blocks. Instead
          of having to eventually fight it as with other component libraries,
          Chakra will go out of your way. <Title /> is maintained by a core
          contributor to Chakra, so it receives first class support.
        </Feature>

        <Feature
          icon={<I18NextIcon height={iconSize} width={iconSize} />}
          title="react-i18next"
          href="//react.i18next.com/"
          learnMoreHref="/docs/i18n"
        >
          A Serverless- & SSR-compatible, JSON-based i18n solution is
          implemented via{' '}
          <ExternalLink href="//react.i18next.com/">react-i18next</ExternalLink>
          . Similar to{' '}
          <ExternalLink href="//github.com/vinissimus/next-translate">
            next-translate
          </ExternalLink>
          , locales can be included/omitted on a per-page basis and exchanged on
          the fly.
        </Feature>

        <Feature
          icon={<OAuth2Icon height={iconSize} width={iconSize} />}
          title="OAuth2"
          href="//oauth.net/2/"
          learnMoreHref="/docs/auth"
        >
          Support for 4 external providers is included out of the box as well as
          means to implement homegrown authentication, all based on a httpOnly
          cookie.
        </Feature>

        <Feature
          icon={<SentryIcon size={iconSize} />}
          title="Sentry"
          href="//sentry.io"
          learnMoreHref="/docs/sentry"
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
          learnMoreHref="/docs/testing"
        >
          All tests, integration or unit, run through Jest. To test API routes,
          a <Code>testLambda</Code> function is included. <Title /> comes with
          over 95% code coverage out of the box.
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
          learnMoreHref="/docs/testing#testing-components"
        >
          Following best practices and with help from{' '}
          <ExternalLink href="//testing-playground.com">
            Testing Playground
          </ExternalLink>
          ,{' '}
          <ExternalLink href="//github.com/nickcolley/jest-axe">
            jest-axe
          </ExternalLink>{' '}
          and{' '}
          <ExternalLink href="//html-validate.org/frameworks/jest.html">
            html-validate/jest
          </ExternalLink>
          , all example components are well tested. A{' '}
          <ExternalLink href="//testing-library.com/docs/react-testing-library/setup#custom-render">
            custom render
          </ExternalLink>{' '}
          function with sensible & extensible defaults is included.
        </Feature>

        <Feature
          icon={
            <GithubActionsLogo width={iconSize} height={iconSize} fill="none" />
          }
          title="Github Actions"
          href="//github.com/features/actions"
          learnMoreHref="/getting-started/#github-actions"
        >
          Before deploying,{' '}
          <ExternalLink href="//github.com/features/actions">
            Github Actions
          </ExternalLink>{' '}
          will ensure your linting setup, typecheck, execute tests as well as
          upload code coverage to{' '}
          <ExternalLink href="//codeclimate.com/">CodeClimate</ExternalLink>.
        </Feature>

        <Feature
          icon={<PWAIcon size={iconSize} />}
          title="PWA"
          href="//web.dev/progressive-web-apps/"
        >
          Thanks to{' '}
          <ExternalLink href="//github.com/hanford/next-offline">
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
          Built on top of industry standards & community best practices,{' '}
          <Title /> comes with{' '}
          <ExternalLink href="//github.com/ljosberinn/eslint-config-galex">
            my personal eslint config
          </ExternalLink>
          . You may of course swap at any time.
        </Feature>

        <Feature
          icon={
            <Icon
              as={FcSettings}
              version={undefined}
              height={iconSize}
              width={iconSize}
              animation={animation}
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
    </chakra.article>
  );
}

export function Index(): JSX.Element {
  return (
    <main>
      <Hero />
      <StackOverview />
    </main>
  );
}
