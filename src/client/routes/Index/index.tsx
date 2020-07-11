import { Box, Grid, Tooltip, Code } from '@chakra-ui/core';
import React from 'react';

import { ENABLED_PROVIDER } from '../../../constants';
import { ExternalLink } from '../../components/common/ExternalLink';
import { Feature } from './Feature';
import { ChakraIcon } from './icons/ChakraIcon';
import { ESLintIcon } from './icons/ESLintIcon';
import { GithubActionsLogo } from './icons/GithubActionsIcon';
import { I18NextIcon } from './icons/I18NextIcon';
import { JestIcon } from './icons/JestIcon';
import { NextIcon } from './icons/NextIcon';
import { OAuth2Icon } from './icons/OAuth2Icon';
import { PWAIcon } from './icons/PWAIcon';
import { SentryIcon } from './icons/SentryIcon';
import { TypeScriptIcon } from './icons/TypeScriptIcon';

export function IndexPage() {
  return (
    <Box maxWidth="72rem" ml="auto" mr="auto">
      <Grid
        templateColumns={{ lg: 'repeat(3, 1fr)', md: 'repeat(1, 1fr)' }}
        gap={10}
        px={{ md: 12 }}
      >
        <Feature icon={NextIcon} title="Next.js">
          Built in Next.js, NAME can near seamlessly integrate into existing
          apps or serve as starting point for new projects.
        </Feature>

        <Feature icon={TypeScriptIcon} title="TypeScript">
          To ensure scalability, long-term robustness and decent autocompletion.
        </Feature>

        <Feature icon={ChakraIcon} title="Chakra">
          Chakra provides simple, modular and accessible low-level building
          blocks. By default, it's visually similar to Tailwind and offers every
          customization possible.
        </Feature>

        <Feature icon={I18NextIcon} title="react-i18next">
          A Serverless- & SSR-compatible, JSON-based i18n solution is
          implemented via{' '}
          <ExternalLink href="https://react.i18next.com/">
            react-i18next
          </ExternalLink>
          . Assets can be exchanged on the fly through an API route.
        </Feature>

        <Feature icon={OAuth2Icon} title="OAuth2">
          Support for{' '}
          <Tooltip label={ENABLED_PROVIDER.join(', ')}>
            4 external providers
          </Tooltip>{' '}
          is included out of the box as well as means to implement homegrown
          authentication, all based on httpOnly cookies.
        </Feature>

        <Feature icon={SentryIcon} title="Sentry">
          Miss no bugs with{' '}
          <ExternalLink href="http://sentry.io/">Sentry</ExternalLink>, neither
          on the frontend, nor in Next.js core functionality or API routes.
          Every deploy creates a new release, separately visible in Sentrys
          dashboard.
        </Feature>

        <Feature icon={JestIcon} title="Jest">
          All tests, integration or unit, run through Jest. To test API routes,
          a <Code>testLambda</Code> function is included. NAME comes with 90%
          code coverage out of the box.
        </Feature>

        <Feature img="/testing-lib.png" title="@testing-library/react">
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

        <Feature icon={GithubActionsLogo} title="Github Actions">
          Before deploying, Github Actions will ensure your linting setup,
          typecheck, execute tests as well as upload code coverage to{' '}
          <ExternalLink href="https://codeclimate.com/">
            CodeClimate
          </ExternalLink>
          .
        </Feature>

        <Feature icon={PWAIcon} title="PWA">
          Thanks to{' '}
          <ExternalLink href="https://github.com/hanford/next-offline">
            next-offline
          </ExternalLink>
          , a ServiceWorker will be created on each deploy. An example component
          notifying users on found updates is included. To prevent being too
          opinionated here, no other PWA capabilities are included
        </Feature>

        <Feature icon={ESLintIcon} title="ESLint">
          Built on top of industry standards & community best practices, NAME
          comes with{' '}
          <ExternalLink href="https://github.com/ljosberinn/eslint-config-galex">
            my personal eslint config
          </ExternalLink>
          . You may of course swap at any time.
        </Feature>
      </Grid>
    </Box>
  );
}
