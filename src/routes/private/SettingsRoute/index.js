import React from 'react';
import Helmet from 'react-helmet';
import { Section, Title, Box, Column } from 'rbx';
import AccountSettings from './AccountSettings';
import SiteSettings from './SiteSettings';

export default function Settings() {
  return (
    <>
      <Helmet>
        <title>Settings | {process.env.REACT_APP_BRAND_NAME}</title>
      </Helmet>
      <Section className="settings-bg">
        <Column.Group centered multiline>
          <Column size={10}>
          <Title>Settings</Title>
          </Column>
        
          <Column size={5}>
            <Box>
              <SiteSettings />
            </Box>
          </Column>
          <Column size={5}>
            <Box>
              <AccountSettings />
            </Box>
          </Column>
        </Column.Group>
      </Section>
    </>
  );
}
