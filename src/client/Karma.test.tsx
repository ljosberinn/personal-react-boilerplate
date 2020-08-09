import { render } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

import {
  makeMockIncomingRequest,
  makeMockServerResponse,
} from '../../testUtils/api';
import { i18nCache } from '../server/i18n/cache';
import {
  KarmaProvider,
  KarmaProps,
  GetServerSidePropsHandler,
  getServerSideProps,
  withServerSideProps,
} from './Karma';

const defaultProps: KarmaProps = {
  cookies: '',
  i18nBundle: i18nCache.de,
  language: 'en',
  session: null,
};

describe('<KarmaProvider />', () => {
  it.skip('renders without crashing given default props', () => {
    render(<KarmaProvider {...defaultProps}>next-karma</KarmaProvider>);
  });

  test.todo('initializes i18next');
});

const mockCtx: GetServerSidePropsContext = {
  query: {},
  req: makeMockIncomingRequest(),
  res: makeMockServerResponse(),
};

describe('getServerSideProps', () => {
  test.skip('returns a promise', () => {
    expect(getServerSideProps(mockCtx)).toBeInstanceOf(Promise);
  });

  test.skip('matches expected shape', async () => {
    const result = await getServerSideProps(mockCtx);

    expect(result).toMatchObject({
      props: {
        karma: {
          cookies: expect.any(String),
          i18nBundle: expect.any(Object),
          language: expect.any(String),
          session: null,
        },
      },
    });
  });

  test.todo('attaches initial sentry context');

  test.todo('loads session');

  test.todo('detects language');

  test.todo('loads i18n bundle');
});

const handler: GetServerSidePropsHandler<{ foo: number }> = () => {
  return {
    props: { foo: 1 },
  };
};

describe('withServerSideProps', () => {
  test.skip('returns a function', () => {
    const augmented = withServerSideProps(handler);

    expect(augmented).toBeInstanceOf(Function);
  });
});
