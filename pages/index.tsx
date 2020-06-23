import { Profiler } from '@sentry/react';
import React from 'react';

import IndexPage from '../src/client/routes/Index';

export default function Index() {
  return (
    <Profiler name="Index">
      <IndexPage />
    </Profiler>
  );
}
