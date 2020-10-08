import type { WithKarmaProps, KarmaSSGProps } from '../../src/client/Karma';
import {
  KarmaSSG,
  createGetStaticProps,
  createStaticI18nPaths,
} from '../../src/client/Karma';
import { Index } from '../../src/client/routes/Index';
import type { Namespace } from '../../src/constants';

export type IndexPageProps = WithKarmaProps<KarmaSSGProps>;

// eslint-disable-next-line import/no-default-export
export default function IndexPage({ karma }: IndexPageProps): JSX.Element {
  return (
    <KarmaSSG {...karma}>
      <Index />
    </KarmaSSG>
  );
}

const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

export const getStaticPaths = createStaticI18nPaths();
export const getStaticProps = createGetStaticProps({
  i18n: {
    namespaces,
  },
});

// import type { WithKarmaProps, KarmaSSRProps } from '../../src/client/Karma';
// import { createGetServerSideProps, KarmaSSR } from '../../src/client/Karma';
// import { Index } from '../../src/client/routes/Index';
// import type { Namespace } from '../../src/constants';

// export type IndexPageProps = WithKarmaProps<KarmaSSRProps>;

// // eslint-disable-next-line import/no-default-export
// export default function IndexPage({ karma }: IndexPageProps): JSX.Element {
//   return (
//     <KarmaSSR {...karma}>
//       <Index />
//     </KarmaSSR>
//   );
// }

// const namespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

// export const getServerSideProps = createGetServerSideProps({
//   i18n: {
//     namespaces,
//   },
// });
