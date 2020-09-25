import type { OutgoingHttpHeaders } from 'http';
import type { GetServerSidePropsContext } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { getSession } from '../../server/auth/cookie';
import { FOUND_MOVED_TEMPORARILY } from '../../utils/statusCodes';
import type { User } from '../context/AuthContext/AuthContext';

export interface WithSessionOptions {
  /**
   * Response Status Code, defaults to 302
   */
  status?: number;
  /**
   * Response Headers, defaults to a Redirect to /
   */
  headers?: OutgoingHttpHeaders;
}

/**
 * monkey patch GetServerSideProps
 */
type AuthenticatedGetServerSideProps<
  P extends Record<string, unknown> = Record<string, unknown>,
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (
  context: GetServerSidePropsContext<Q>,
  session: User
) => Promise<{ props: P }> | { props: P };

type WithSessionReturn =
  | Promise<{
      props: Record<string, unknown>;
    }>
  | {
      props: {};
    };

/**
 * Protects a route using getServerSideProps by expection a session
 * Given no session, redirects to options.headers.Location, defaulting to /
 */
export const withSession = (
  handler: AuthenticatedGetServerSideProps,
  {
    headers = { Location: '/' },
    status = FOUND_MOVED_TEMPORARILY,
  }: WithSessionOptions = {}
) => (ctx: GetServerSidePropsContext): WithSessionReturn => {
  const session = getSession(ctx.req);

  if (!session) {
    ctx.res.writeHead(status, headers).end();

    return Promise.resolve({
      props: {},
    });
  }

  return handler(ctx, session);
};
