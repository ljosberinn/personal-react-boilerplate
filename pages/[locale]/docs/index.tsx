import Head from 'next/head';

import type { LayoutCreator } from '../../../src/client/Karma';
import {
  createGetStaticProps,
  createStaticI18nPaths,
  withKarma,
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

const createLayout: LayoutCreator = (page) => (
  <CommonLayout>{page}</CommonLayout>
);

Docs.withLayout = withKarma(createLayout);

const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

export const getStaticPaths = createStaticI18nPaths();
export const getStaticProps = createGetStaticProps({
  i18n: {
    namespaces,
  },
});

// import Head from 'next/head';

// import type { LayoutCreator } from '../../../src/client/Karma';
// import { createGetServerSideProps, withKarma } from '../../../src/client/Karma';
// import { CommonLayout } from '../../../src/client/layouts/CommonLayout';
// import { DocsIndex } from '../../../src/client/routes/Docs';
// import type { Namespace } from '../../../src/constants';

// // eslint-disable-next-line import/no-default-export
// export default function Docs(): JSX.Element {
//   return (
//     <>
//       <Head>
//         <title>Karma | Documentation</title>
//       </Head>
//       <DocsIndex />
//     </>
//   );
// }

// const createLayout: LayoutCreator = (page) => (
//   <CommonLayout>{page}</CommonLayout>
// );

// Docs.withLayout = withKarma(createLayout);

// const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

// export const getServerSideProps = createGetServerSideProps({
//   i18n: {
//     namespaces,
//   },
// });
