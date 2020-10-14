import Head from 'next/head';

import type { WithLayoutHandler } from '../../src/client/Karma';
import {
  createGetStaticProps,
  createStaticI18nPaths,
} from '../../src/client/Karma';
import { CommonLayout } from '../../src/client/layouts/CommonLayout';
import { Index } from '../../src/client/routes/Index';
import type { Namespace } from '../../src/constants';

// eslint-disable-next-line import/no-default-export
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

const withLayout: WithLayoutHandler = (page) => (
  <CommonLayout>{page}</CommonLayout>
);

IndexPage.withLayout = withLayout;

const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

export const getStaticPaths = createStaticI18nPaths();
export const getStaticProps = createGetStaticProps({
  i18n: {
    namespaces,
  },
});

// import type { WithLayoutHandler } from '../../src/client/Karma';
// import { createGetServerSideProps } from '../../src/client/Karma';
// import { CommonLayout } from '../../src/client/layouts/CommonLayout';
// import { Index } from '../../src/client/routes/Index';
// import type { Namespace } from '../../src/constants';

// // eslint-disable-next-line import/no-default-export
// export default function IndexPage(): JSX.Element {
//   return <Index />;
// }

// const withLayout: WithLayoutHandler = (page) => (
//   <CommonLayout>{page}</CommonLayout>
// );

// IndexPage.withLayout = withLayout;

// const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

// export const getServerSideProps = createGetServerSideProps({
//   i18n: {
//     namespaces,
//   },
// });
