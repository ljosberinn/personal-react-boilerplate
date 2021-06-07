/* istanbul ignore file */
import Head from 'next/head';

// import { createGetServerSideProps } from '../../src/client/karma/getServerSideProps';
import { createGetStaticProps } from '../client/karma/getStaticProps';
import { layoutWithKarma } from '../client/karma/layout';
import type { LayoutCreator } from '../client/karma/layout';
import { CommonLayout } from '../client/layouts/CommonLayout';
import { Index } from '../client/routes/Index';
import type { Namespace } from '../constants';

export default function IndexPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Karma | is to Next.js what React is to Javascript</title>
      </Head>
      <Index />
    </>
  );
}

const createLayout: LayoutCreator = (page) => (
  <CommonLayout>{page}</CommonLayout>
);

IndexPage.withLayout = layoutWithKarma(createLayout);

const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

export const getStaticProps = createGetStaticProps({
  i18n: {
    namespaces,
  },
});

// export const getServerSideProps = createGetServerSideProps({
//   i18n: {
//     namespaces,
//   },
// });
