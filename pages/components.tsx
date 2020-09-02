import type { WithKarma } from '../karma/client/Karma';
import { KarmaProvider, createGetServerSideProps } from '../karma/client/Karma';
import type { Namespace } from '../karma/server/i18n/cache';

// eslint-disable-next-line import/no-default-export
export default function Components({ karma }: WithKarma): JSX.Element {
  return (
    <KarmaProvider {...karma}>
      <h1>hi</h1>
    </KarmaProvider>
  );
}

const i18nNamespaces: Namespace[] = ['serviceWorker', 'theme'];

export const getServerSideProps = createGetServerSideProps({ i18nNamespaces });
