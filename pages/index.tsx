import { WithKarma, KarmaProvider } from '../src/client/Karma';
import { Index } from '../src/client/routes/Index';

export type IndexPageProps = WithKarma;

// eslint-disable-next-line import/no-default-export
export default function IndexPage({ karma }: IndexPageProps) {
  return (
    <KarmaProvider {...karma}>
      <Index />
    </KarmaProvider>
  );
}

export { getServerSideProps } from '../src/client/Karma';
