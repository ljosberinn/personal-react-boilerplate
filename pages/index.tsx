import type { WithKarma } from '../karma/client/Karma';
import { KarmaProvider, createGetServerSideProps } from '../karma/client/Karma';
import type { Namespace } from '../karma/server/i18n/cache';
import { Index } from '../src/client/routes/Index';

export type IndexPageProps = WithKarma;

// eslint-disable-next-line import/no-default-export
export default function IndexPage({ karma }: IndexPageProps): JSX.Element {
  return (
    <KarmaProvider {...karma}>
      <Index />
    </KarmaProvider>
  );
}

const i18nNamespaces: Namespace[] = ['serviceWorker', 'theme', 'i18n'];

export const getServerSideProps = createGetServerSideProps({ i18nNamespaces });
