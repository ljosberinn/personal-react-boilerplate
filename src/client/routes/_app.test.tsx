/* eslint-disable jest/require-top-level-describe */
import { render } from '@testing-library/react';
import { Router } from 'next/router';
import React from 'react';
import 'whatwg-fetch';

import App, { AppRenderProps } from '../../../pages/_app';
import * as sentryUtils from '../../utils/sentry/client';

const defaultProps: AppRenderProps = {
  Component: () => null,
  pageProps: {
    cookies: '',
    i18nBundle: { namespace: {} },
    language: 'en',
    session: null,
  },
  router: new Router('/', {}, '', {
    App: () => null,
    Component: () => null,
    initialProps: {},
    isFallback: false,
    pageLoader: undefined,
    subscription: async () => {},
    wrapApp: () => {},
  }),
};

describe('<App />', () => {
  it('renders without crashing given default props', () => {
    render(<App {...defaultProps} />);
  });

  it('attaches routing breadcrumbs to Sentry', () => {
    const attachRoutingContextSpy = jest.spyOn(
      sentryUtils,
      'attachRoutingContext'
    );

    render(<App {...defaultProps} />);

    expect(attachRoutingContextSpy).toHaveBeenCalledWith(
      expect.any(Router),
      expect.any(String)
    );
  });
});
