import { OutgoingHttpHeaders } from 'http';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { getSession } from '../../server/auth/cookie';
import { FOUND_MOVED_TEMPORARILY } from '../../utils/statusCodes';
import { User } from '../context/AuthContext/AuthContext';

export interface WithSessionOptions {
  /**
   * Response Status Code, defaults to 302
   */
  status: number;
  /**
   * Response Headers, defaults to a Redirect to /
   */
  headers?: OutgoingHttpHeaders;
}

const defaultOptions = {
  headers: { Location: '/' },
  status: FOUND_MOVED_TEMPORARILY,
};

type AuthenticatedGetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (
  context: GetServerSidePropsContext<Q>,
  session: User
) => Promise<{ props: P }> | { props: P };

export const withSession = (
  handler: AuthenticatedGetServerSideProps,
  { headers, status }: WithSessionOptions = defaultOptions
) => async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx.req);

  if (!session) {
    ctx.res?.writeHead(status, headers).end();

    return {
      props: {},
    };
  }

  return await handler(ctx, session);
};
