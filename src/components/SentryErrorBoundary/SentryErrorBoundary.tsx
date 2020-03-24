import { withScope } from '@sentry/browser';
import React, { Component, ErrorInfo } from 'react';

interface Props {}

interface State {
  error: Error | null;
}

export default class SentryErrorBoundary extends Component<Props, State> {
  state = {
    error: null,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    withScope(scope => {
      scope.setExtras(errorInfo);

      this.setState({ error });
    });
  }

  render() {
    if (this.state.error) {
      return <h1>an error happened</h1>;
    }

    return this.props.children;
  }
}
