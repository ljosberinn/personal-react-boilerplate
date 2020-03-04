import { withScope } from '@sentry/browser';
import React, { Component, lazy } from 'react';

import withSuspense from '../../hocs/withSuspense';

const ErrorUI = withSuspense(
  lazy(() =>
    import(/* webpackChunkName: "error_boundary.error_ui" */ './ErrorUI'),
  ),
);

class SentryErrorBoundary extends Component {
  state = {
    error: null,
  };

  componentDidCatch(error, errorInfo) {
    withScope(scope => {
      scope.setExtras(errorInfo);

      this.setState({ error });
    });
  }

  render() {
    if (this.state.error) {
      return <ErrorUI error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default SentryErrorBoundary;
