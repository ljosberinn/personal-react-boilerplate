import type { WithKarmaProps, KarmaSSGProps } from '../src/client/Karma';
import { KarmaSSG, createGetStaticProps } from '../src/client/Karma';
import { Index } from '../src/client/routes/Index';
import type { Namespace } from '../src/constants';

export type IndexPageProps = WithKarmaProps<KarmaSSGProps>;

// eslint-disable-next-line import/no-default-export
export default function IndexPage({ karma }: IndexPageProps): JSX.Element {
  return (
    <KarmaSSG {...karma}>
      <Index />
    </KarmaSSG>
  );
}

const i18nNamespaces: Namespace[] = ['serviceWorker', 'theme'];

export const getStaticProps = createGetStaticProps({ i18nNamespaces });

// import type { KarmaSSRProps, WithKarmaProps } from '../karma/client/Karma';
// import { KarmaSSR, createGetServerSideProps } from '../karma/client/Karma';
// import { Index } from '../src/client/routes/Index';
// import type { Namespace } from '../src/constants';

// export type IndexPageProps = WithKarmaProps<KarmaSSRProps>;

// // eslint-disable-next-line import/no-default-export
// export default function IndexPage({ karma }: IndexPageProps): JSX.Element {
//   return (
//     <KarmaSSR {...karma}>
//       <Index />
//     </KarmaSSR>
//   );
// }

// const i18nNamespaces: Namespace[] = ['serviceWorker', 'theme'];

// export const getServerSideProps = createGetServerSideProps({ i18nNamespaces });
