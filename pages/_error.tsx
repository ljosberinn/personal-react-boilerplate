import { NextPageContext } from 'next';
import React from 'react';

import { INTERNAL_SERVER_ERROR, NOT_FOUND } from '../src/utils/statusCodes';

interface ErrorProps {
  statusCode: number | null | undefined;
}

export default function ErrorPage({ statusCode }: ErrorProps) {
  if (statusCode === NOT_FOUND) {
    return <h1>404</h1>;
  }

  if (statusCode === INTERNAL_SERVER_ERROR) {
    return <h1>sever error</h1>;
  }

  return <h1>client side error</h1>;
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;

  return { statusCode };
};
