import Head from 'next/head';

import type { WithLayoutHandler } from '../../../src/client/Karma';
import {
  createGetStaticProps,
  createStaticI18nPaths,
} from '../../../src/client/Karma';
import { CommonLayout } from '../../../src/client/layouts/CommonLayout';
import { DocsIndex } from '../../../src/client/routes/Docs';
import type { Namespace } from '../../../src/constants';

// eslint-disable-next-line import/no-default-export
export default function Docs(): JSX.Element {
  return (
    <>
      <Head>
        <title>Karma | Documentation</title>
      </Head>
      <DocsIndex />
    </>
  );
}

const withLayout: WithLayoutHandler = (page) => (
  <CommonLayout>{page}</CommonLayout>
);

Docs.withLayout = withLayout;

const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

export const getStaticPaths = createStaticI18nPaths();
export const getStaticProps = createGetStaticProps({
  i18n: {
    namespaces,
  },
});
