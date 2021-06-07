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
} from '@chakra-ui/react';
import { BsLayoutWtf } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { FcSettings } from 'react-icons/fc';
import { GiFeather } from 'react-icons/gi';
import { MdTranslate } from 'react-icons/md';

import { ExternalLink } from '../../components/ExternalLink';
import { useMotionAwareAnimation } from '../../hooks/useMotionAwareAnimation';
import type { WithChildren } from '../../karma/types';
import { gitUrl } from '../../layouts/CommonLayout';
import { Feature } from './Feature';
import {
  ChakraIcon,
  ESLintIcon,
  GithubActionsLogo,
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
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bg} borderBottom="1px solid" borderColor="gray.700">
      <Container
        d="flex"
        maxWidth={{ base: '100%', md: '100em' }}
        pt={{ base: 28, lg: 60 }}
        pb={{ base: 20, lg: 44 }}
        mx="auto"
        justifyContent="center"
        alignContent="center"
        flexDirection={{ base: 'column', lg: 'row' }}
        textAlign={{ base: 'center', lg: 'initial' }}
      >
        <Flex justifyContent="center" pb={{ base: 10, lg: 0 }}>
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

          <Divider
            role={undefined}
            aria-orientation={undefined}
            mt={{ base: 6, sm: 6 }}
          />

          <Box bg={bg} p={6} mt={{ base: 0, sm: 6 }} mb={6} borderRadius={8}>
            <Text as="span" fontSize="xl" lineHeight="tall">
              Stop worrying about nitty gritty low-level details in an
              ever-growing, ever more complex ecosystem. Focus on what's
              important: creating awesome features for your users in a fast and
              reliable way, yet retain all flexibility you might (n)ever need.
            </Text>
          </Box>

          <Box mt={6}>
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

function Title({ shade }: { shade?: keyof typeof karmaShades }) {
  const color = useColorModeValue(karmaShades.regular, 'red.300');

  return (
    <Text as="b" whiteSpace="nowrap" color={shade ? karmaShades[shade] : color}>
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
        maxWidth="100em"
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
          <Code>getServerSideProps</Code> and thus supports all variants of both{' '}
          <Code>SSG</Code> & <Code>SSR</Code>!
        </Feature>

        <Feature
          title="Lightweight Core"
          icon={<Icon as={GiFeather} height={iconSize} width={iconSize} />}
        >
          Orchestrating features comes with a price, but a small one - <Title />{' '}
          at its core is only ~4kB gzipped.
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
          icon={<Icon as={MdTranslate} height={iconSize} width={iconSize} />}
          title="Internationalization"
          learnMoreHref="/docs/i18n"
        >
          Since Next.js 10 natively supports i18n, so does <Title />! A
          lightweight custom implementation based on local JSONs is included.
          Similar to{' '}
          <ExternalLink href="//github.com/vinissimus/next-translate">
            next-translate
          </ExternalLink>
          , assets can be included/omitted on a per-page & per-namespace basis.
        </Feature>

        <Feature
          icon={<Icon as={BsLayoutWtf} height={iconSize} width={iconSize} />}
          href="//adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/"
          title="Persistent Layouts"
          learnMoreHref="/docs/layout"
        >
          <Title /> embraced persistent layouts as one of its core features and
          makes of the trickier things to setup in a Next.js project
          dead-simple.
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
          <br />
          <Title /> supports various approaches, e.g. auto-reauthentication on
          SSG, automatic redirecting on failure and naturally SSR - all
          config-based per page, while keeping your flexibility.
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
          , all components and hooks are well tested. Flexible{' '}
          <ExternalLink href="//testing-library.com/docs/react-testing-library/setup#custom-render">
            custom render functions
          </ExternalLink>{' '}
          for both components and hooks are already set up!
        </Feature>

        <Feature
          icon={
            <GithubActionsLogo width={iconSize} height={iconSize} fill="none" />
          }
          title="Github Actions"
          href="//github.com/features/actions"
          learnMoreHref="/getting-started/#github-actions"
        >
          <Title /> comes with 3 tailored GitHub workflows:
          <br />
          Before deploying to production, an Action will ensure types, linting,
          tests and post-deploy run Lighthouse. Simultanously, code coverage
          will be uploaded to{' '}
          <ExternalLink href="//codeclimate.com/">CodeClimate</ExternalLink>.
          <br />
          Pull Requests will skip uploading code coverage.
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

function Intro() {
  // eslint-disable-next-line unicorn/no-useless-undefined
  const color = useColorModeValue('teal.500', undefined);

  return (
    <Box as="article" bgColor="teal.800" color="white">
      <Container p={16} maxWidth="100em">
        <Heading as="h2" textAlign="center" mb={4}>
          <Title shade="lighter" /> is truly open!
        </Heading>
        <Heading as="h3" fontSize="lg" textAlign="center" mb={12}>
          Don't need authentication? Delete it! Don't need internationalization?
          Throw it away!
        </Heading>
        <Text fontSize="xl" lineHeight="tall">
          There is no vendor lock-in - starting a <Title shade="lighter" />{' '}
          project means getting all the source code, right into your project.
          There is no waiting for new features or bugfixes. There are no
          breaking changes you have to follow because you're too deep in.
        </Text>
        <Text fontSize="xl" lineHeight="tall" pt={4}>
          <Title shade="lighter" /> contains what most larger projects will have
          anyways, not more, not less. A future upgrade path simply means: check
          the commit history the repository and pluck what you need.
        </Text>
        <Text fontSize="xl" lineHeight="tall" pt={4}>
          This necessarily requires a bit of a different mindset:
        </Text>
        <Text fontSize="xl" lineHeight="tall">
          on the one hand, you get solid defaults and can fix any potentially
          arising issues yourself, right when you need it.
        </Text>
        <Text fontSize="xl" lineHeight="tall">
          Which is nice! No eternal wait until{' '}
          <chakra.span fontStyle="italic">that annoying bug</chakra.span> is
          finally fixed.{' '}
          <chakra.strong fontStyle="italic">
            You actually can fix it yourself
          </chakra.strong>
          . <Title shade="lighter" /> isn't buried in your node_modules.
        </Text>
        <Text fontSize="xl" lineHeight="tall" pt={4}>
          But it also means: you might have to fix urgent issues yourself -{' '}
          <Title shade="lighter" /> is just here to lay the foundation. Getting
          familiar with at least some of the <Title shade="lighter" /> code will
          thus be a long-term necessity. You will want to extend or cut
          features. For most users, the defaults however will be perfectly fine!
        </Text>

        <Text fontSize="xl" lineHeight="tall" pt={8}>
          Where's the catch?
        </Text>

        <Text fontSize="xl" lineHeight="tall" pt={4}>
          <Title shade="lighter" /> is built with{' '}
          <ExternalLink color={color} href="//vercel.com">
            Vercel
          </ExternalLink>{' '}
          and{' '}
          <ExternalLink color={color} href="//github.com">
            GitHub
          </ExternalLink>{' '}
          in mind. If you don't plan on using either of them, some additional
          setup work will be required - but all features are generally
          compatible with any other hosting & CI/CD solution.
        </Text>
      </Container>
    </Box>
  );
}

export function Index(): JSX.Element {
  return (
    <main>
      <Hero />
      <Intro />
      <StackOverview />
    </main>
  );
}
