import {
  Heading,
  Stack,
  Box,
  Divider,
  Code,
  Flex,
  Text,
  useColorMode,
  Badge,
  Tooltip,
} from '@chakra-ui/core';
import React from 'react';
import { FaTwitter, FaGithub, FaGlobe } from 'react-icons/fa';

import { ENABLED_PROVIDER } from '../../../constants';
import { ExternalLink } from '../../components/common/ExternalLink';
import { LanguageSwitch } from '../../components/common/LanguageSwitch';
import { ThemeSwitch } from '../../components/common/ThemeSwitch';
import { ThemeSwitchAlt } from '../../components/common/ThemeSwitchAlt';
import AuthDemo from './AuthDemo';
import DemoComponent from './DemoComponent';
import { Feature } from './Feature';
import { FeatureState } from './Feature/types';

export default function Index() {
  const { colorMode } = useColorMode();

  const boxBg = colorMode === 'dark' ? 'gray.700' : 'gray.100';

  return (
    <Box maxWidth="72rem" ml="auto" mr="auto">
      <section>
        <Heading as="h1" size="xl">
          Batteries-included Next.js boilerplate
        </Heading>

        <Divider borderColor="red.200" />

        <Flex
          mt={4}
          mb={4}
          justifyContent="space-between"
          flexDirection={['row', 'column', 'row', 'row']}
        >
          <ExternalLink href="//github.com/ljosberinn/next-with-batteries">
            <Box d="inline-block" as={FaGithub} /> Repository
          </ExternalLink>

          <Flex>
            find me on...
            <ExternalLink
              ml={2}
              withIcon={false}
              href="//twitter.com/gerrit_alex"
            >
              <Box d="inline-block" as={FaTwitter} /> @gerrit_alex
            </ExternalLink>
            <Divider borderColor="green.200" orientation="vertical" />
            <ExternalLink withIcon={false} href="//github.com/ljosberinn">
              <Box d="inline-block" as={FaGithub} /> ljosberinn
            </ExternalLink>
            <Divider borderColor="green.200" orientation="vertical" />
            <ExternalLink withIcon={false} href="//gerritalex.de">
              <Box d="inline-block" as={FaGlobe} /> gerritalex.de
            </ExternalLink>
          </Flex>
        </Flex>

        <Text>
          Hi there! This is what I currently prefer working with for my own
          projects. <br />
          I'm not done yet integrating everything I require for my own needs
          but... if this looks promising, keep coming back :)
        </Text>
      </section>

      <Box as="section">
        <Heading as="h2" size="lg" mt={4} mb={2}>
          What's included?
        </Heading>

        <Box backgroundColor={boxBg} borderRadius={5} m={1} p={1}>
          <Stack spacing={1} m={4}>
            <Feature state={FeatureState.DONE}>
              built with{' '}
              <ExternalLink href="//nextjs.org/">Next.js</ExternalLink>, powered
              by <ExternalLink href="//reactjs.org/">React</ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              enhanced by{' '}
              <ExternalLink href="//www.typescriptlang.org/">
                TypeScript
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>hooks only</Feature>

            <Feature state={FeatureState.DONE}>
              near-perfect lighthouse audit (97/100/100/100)
            </Feature>

            <Feature state={FeatureState.DONE} id="theming">
              UI via{' '}
              <ExternalLink href="//chakra-ui.com/">
                @chakra-ui/core
              </ExternalLink>{' '}
            </Feature>

            <Feature state={FeatureState.DONE} id="internationalization">
              i18n via{' '}
              <ExternalLink href="//react.i18next.com/">
                react-i18next
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              server-side language detection via{' '}
              <ExternalLink href="//github.com/UnlyEd/universal-language-detector">
                universal-language-detector
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              easier SEO via{' '}
              <ExternalLink href="//github.com/garmeeh/next-seo">
                next-seo
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              testing via <ExternalLink href="//jestjs.io/">Jest</ExternalLink>{' '}
              +{' '}
              <ExternalLink href="//testing-library.com/docs/react-testing-library/intro">
                @testing-library/react
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              preconfigured linting via{' '}
              <ExternalLink href="//eslint.org/">ESLint</ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              code style via{' '}
              <ExternalLink href="//prettier.io">Prettier</ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              commit message rules via{' '}
              <ExternalLink href="//github.com/conventional-changelog/commitlint">
                commitlint
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              enforced via{' '}
              <ExternalLink href="//github.com/typicode/husky">
                husky
              </ExternalLink>{' '}
              &{' '}
              <ExternalLink href="//github.com/okonet/lint-staged">
                lint-staged
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE} id="auth">
              auth via{' '}
              <ExternalLink href="//passportjs.org/">passport.js</ExternalLink>{' '}
              &{' '}
              <ExternalLink href="//github.com/hoangvvo/next-connect#readme">
                next-connect
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.DONE}>
              error tracking via{' '}
              <ExternalLink href="//sentry.io">sentry</ExternalLink>
            </Feature>

            <Feature state={FeatureState.WIP}>
              basic PWA capabilities (caching & notifying service worker) via{' '}
              <ExternalLink href="//github.com/hanford/next-offline">
                next-offline
              </ExternalLink>
            </Feature>

            <Feature state={FeatureState.OPT}>
              React footprint reduced via{' '}
              <ExternalLink href="//preactjs.com">preact</ExternalLink>
            </Feature>
          </Stack>
        </Box>
      </Box>

      <Box as="section">
        <Heading as="h2" size="lg" mt={4} mb={2}>
          Demo
        </Heading>

        <Box backgroundColor={boxBg} borderRadius={5} m={1} p={1}>
          <DemoComponent
            title="Auth"
            description="SSR-compatible, httpOnly cookie-based authentication - try refreshing after logging in!"
            component={<AuthDemo />}
            features={[
              <>
                implements OAuth2 via <Code>passport.js</Code>
              </>,
              <>
                includes an <Code>{'<AuthContextProvider />'}</Code>, exposing a
                hook (<Code>useAuth</Code>)
              </>,
              <>
                includes a <Code>protectedResourceMiddleware</Code> as easy
                catch-all API route protection solution
              </>,
              <>
                ships with{' '}
                <Tooltip
                  label={ENABLED_PROVIDER.join(', ')}
                  aria-label={ENABLED_PROVIDER.join(', ')}
                >
                  <Badge variant="outline">{ENABLED_PROVIDER.length}*</Badge>
                </Tooltip>{' '}
                <Code>passport.js</Code> strategies
              </>,
            ]}
          />

          <Divider
            borderColor="teal.500"
            maxWidth="90%"
            ml="auto"
            mr="auto"
            mt={8}
            mb={8}
          />

          <DemoComponent
            title="Internationalization"
            description="SSR-compatible, cookie-based i18n demo - try refreshing after switching the language!"
            component={<LanguageSwitch mt={2} mb={2} />}
            features={[
              <>
                a premade component using{' '}
                <ExternalLink href="//github.com/umidbekkarimov/react-flag-kit">
                  <Code>react-flag-kit</Code>
                </ExternalLink>{' '}
                is included
              </>,
              <>
                a single request will be made to the <Code>/api/i18n</Code>{' '}
                endpoint
              </>,
              "previously fetched bundles won't be refetched",
              'serverless-compatible; all assets are automatically bundled at build time',
            ]}
            warning="only commonly used components will be translated; the boilerplate doesn't ship i18n for this throwaway index"
          />

          <Divider
            borderColor="teal.500"
            maxWidth="90%"
            ml="auto"
            mr="auto"
            mt={8}
            mb={8}
          />

          <DemoComponent
            title="Theming"
            description={
              <>
                <ExternalLink href="//chakra-ui.com/">
                  @chakra-ui/core
                </ExternalLink>{' '}
                components are automatically dark-mode compatible
              </>
            }
            component={
              <Stack isInline>
                <ThemeSwitch mt={2} mb={2} />
                <ThemeSwitchAlt ml={2} />
              </Stack>
            }
            features={[
              <>
                two premade components using{' '}
                <ExternalLink href="//react-icons.netlify.com/">
                  <Code>react-icons</Code>
                </ExternalLink>{' '}
                are included
              </>,
            ]}
            warning="until @chakra-ui/core v1 is released, automatic theme detection can be buggy"
          />
        </Box>
      </Box>

      <Box as="footer">MIT (c) @ljosberinn</Box>
    </Box>
  );
}
