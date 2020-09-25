import * as sentryReact from '@sentry/react';
import { render } from '@testing-library/react';
import { Router } from 'next/router';

import 'whatwg-fetch';

import type { AppRenderProps } from '../../../pages/_app';
import App, { reportWebVitals } from '../../../pages/_app';
import { createMockScope } from '../../../testUtils/sentry';
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
    initialStyleSheets: [],
    isFallback: false,
    pageLoader: undefined,
    subscription: jest.fn(),
    wrapApp: jest.fn(),
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

    const setContextSpy = jest.fn();
    const configureScopeSpy = jest
      .spyOn(sentryReact, 'configureScope')
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      .mockImplementationOnce((callback) =>
        // eslint-disable-next-line promise/prefer-await-to-callbacks
        callback(createMockScope({ setContext: setContextSpy }))
      );

    render(<App {...defaultProps} />);

    expect(attachRoutingContextSpy).toHaveBeenCalledWith(
      expect.any(Router),
      expect.any(String)
    );

    expect(configureScopeSpy).toHaveBeenCalledTimes(1);
    expect(setContextSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        asPath: expect.any(String),
        pathname: expect.any(String),
        query: expect.any(Object),
        route: expect.any(String),
      })
    );
  });
});

describe('reportWebVitals', () => {
  it('attaches context on @sentry/browser', () => {
    const mockMetric = {
      id: '',
      label: '',
      name: '',
      startTime: Date.now(),
      value: 1,
    };

    const setContextSpy = jest.fn();
    const configureScopeSpy = jest
      .spyOn(sentryReact, 'configureScope')
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      .mockImplementationOnce((callback) =>
        // eslint-disable-next-line promise/prefer-await-to-callbacks
        callback(createMockScope({ setContext: setContextSpy }))
      );

    reportWebVitals(mockMetric);

    expect(configureScopeSpy).toHaveBeenCalledTimes(1);
    expect(setContextSpy).toHaveBeenCalledWith(expect.any(String), mockMetric);
  });
});
