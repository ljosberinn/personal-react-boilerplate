import React from 'react';
import Helmet from 'react-helmet';
import { Section } from 'rbx';

export default function Settings() {
  return (
    <>
      <Helmet>
        <title>Settings | {process.env.REACT_APP_BRAND_NAME}</title>
      </Helmet>
      <Section>
        <h1>WIP</h1>
      </Section>
    </>
  );
}
