import type { KarmaSSGProps, WithKarmaProps } from '../karma/client/Karma';
import { KarmaSSG, createGetStaticProps } from '../karma/client/Karma';
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
