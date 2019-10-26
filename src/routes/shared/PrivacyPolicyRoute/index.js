import React from 'react';
import Helmet from 'react-helmet';
import { Section } from 'rbx';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | {process.env.REACT_APP_BRAND_NAME}</title>
      </Helmet>
      <Section>
        <h1>WIP</h1>
      </Section>
    </>
  );
}
