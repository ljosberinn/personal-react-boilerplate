import { WithKarma, KarmaProvider } from '../karma/client/Karma';
import { Index } from '../karma/client/routes/Index';

export type IndexPageProps = WithKarma;

// eslint-disable-next-line import/no-default-export
export default function IndexPage({ karma }: IndexPageProps): JSX.Element {
  return (
    <KarmaProvider {...karma}>
      <Index />
    </KarmaProvider>
  );
}

export { getServerSideProps } from '../karma/client/Karma';
